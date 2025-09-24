using Lenden.Core.BalanceFeatures;
using Lenden.Core.GroupFeatures;
using Lenden.Core.TransactionFeatures;
using Lenden.Core.UserFeatures;
using Lenden.Core.UserGroupFeatures;
using Lenden.Data.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Lenden.Data.DbContexts;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> context) : base(context)
    {
    }
    public DbSet<GroupEntity> Groups { get; set; }
    public DbSet<UserEntity> Users { get; set; }
    public DbSet<TransactionEntity> Transactions { get; set; }
    public DbSet<BalanceEntity> Balances { get; set; }
    public DbSet<UserGroupEntity> UserGroups{ get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new GroupEntityConfiguration());
        modelBuilder.ApplyConfiguration(new UserEntityConfiguration());
        modelBuilder.ApplyConfiguration(new TransactionEntityConfiguration());
        modelBuilder.ApplyConfiguration(new BalanceEntityConfiguration());
        modelBuilder.ApplyConfiguration(new UserGroupEntityConfiguration());
        base.OnModelCreating(modelBuilder);
    }
}