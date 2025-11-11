using Lenden.Core.BalanceFeatures;
using Lenden.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Data.Repositories;

public class BalanceRepository: Repository<BalanceEntity>, IBalanceRepository
{
    private readonly AppDbContext _context;
    public BalanceRepository(AppDbContext context): base(context)
    {
        _context = context;
    }

    public async Task<BalanceEntity?> GetBalanceByGroupAndUsersIdAsync(int groupId, int fromUserId)
    {
        var balance = await _context.Balances
            .Where(b => b.GroupId == groupId && ((b.OwedById == fromUserId) || b.OwedToId == fromUserId)).FirstOrDefaultAsync();
        return balance;
    }
}