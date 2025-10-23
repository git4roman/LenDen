using Lenden.Core.UserFeatures;
using Lenden.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Data;

public class UserRepository: Repository<UserEntity>, IUserRepository
{
    private readonly AppDbContext _context;
    private IUserRepository _userRepositoryImplementation;

    public UserRepository(AppDbContext context):base(context)
    {
        _context = context;
    }

    public async Task<UserEntity?> GetUserByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u=>u.Email==email);
        
    }

    public async Task<UserEntity?> GetUserByUidAsync(string uid)
    {
        return await _context.Users.FirstOrDefaultAsync(u=>u.GoogleId==uid);
         
    }
}