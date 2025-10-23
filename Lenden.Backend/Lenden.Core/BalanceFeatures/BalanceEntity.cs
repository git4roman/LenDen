using Lenden.Core.GroupFeatures;

namespace Lenden.Core.BalanceFeatures;

public class BalanceEntity
{
    protected BalanceEntity(){}

    public BalanceEntity(int groupId, int owedToId, int owedById, decimal amount)
    {
        GroupId = groupId;
        Amount = amount;
        OwedToId = owedToId;
        OwedById = owedById;
    }
    
    public int Id { get; set; }
    public int GroupId { get; set; }
    public GroupEntity Group { get; set; }
    
    public int OwedToId { get; set; }
    public int OwedById { get; set; }
    public decimal Amount { get; set; }
}