using System.Security.Claims;
using Lenden.Core;
using Lenden.Core.UserFeatures;
using Lenden.Core.Utilities;
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
    public AuthApiController(IUnitOfWork unitOfWork,IOptions<JwtService> jwtOptions,IHttpContextAccessor httpContextAccessor)
    {
        _unitOfWork = unitOfWork;
        _jwtService = jwtOptions.Value;
        _httpContextAccessor = httpContextAccessor;
    }
    
    
    
    [HttpPost("login")]
    public async Task<IActionResult> Login(string uid)
    
    {
        var existingUser = await _unitOfWork.User.GetUserByUidAsync(uid);
        if (existingUser == null) return NotFound("User not found");
        
       var token= SetJwtCookie(existingUser);
        return Ok(new { token });
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
    
    
}