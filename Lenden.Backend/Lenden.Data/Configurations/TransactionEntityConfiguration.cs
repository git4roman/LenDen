using Lenden.Core.TransactionFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Data.Configurations;

public class TransactionConfiguration : IEntityTypeConfiguration<TransactionEntity>
{
    public void Configure(EntityTypeBuilder<TransactionEntity> builder)
    {
        builder.ToTable("Transactions");

        builder.HasKey(t => t.Id);

        builder.Property(t => t.Id)
            .HasColumnName("transaction_id")
            .IsRequired();

        builder.Property(t => t.GroupId)
            .HasColumnName("group_id")
            .IsRequired();

        builder.Property(t => t.PaidByUserId)
            .HasColumnName("paid_by_user_id")
            .IsRequired();

        builder.Property(t => t.Amount)
            .HasColumnName("amount")
            .HasColumnType("decimal(18, 2)")
            .IsRequired();
               
        builder.Property(t => t.PaidOnDate)
            .HasColumnName("paid_on_date")
            .HasColumnType("date")
            .IsRequired();

        builder.Property(t => t.PaidOnTime)
            .HasColumnName("paid_on_time")
            .HasColumnType("time")
            .IsRequired();

        builder.HasOne(t => t.Group)
            .WithMany()
            .HasForeignKey(t => t.GroupId);
    }
}