using Lenden.Core.UserFeatures;
using Lenden.Core.UserGroupFeatures;

namespace Lenden.Core.GroupFeatures;

public class GroupEntity
{
    protected GroupEntity()
    {
        
    }
    public GroupEntity(string name, string imageUrl,int createdBy)
    {
        Name = name;
        ImageUrl = imageUrl;
        CreatedBy = createdBy;
        CreatedDate=DateOnly.FromDateTime(DateTime.Now);
        CreatedTime=TimeOnly.FromDateTime(DateTime.Now);
        UpdatedDate=DateOnly.FromDateTime(DateTime.Now);
        UpdatedTime=TimeOnly.FromDateTime(DateTime.Now);
    }
    
    public int Id { get; set; }
    public string Name { get; set; }
    public string ImageUrl { get; set; }
    public int CreatedBy { get; set; }
    public UserEntity CreatedByUser { get; set; }
    public DateOnly CreatedDate { get; set; }
    public TimeOnly CreatedTime { get; set; }
    public DateOnly UpdatedDate { get; set; }
    public TimeOnly UpdatedTime { get; set; }
    public ICollection<UserGroupEntity> UserGroups { get; private set; } = new List<UserGroupEntity>();
    

    public void UpdateTimeStamp()
    {
        UpdatedDate=DateOnly.FromDateTime(DateTime.Now);
        UpdatedTime=TimeOnly.FromDateTime(DateTime.Now);
    }
}