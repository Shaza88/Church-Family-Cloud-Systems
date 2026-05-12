using ChurchFamily.Core.Entities;
using ChurchFamily.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChurchFamily.Infrastructure.Persistence.Configurations;

public class StewardshipConfiguration : IEntityTypeConfiguration<Stewardship>
{
    public void Configure(EntityTypeBuilder<Stewardship> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedNever();

        builder.Property(e => e.FiscalYear).IsRequired().HasMaxLength(10);
        builder.Property(e => e.Amount).HasPrecision(18, 2);
        builder.Property(e => e.TotalYearlyAmount).HasPrecision(18, 2);

        builder.Property(e => e.Frequency)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(e => e.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(e => e.CreatedBy).HasMaxLength(200);
        builder.Property(e => e.LastModifiedBy).HasMaxLength(200);

        // FK relationship configured on Household entity
    }
}
