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

        builder.HasKey(u => u.Id);

        builder.Property(u => u.Id)
            .HasColumnName("id")
            .ValueGeneratedOnAdd(); 

        builder.Property(u => u.GoogleId)
            .HasColumnName("google_id")
            .HasMaxLength(255);

        builder.Property(u => u.Email)
            .HasColumnName("email")
            .IsRequired()
            .HasMaxLength(255); 

        builder.Property(u => u.FullName)
            .HasColumnName("full_name")
            .IsRequired()
            .HasMaxLength(100); 
        
        builder.Property(u => u.PhoneHash)
            .HasColumnName("phone_hash")
            .HasMaxLength(100); 
        
        builder.Property(u => u.PictureUrl)
            .HasColumnName("picture_url")
            .HasMaxLength(2048);
        
        builder.Property(u => u.AuthProvider)
            .HasColumnName("auth_provider")
            .HasMaxLength(2048); 
        
        builder.Property(u => u.CreatedAt)
            .HasColumnName("created_at")
            .HasColumnType("date");
        
        builder.Property(u => u.IsActive)
            .HasColumnName("is_active")
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