using Lenden.Core.GroupFeatures;
using Lenden.Core.UserFeatures;

namespace Lenden.Core.UserGroupFeatures;

public class UserGroupEntity
{
    protected UserGroupEntity() { }

    public UserGroupEntity(int userId, int groupId)
    {
        UserId = userId;
        GroupId = groupId;
    }
    
    public int UserId { get; set; }
    public int GroupId { get; set; }
    public UserEntity User { get; set; }
    public GroupEntity Group { get; set; }
}