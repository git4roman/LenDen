using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace Lenden.Core.Utilities;

public class CurrentUserHelper
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public CurrentUserHelper(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }
    
    public int? GetUserId() => GetClaimInt(ClaimTypes.NameIdentifier);
    public string? GetUserEmail() => GetClaim(ClaimTypes.Email);
    public string? GetUserRole() => GetClaim(ClaimTypes.Role);

    public (int? Id, string? Email, string? Role) GetUserInfo()
    {
        return (GetUserId(), GetUserEmail(), GetUserRole());
    }

    private string? GetClaim(string claimType) =>
        _httpContextAccessor.HttpContext?.User?.FindFirst(claimType)?.Value;

    private int? GetClaimInt(string claimType)
    {
        var value = GetClaim(claimType);
        return int.TryParse(value, out var id) ? id : null;
    }
}