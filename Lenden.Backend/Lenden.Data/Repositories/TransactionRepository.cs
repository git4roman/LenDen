using Lenden.Core.TransactionFeatures;
using Lenden.Data.DbContexts;

namespace Lenden.Data;

public class TransactionRepository: Repository<TransactionEntity>,ITransactionRepository
{
    private readonly AppDbContext _context;
    public TransactionRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }
    
    
}