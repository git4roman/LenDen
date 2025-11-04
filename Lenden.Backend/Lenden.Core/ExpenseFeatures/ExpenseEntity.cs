using Lenden.Core.UserFeatures;

namespace Lenden.Core.ExpenseFeatures;

public class ExpenseEntity
{
    protected ExpenseEntity()
    {
    }

    public ExpenseEntity(int madeById,string description, decimal amount, long groupId)
    {
        MadeById = madeById;
        Description = description ?? String.Empty;
        Amount = amount;
        CreatedAt = TimeOnly.FromDateTime(DateTime.Now);
        CreatedDate = DateOnly.FromDateTime(DateTime.Now);
        GroupId = groupId;
    }
    
    public long Id { get; set; }
    public string? Description { get; set; }
    public long GroupId { get; set; }
    public int MadeById { get; set; }
    public virtual UserEntity MadeBy { get; set; }
    public decimal Amount { get; set; }
    public TimeOnly CreatedAt { get; set; }
    public DateOnly CreatedDate  { get; set; }
    
    public virtual ICollection<ExpensePayerEntity> ExpensePayers { get; set; } = new List<ExpensePayerEntity>();

}