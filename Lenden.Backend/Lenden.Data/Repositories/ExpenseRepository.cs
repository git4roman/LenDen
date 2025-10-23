using Lenden.Core.ExpenseFeatures;
using Lenden.Data.DbContexts;

namespace Lenden.Data.Repositories;

public class ExpenseRepository: Repository<ExpenseEntity>, IExpenseRepository
{
    private readonly AppDbContext _context; 
    public ExpenseRepository(AppDbContext context): base(context)
    {
        _context= context;
    }

    public async Task AddExpensePayer(ExpensePayerEntity entity)
    {
       await _context.ExpensePayers.AddAsync(entity);
            
    }

    public async Task AddExpenseSplitter(ExpenseSplitEntity entity)
    {
         await _context.ExpenseSplitters.AddAsync(entity);

    }
}