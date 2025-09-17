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
    public UserEntity(string email, string fullName,string googleId)
    {
        GoogleId = googleId;
        Email = email;
        FullName = fullName;
        // GivenName = givenName;
        // FamilyName = familyName;
        // PictureUrl = pictureUrl;
        CreatedAt = DateOnly.FromDateTime(DateTime.Now);
        IsActive = true;
    }

    public int Id { get; private set; }
    public string GoogleId { get; private set; } 
    public string Email { get; private set; } 
    public string FullName { get; private set; } 
    public string? GivenName { get; private set; } 
    public string? FamilyName { get; private set; } 
    public string? PictureUrl { get; private set; } 
    public DateOnly CreatedAt { get; private set; } 
    public bool IsActive { get; private set; }
    


}