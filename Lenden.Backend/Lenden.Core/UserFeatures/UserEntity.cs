using Lenden.Core.UserGroupFeatures;

namespace Lenden.Core.UserFeatures;

public class UserEntity
{
    protected UserEntity()
    {
    }
    
    public UserEntity(string email, string fullName,string googleId,string pictureUrl,string authProvider)
    {
        GoogleId = googleId;
        Email = email;
        FullName = fullName;
        PictureUrl = pictureUrl;
        CreatedAt = DateOnly.FromDateTime(DateTime.Now);
        IsActive = true;
        Role = "user";
        AuthProvider = authProvider;
    }
    
    public int Id { get; private set; }
    public string GoogleId { get; private set; } 
    public string Email { get; private set; } 
    public string FullName { get; private set; } 
    public string? GivenName { get; private set; } 
    public string AuthProvider { get; private set; }
    public string? PasswordHash { get; set; } = String.Empty;
    public string? PictureUrl { get; private set; } 
    public bool EmailVerified { get; set; }
    public DateOnly CreatedAt { get; private set; } 
    public bool IsActive { get; private set; }
    public string? PhoneHash { get; set; }
    
    public string Role { get; private set; }
    public ICollection<UserGroupEntity> UserGroups { get; private set; } = new List<UserGroupEntity>();
    


}