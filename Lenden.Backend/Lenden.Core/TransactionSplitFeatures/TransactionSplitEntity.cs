namespace Lenden.Core.TransactionSplitFeatures;

public class TransactionSplitEntity
{
    protected TransactionSplitEntity()
    { }

    public TransactionSplitEntity(int transactionId, int userId,double amount)
    {
        Amount =amount;
        TransactionId = transactionId;
        UserId = userId;
    }
    
    public int Id { get; set; }
    public int TransactionId { get; set; }
    public int UserId { get; set; }
    public double Amount { get; set; }
}