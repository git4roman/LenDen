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
            .HasColumnName("id")
            .ValueGeneratedOnAdd();
        
        builder.Property(e => e.MadeById)
            .HasColumnName("made_by_id")
            .IsRequired();
        
        builder.Property(e => e.Description)
            .HasColumnName("description")
            .HasMaxLength(255)
            .IsRequired(false);

        builder.Property(e => e.Amount)
            .HasColumnName("amount")
            .IsRequired()
            .HasColumnType("decimal(18, 2)");

        builder.Property(e => e.CreatedAt)
            .HasColumnName("created_at")
            .IsRequired();

        builder.Property(e => e.CreatedDate)
            .HasColumnName("created_date")
            .IsRequired();

        builder.HasOne(e=>e.MadeBy)
            .WithMany()
            .HasForeignKey(e => e.MadeById)
            .OnDelete(DeleteBehavior.Restrict);
        
        
    }
    }
