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
            .ValueGeneratedOnAdd(); // Auto-incremented

        builder.Property(u => u.GoogleId)
            .HasMaxLength(255); // Nullable, unique if provided

        builder.Property(u => u.Email)
            .IsRequired()
            .HasMaxLength(255); // Required, standard length for emails

        builder.Property(u => u.FullName)
            .IsRequired()
            .HasMaxLength(100); // Required, reasonable length for names

        builder.Property(u => u.GivenName)
            .HasMaxLength(50); // Optional, shorter length

        builder.Property(u => u.FamilyName)
            .HasMaxLength(50); // Optional, shorter length

        builder.Property(u => u.PictureUrl)
            .HasMaxLength(2048); // Optional, longer for URLs

        builder.Property(u => u.CreatedAt)
            .HasColumnType("date"); // Maps DateOnly to SQL DATE

        builder.Property(u => u.IsActive)
            .IsRequired()
            .HasDefaultValue(true); // Default to true

        // Indexes
        builder.HasIndex(u => u.Email)
            .IsUnique(); // Ensure email is unique

        builder.HasIndex(u => u.GoogleId)
            .IsUnique()
            .HasFilter("[GoogleId] IS NOT NULL"); // Unique for non-null GoogleId
    }
}