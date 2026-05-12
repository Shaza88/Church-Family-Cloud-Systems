using ChurchFamily.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChurchFamily.Infrastructure.Persistence.Configurations;

public class FundConfiguration : IEntityTypeConfiguration<Fund>
{
    public void Configure(EntityTypeBuilder<Fund> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedNever();

        builder.Property(e => e.Name).IsRequired().HasMaxLength(150);
        builder.Property(e => e.Description).HasMaxLength(500);
        builder.Property(e => e.CreatedBy).HasMaxLength(200);
        builder.Property(e => e.LastModifiedBy).HasMaxLength(200);

        // Relationship using backing field
        builder.HasMany(e => e.Donations)
            .WithOne(d => d.Fund)
            .HasForeignKey(d => d.FundId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.Navigation(e => e.Donations).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
