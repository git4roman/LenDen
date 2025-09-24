using Lenden.Core.UserGroupFeatures;

namespace Lenden.Core.UserFeatures;

public class UserEntity
{
    protected UserEntity()
    {
    }

    
    // public UserEntity(string googleId, string email, string fullName, string? givenName = null, string? familyName = null, string? pictureUrl = null)
    // {
    //     GoogleId = googleId;
    //     Email = email;
    //     FullName = fullName;
    //     GivenName = givenName;
    //     FamilyName = familyName;
    //     PictureUrl = pictureUrl;
    //     CreatedAt = DateTime.UtcNow;
    //     IsActive = true;
    // }
    public UserEntity(string email, string fullName,string googleId,string pictureUrl)
    {
        GoogleId = googleId;
        Email = email;
        FullName = fullName;
        PictureUrl = pictureUrl;
        // GivenName = givenName;
        // FamilyName = familyName;
        // PictureUrl = pictureUrl;
        CreatedAt = DateOnly.FromDateTime(DateTime.Now);
        IsActive = true;
        Role = "user";
    }

    public int Id { get; private set; }
    public string GoogleId { get; private set; } 
    public string Email { get; private set; } 
    public string FullName { get; private set; } 
    public string? GivenName { get; private set; } 
    public string? PictureUrl { get; private set; } 
    public bool EmailVerified { get; set; }
    public DateOnly CreatedAt { get; private set; } 
    public bool IsActive { get; private set; }
    
    public string Role { get; private set; }
    public ICollection<UserGroupEntity> UserGroups { get; private set; } = new List<UserGroupEntity>();
    


}