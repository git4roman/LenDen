using Lenden.Core.SettlementFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Data.Configurations;

public class SettlementEntityConfiguration: IEntityTypeConfiguration<SettlementEntity>
{
    public void Configure(EntityTypeBuilder<SettlementEntity> builder)
    {
        builder.ToTable("settlements");
        builder.HasKey(x => x.Id);
        builder.Property(x=>x.Id).HasColumnName("id").IsRequired();
        builder.Property(x=>x.GroupId).HasColumnName("group_id").IsRequired();
        builder.Property(x => x.FromUserId).HasColumnName("from_user_id").IsRequired();
        builder.Property(x => x.ToUserId).HasColumnName("to_user_id").IsRequired();
        builder.Property(x => x.Amount).HasColumnName("amount").IsRequired();
        
        builder.HasOne(s=>s.Group)
            .WithMany()
            .HasForeignKey(s=>s.GroupId)
            .IsRequired();
        
        builder.HasOne(s=>s.FromUser)
            .WithMany()
            .HasForeignKey(s=>s.FromUserId)
            .IsRequired();
        
        builder.HasOne(s=>s.ToUser)
            .WithMany()
            .HasForeignKey(s=>s.ToUserId)
            .IsRequired();
        
        builder.Property(s=>s.CreatedDate).HasColumnName("created_date").IsRequired();
        builder.Property(s=>s.CreatedAt).HasColumnName("created_time").IsRequired();
        
        
        
        
    }
}