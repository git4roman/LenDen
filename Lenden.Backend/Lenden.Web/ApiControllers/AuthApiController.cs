using System.Security.Claims;
using Lenden.Core;
using Lenden.Core.UserFeatures;
using Lenden.Core.Utilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
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
    public AuthApiController(IUnitOfWork unitOfWork,IOptions<JwtService> jwtOptions,IHttpContextAccessor httpContextAccessor,CurrentUserHelper currentUserHelper)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtOptions.Value;
        _httpContextAccessor = httpContextAccessor;
        _currentUserHelper = currentUserHelper;
    }
    
    [HttpPost("authenticate")]
    public async Task<IActionResult> Authenticate(UserAuthDto dto)
    {
        var existingUser = await _unitOfWork.User.GetUserByUidAsync(dto.GoogleId);
        if (existingUser == null)
        {
            var createdUser = new UserEntity(dto.Email, dto.FullName, dto.GoogleId, dto.PictureUrl);
            await _unitOfWork.User.AddAsync(createdUser);
            await _unitOfWork.SaveChangesAsync();
            return Ok(new { token = SetJwtCookie(createdUser) });
        }
        return Ok(new { token= SetJwtCookie(existingUser) });
    }
    public class UserAuthDto
    {
        public string GoogleId { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public string PictureUrl { get; set; }
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
        // _httpContextAccessor.HttpContext.Response.Cookies.Append("c_user", token, new CookieOptions
        // {
        //     HttpOnly = true,
        //     Secure = false,
        //     SameSite = SameSiteMode.Lax,
        //     Expires = DateTime.UtcNow.AddDays(_jwtService.ExpiresInDays)
        // });
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