using Lenden.Core.ExpenseFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Data.Configurations;

public class ExpensePayerEntityConfiguration: IEntityTypeConfiguration<ExpensePayerEntity>
{
    public void Configure(EntityTypeBuilder<ExpensePayerEntity> builder)
    {
        builder.ToTable("expense_payers");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();
        
        builder.Property(e => e.Amount)
            .HasColumnName("amount")
            .IsRequired()
            .HasColumnType("decimal(18, 2)");
        
        builder.Property(e=>e.PayerId)
            .HasColumnName("payer_id")
            .IsRequired()
            .HasColumnType("integer");
        builder.Property(e=>e.ExpenseId)
            .HasColumnName("expense_id")
            .IsRequired()
            .HasColumnType("bigint");
        
        builder.HasOne(ep => ep.Expense)
            .WithMany()
            .HasForeignKey(ep => ep.ExpenseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ep => ep.Payer)
            .WithMany()
            .HasForeignKey(ep => ep.PayerId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}