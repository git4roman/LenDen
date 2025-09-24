using Lenden.Core.UserGroupFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Data.Configurations;

public class UserGroupEntityConfiguration: IEntityTypeConfiguration<UserGroupEntity>
{
    public void Configure(EntityTypeBuilder<UserGroupEntity> builder)
    {
        builder.ToTable("UserGroups");
        builder.HasKey(u => new { u.UserId, u.GroupId });
        
        builder.Property(u => u.UserId)
            .HasColumnName("user_id")
            .IsRequired();
        
        builder.Property(u => u.GroupId)
            .HasColumnName("group_id")
            .IsRequired();
        
        builder.HasOne(ug => ug.User)
            .WithMany(u => u.UserGroups)
            .HasForeignKey(ug => ug.UserId);

        builder.HasOne(ug => ug.Group)
            .WithMany(g => g.UserGroups)
            .HasForeignKey(ug => ug.GroupId);
        
        
    }
}