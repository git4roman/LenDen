using Lenden.Core.GroupFeatures;

namespace Lenden.Core.TransactionFeatures;

public class TransactionEntity
{
    protected TransactionEntity()
    {
        
    }

    public TransactionEntity(int groupId, int paidByUserId, double amount)
    {
        GroupId = groupId;
        PaidByUserId = paidByUserId;
        Amount = amount;
        PaidOnDate = DateOnly.FromDateTime(DateTime.Now);
        PaidOnTime = TimeOnly.FromDateTime(DateTime.Now);
        
    }
    public int Id { get; set; }
    public int GroupId { get; set; }
    public int PaidByUserId { get; set; }
    public double Amount { get; set; }
    public DateOnly PaidOnDate { get; set; }
    public TimeOnly PaidOnTime { get; set; }
    public GroupEntity Group { get; set; }
}