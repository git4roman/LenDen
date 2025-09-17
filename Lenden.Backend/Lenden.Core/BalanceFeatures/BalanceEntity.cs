using Lenden.Core.GroupFeatures;

namespace Lenden.Core.BalanceFeatures;

public class BalanceEntity
{
    protected BalanceEntity(){}

    public BalanceEntity(int groupId, int ownerId, int owedById, double amount)
    {
        GroupId = groupId;
        Amount = amount;
        OwnerId = ownerId;
        OwedById = owedById;
    }
    
    public int Id { get; set; }
    public int GroupId { get; set; }
    public GroupEntity Group { get; set; }
    
    public int OwnerId { get; set; }
    public int OwedById { get; set; }
    public double Amount { get; set; }
}