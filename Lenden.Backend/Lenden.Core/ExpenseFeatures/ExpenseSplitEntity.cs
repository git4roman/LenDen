using Lenden.Core.UserFeatures;

namespace Lenden.Core.ExpenseFeatures;

public class ExpenseSplitEntity
{
    protected ExpenseSplitEntity()
    {
        
    }

    public ExpenseSplitEntity(long  expenseId, int splitterId, decimal amount)
    {
        SplitterId = splitterId;
        Amount = amount;
        ExpenseId = expenseId;
    }
    
    public long Id { get; set; }
    public long ExpenseId { get; set; }
    public virtual ExpenseEntity Expense { get; set; }
    public int SplitterId { get; set; }
    public virtual UserEntity Splitter { get; set; }
    public decimal Amount { get; set; }
}