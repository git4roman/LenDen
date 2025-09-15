using System.Text.RegularExpressions;
using Lenden.Core;
using Lenden.Core.GroupFeatures;
using Lenden.Data.DbContexts;

namespace Lenden.Data;

public class UnitOfWork: IUnitOfWork
{
    protected AppDbContext _context;
    public IGroupRepository Group { get; private set; }
    public async Task SaveChangesAsync()
    {
        await  _context.SaveChangesAsync();
    }

    public UnitOfWork(AppDbContext context)
    {
        _context = context;
        Group = new GroupRepository(_context);
    }
    
}