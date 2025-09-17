using Lenden.Core.BalanceFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Data.Configurations;

public class BalanceEntityConfiguration : IEntityTypeConfiguration<BalanceEntity>
{
    public void Configure(EntityTypeBuilder<BalanceEntity> builder)
    {
        builder.ToTable("balance");

        // Primary Key
        builder.HasKey(b => b.Id);

        // Column Configurations
        builder.Property(b => b.Id)
            .HasColumnName("balance_id")
            .IsRequired();

        builder.Property(b => b.GroupId)
            .HasColumnName("group_id")
            .IsRequired();
        builder.Property(b => b.OwnerId)
            .HasColumnName("owner_id")
            .IsRequired();

        builder.Property(b => b.OwedById)
            .HasColumnName("owed_by_id")
            .IsRequired();

        builder.Property(b => b.Amount)
            .HasColumnName("amount")
            .HasColumnType("decimal(18, 2)")
            .IsRequired();
        
        builder.HasIndex(b => new { b.GroupId, b.OwnerId, b.OwedById })
            .IsUnique();

        builder.HasOne(b => b.Group)
            .WithMany()
            .HasForeignKey(b => b.GroupId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}