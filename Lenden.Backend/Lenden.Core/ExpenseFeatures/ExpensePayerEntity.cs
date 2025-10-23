using Lenden.Core.GroupFeatures;
using Lenden.Core.UserFeatures;

namespace Lenden.Core.ExpenseFeatures;

public class ExpensePayerEntity
{
    protected ExpensePayerEntity()
    {
        
    }

    public ExpensePayerEntity(int expenseId, int payerId,decimal amount)
    {
        ExpenseId = expenseId;
        PayerId = payerId;
        Amount = amount;
    }
    
    public int Id { get; set; }
    public int ExpenseId { get; set; }
    public int PayerId { get; set; }
    public decimal Amount { get; set; }
    
    public virtual ExpenseEntity Expense { get; set; }
    public virtual UserEntity Payer { get; set; }
}