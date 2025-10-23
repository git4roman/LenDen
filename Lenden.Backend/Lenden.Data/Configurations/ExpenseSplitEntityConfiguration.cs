using Lenden.Core.ExpenseFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Data.Configurations;

public class ExpenseSplitEntityConfiguration: IEntityTypeConfiguration<ExpenseSplitEntity>
{
    public void Configure(EntityTypeBuilder<ExpenseSplitEntity> builder)
    {
     
        builder.ToTable("expense_splitters");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd();
        
        builder.Property(e => e.Amount)
            .HasColumnName("amount")
            .IsRequired()
            .HasColumnType("decimal(18, 2)");
        
        builder.Property(e=>e.SplitterId)
            .HasColumnName("splitter_id")
            .IsRequired()
            .HasColumnType("integer");
        builder.Property(e=>e.ExpenseId)
            .HasColumnName("expense_id")
            .IsRequired()
            .HasColumnType("integer");
        
        builder.HasOne(ep => ep.Expense)
            .WithMany()
            .HasForeignKey(ep => ep.ExpenseId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(ep => ep.Splitter)
            .WithMany()
            .HasForeignKey(ep => ep.SplitterId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}