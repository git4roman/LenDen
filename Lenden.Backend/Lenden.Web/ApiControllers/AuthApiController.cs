using System.Security.Claims;
using Lenden.Core;
using Lenden.Core.UserFeatures;
using Lenden.Core.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Lenden.Web.ApiControllers;

[ApiController]
[Route("api/[controller]")]
public class AuthApiController: ControllerBase
{
   
    private readonly IUnitOfWork _unitOfWork;
    private readonly JwtService _jwtService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly CurrentUserHelper _currentUserHelper;
    private PasswordHasher<UserEntity> _passwordHasher;
    public AuthApiController(IUnitOfWork unitOfWork,IOptions<JwtService> jwtOptions,IHttpContextAccessor httpContextAccessor,CurrentUserHelper currentUserHelper,PasswordHasher<UserEntity> passwordHasher)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtOptions.Value;
        _httpContextAccessor = httpContextAccessor;
        _currentUserHelper = currentUserHelper;
        _passwordHasher = passwordHasher;
    }
    
    [HttpPost("auth/register")]
    public async Task<IActionResult> Register(UserRegisterDto dto)
    {
        try
        {
            if (dto.AuthProvider == "google")
            {
                var existingUser = await _unitOfWork.User.GetUserByUidAsync(dto.GoogleId);
                if (existingUser == null)
                {
                    var createdUser = new UserEntity(dto.Email, dto.FullName, dto.GoogleId, dto.PictureUrl,
                        dto.AuthProvider);
                    await _unitOfWork.User.AddAsync(createdUser);
                    await _unitOfWork.SaveChangesAsync();
                    return Ok(new { token = SetJwtCookie(createdUser) });
                }
                return Conflict(new {message = "User already exists" });
                
            }
            else if (dto.AuthProvider == "email")
            {
                var existingUser = await _unitOfWork.User.GetUserByEmailAsync(dto.Email);
                if (existingUser == null)
                {
                    var createdUser = new UserEntity(dto.Email, dto.FullName, dto.GoogleId, dto.PictureUrl,dto.AuthProvider);
                    string passwordHash = _passwordHasher.HashPassword(createdUser, dto.Password);
                    createdUser.PasswordHash = passwordHash;
                    await _unitOfWork.User.AddAsync(createdUser);
                    await _unitOfWork.SaveChangesAsync();
                    return Ok(new { token = SetJwtCookie(createdUser) });
                }
                return Conflict(new {message = "User already exists" });
                
            }
            else
            {
                return BadRequest(new {message = "Invalid auth provider"});
            }
        }
        catch (Exception e)
        {
           return BadRequest(new {message = e.Message});
        }
    }
    
    [HttpPost("auth/login")]
    public async Task<IActionResult> Login(UserLoginDto dto)
    {
        if (dto.AuthProvider == "google")
        {
            var existingUser = await _unitOfWork.User.GetUserByUidAsync(dto.GoogleId);
            if (existingUser == null) return NotFound("User does not exist");
            return Ok(new { token = SetJwtCookie(existingUser) });
        }
        else if (dto.AuthProvider == "email")
        {
            var existingUser = await _unitOfWork.User.GetUserByEmailAsync(dto.Email);
            if (existingUser == null) return NotFound("User does not exist");
            var result = _passwordHasher.VerifyHashedPassword(existingUser, existingUser.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Incorrect password" });    
            return Ok(new { token = SetJwtCookie(existingUser) });
        }
        else
        {
            return BadRequest(new {message = "Invalid auth provider"});
        }
    }
    
    public class UserRegisterDto
    {
        public string AuthProvider { get; set; }
        public string GoogleId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PictureUrl { get; set; }
        public string Password { get; set; }
    }
    public class UserLoginDto
    {
        public string AuthProvider { get; set; }
        public string GoogleId { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
    }
    
    private string GenerateJwtToken(UserEntity user)
    { 
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };
        
        return _jwtService.GenerateToken(claims);
    }

    private ClaimsPrincipal? DecodeJwtToken(string token)
    {
        return _jwtService.ValidateToken(token);
    }

    private string SetJwtCookie(UserEntity user)
    {
        var token = GenerateJwtToken(user);
        _httpContextAccessor.HttpContext.Response.Cookies.Append("c_user", token, new CookieOptions
        {
            HttpOnly = true,
            Secure = false,
            SameSite = SameSiteMode.Lax,
            Expires = DateTime.UtcNow.AddDays(_jwtService.ExpiresInDays)
        });
        return token;
    }
    
    [Authorize]
    [HttpGet("me")]
    public IActionResult GetLoggedInUser()
    {
        var authHeader = HttpContext.Request.Headers["Authorization"].ToString();
        var (userId, email, role) = _currentUserHelper.GetUserInfo();
        Console.WriteLine($"User ID: {userId}, Email: {email}, Role: {role}");
        if (userId == null)
            return Unauthorized("User not logged in.");

        return Ok(new { UserId = userId, Email = email, Role = role });
    }
    
    

    
    
}