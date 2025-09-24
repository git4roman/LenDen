using System.Text.RegularExpressions;
using Lenden.Core.GroupFeatures;
using Lenden.Data.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Data;

public class GroupRepository: Repository<GroupEntity>, IGroupRepository
{
    private readonly AppDbContext _context;
    public GroupRepository(AppDbContext context): base(context)
    {
        _context = context;
    }


    public async Task<IEnumerable<GroupEntity>?> GetGroupsByUserId(int userId)
    {
        var userGroups = await _context.UserGroups
            .Where(ug => ug.UserId == userId)
            .Select(ug => ug.Group)
            .ToListAsync();
        return userGroups;
    }
}