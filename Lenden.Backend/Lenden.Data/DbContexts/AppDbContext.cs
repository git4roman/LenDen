using Lenden.Core.GroupFeatures;
using Lenden.Data.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Data.DbContexts;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> context) : base(context)
    {
    }
    public DbSet<GroupEntity> Groups { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new GroupEntityConfiguration());
        base.OnModelCreating(modelBuilder);
    }
}