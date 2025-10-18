using Lenden.Core.UserFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Data.Configurations;

public class UserEntityConfiguration : IEntityTypeConfiguration<UserEntity>
{
    public void Configure(EntityTypeBuilder<UserEntity> builder)
    {
        // Table mapping
        builder.ToTable("Users");

        // Primary key
        builder.HasKey(u => u.Id);

        // Properties
        builder.Property(u => u.Id)
            .ValueGeneratedOnAdd(); 

        builder.Property(u => u.GoogleId)
            .HasMaxLength(255);

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255); 

        builder.Property(u => u.FullName)
            .IsRequired()
            .HasMaxLength(100); 
        
        builder.Property(u => u.PhoneHash)
            .HasColumnName("phone_hash")
            .HasMaxLength(100); 

        builder.Property(u => u.GivenName)
            .HasMaxLength(50); 
        builder.Property(u => u.PictureUrl)
            .HasMaxLength(2048); 
        
        builder.Property(u => u.CreatedAt)
            .HasColumnType("date");

        builder.Property(u => u.IsActive)
            .IsRequired()
            .HasDefaultValue(true); 
        
        builder.Property(u=>u.Role)
            .HasColumnType("nvarchar(255)")
            .HasColumnName("role")
            .IsRequired()
            .HasMaxLength(255);

        // Indexes
        builder.HasIndex(u => u.Email)
            .IsUnique(); // Ensure email is unique

        builder.HasIndex(u => u.GoogleId)
            .IsUnique()
            .HasFilter("[GoogleId] IS NOT NULL"); // Unique for non-null GoogleId
    }
}