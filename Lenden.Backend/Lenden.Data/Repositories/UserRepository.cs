using Lenden.Core.UserFeatures;
using Lenden.Data.DbContexts;

namespace Lenden.Data;

public class UserRepository: Repository<UserEntity>, IUserRepository
{
    private readonly AppDbContext _context;
    public UserRepository(AppDbContext context):base(context)
    {
        _context = context;
    }
}