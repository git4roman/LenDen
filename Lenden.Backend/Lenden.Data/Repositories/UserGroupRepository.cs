using Lenden.Core;
using Lenden.Core.UserGroupFeatures;
using Lenden.Data.DbContexts;

namespace Lenden.Data.Repositories;

public class UserGroupRepository: Repository<UserGroupEntity>, IUserGroupRepository
{
    private readonly AppDbContext _context;
    public UserGroupRepository(AppDbContext context) : base(context)
    {
        _context = context;
    }
    
    
}