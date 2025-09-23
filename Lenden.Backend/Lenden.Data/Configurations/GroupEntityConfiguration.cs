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
            
            builder.Property(g => g.CreatedBy)
                .HasColumnName("created_by")
                .HasColumnType("int")
                .IsRequired();
            
            builder.Property(g => g.CreatedDate)
                .HasColumnName("created_date")
                .IsRequired();

            builder.Property(g => g.CreatedTime)
                .HasColumnName("created_time")
                .IsRequired();

            builder.Property(g => g.UpdatedDate)
                .HasColumnName("updated_date")
                .IsRequired();

            builder.Property(g => g.UpdatedTime)
                .HasColumnName("updated_time")
                .IsRequired();
                
            builder.HasOne(g => g.CreatedByUser)
                .WithMany() 
                .HasForeignKey(g => g.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}