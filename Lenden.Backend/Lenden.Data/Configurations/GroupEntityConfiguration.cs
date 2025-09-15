using Lenden.Core.GroupFeatures;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Lenden.Data.Configurations
{
    public class GroupEntityConfiguration : IEntityTypeConfiguration<GroupEntity>
    {
        public void Configure(EntityTypeBuilder<GroupEntity> builder)
        {
            builder.ToTable("groups");

            builder.HasKey(g => g.Id)
                .HasName("pk_groups");

            builder.Property(g => g.Id)
                .HasColumnName("group_id")
                .HasColumnType("int")
                .ValueGeneratedOnAdd();

            builder.Property(g => g.Name)
                .HasColumnName("name")
                .HasColumnType("varchar(50)")
                .IsRequired();

            builder.Property(g => g.ImageUrl)
                .HasColumnName("image_url")
                .HasColumnType("varchar(255)");
        }
    }
}