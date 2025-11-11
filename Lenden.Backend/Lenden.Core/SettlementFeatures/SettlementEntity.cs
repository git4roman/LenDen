using Lenden.Core.GroupFeatures;
using Lenden.Core.UserFeatures;

namespace Lenden.Core.SettlementFeatures;

public class SettlementEntity
{
    protected SettlementEntity() { }
    public SettlementEntity(int groupId,int fromUserId, int toUserId, decimal amount)
    {
        GroupId = groupId;
        FromUserId = fromUserId;
        ToUserId = toUserId;
        Amount = amount;
        CreatedDate = DateOnly.FromDateTime(DateTime.Now);
        CreatedAt = TimeOnly.FromDateTime(DateTime.Now);
    }
    public int Id {get; set;}
    public int GroupId {get; set;}
    public virtual GroupEntity Group {get; set;}
    public int FromUserId {get; set;}
    public UserEntity FromUser {get; set;}
    public int ToUserId {get; set;}
    public UserEntity ToUser {get; set;}
    public decimal Amount {get; set;}
    public DateOnly CreatedDate {get; set;}
    public TimeOnly CreatedAt {get; set;}
    
}