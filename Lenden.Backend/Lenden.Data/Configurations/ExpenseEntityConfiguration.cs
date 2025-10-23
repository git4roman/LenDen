using Lenden.Core.ExpenseFeatures;
using Lenden.Core.UserFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Data.Configurations;

public class ExpenseEntityConfiguration: IEntityTypeConfiguration<ExpenseEntity>
{
    public void Configure(EntityTypeBuilder<ExpenseEntity> builder)
    {
        builder.ToTable("expenses");

        builder.HasKey(e => e.Id);

        builder.Property(e => e.Id)
            .ValueGeneratedOnAdd();
        
        builder.Property(e => e.MadeById)
            .IsRequired();
        
        builder.Property(e => e.Description)
            .HasMaxLength(255)
            .IsRequired(false);

        builder.Property(e => e.Amount)
            .IsRequired()
            .HasColumnType("decimal(18, 2)");

        builder.Property(e => e.CreatedAt)
            .IsRequired();

        builder.Property(e => e.CreatedDate)
            .IsRequired();

        builder.HasOne(e=>e.MadeBy)
            .WithMany()
            .HasForeignKey(e => e.MadeById)
            .OnDelete(DeleteBehavior.Restrict);
        
        
    }
    }
