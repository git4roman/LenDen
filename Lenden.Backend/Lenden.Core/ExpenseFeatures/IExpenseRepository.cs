namespace Lenden.Core.ExpenseFeatures;

public interface IExpenseRepository: IRepository<ExpenseEntity>
{
    Task AddExpensePayer(ExpensePayerEntity entity);
    Task AddExpenseSplitter(ExpenseSplitEntity entity);
}