using ChurchFamily.Core.Entities;
using ChurchFamily.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChurchFamily.Infrastructure.Persistence.Configurations;

public class BatchConfiguration : IEntityTypeConfiguration<Batch>
{
    public void Configure(EntityTypeBuilder<Batch> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedNever();

        builder.Property(e => e.ExpectedTotal).HasPrecision(18, 2);
        builder.Property(e => e.ActualTotal).HasPrecision(18, 2);

        builder.Property(e => e.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(e => e.CreatedBy).HasMaxLength(200);
        builder.Property(e => e.LastModifiedBy).HasMaxLength(200);

        // Relationship using backing field
        builder.HasMany(e => e.Donations)
            .WithOne(d => d.Batch)
            .HasForeignKey(d => d.BatchId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.Navigation(e => e.Donations).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
