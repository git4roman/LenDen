using Lenden.Core.UserFeatures;

namespace Lenden.Core.ExpenseFeatures;

public class ExpenseSplitEntity
{
    protected ExpenseSplitEntity()
    {
        
    }

    public ExpenseSplitEntity(int  expenseId, int splitterId, decimal amount)
    {
        SplitterId = splitterId;
        Amount = amount;
        ExpenseId = expenseId;
    }
    
    public int Id { get; set; }
    public int ExpenseId { get; set; }
    public virtual ExpenseEntity Expense { get; set; }
    public int SplitterId { get; set; }
    public virtual UserEntity Splitter { get; set; }
    public decimal Amount { get; set; }
}