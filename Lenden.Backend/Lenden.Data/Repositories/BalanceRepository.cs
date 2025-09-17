using Lenden.Core.BalanceFeatures;
using Lenden.Data.DbContexts;

namespace Lenden.Data.Repositories;

public class BalanceRepository: Repository<BalanceEntity>, IBalanceRepository
{
    private readonly AppDbContext _context;
    public BalanceRepository(AppDbContext context): base(context)
    {
        _context = context;
    }
}