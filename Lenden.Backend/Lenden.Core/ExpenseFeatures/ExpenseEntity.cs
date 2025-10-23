using Lenden.Core.UserFeatures;

namespace Lenden.Core.ExpenseFeatures;

public class ExpenseEntity
{
    protected ExpenseEntity()
    {
    }

    public ExpenseEntity(int madeById,string description, decimal amount)
    {
        MadeById = madeById;
        Description = description ?? String.Empty;
        Amount = amount;
        CreatedAt = TimeOnly.FromDateTime(DateTime.Now);
        CreatedDate = DateOnly.FromDateTime(DateTime.Now);
    }
    
    public long Id { get; set; }
    public string? Description { get; set; }
    public int MadeById { get; set; }
    public virtual UserEntity MadeBy { get; set; }
    public decimal Amount { get; set; }
    public TimeOnly CreatedAt { get; set; }
    public DateOnly CreatedDate  { get; set; }
}