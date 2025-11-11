using Lenden.Core.SettlementFeatures;
using Lenden.Data.DbContexts;

namespace Lenden.Data.Repositories;

public class SettlementRepository: Repository<SettlementEntity>, ISettlementRepository
{
    private readonly AppDbContext _context;
    public SettlementRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }
}