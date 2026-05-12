using ChurchFamily.Core.Entities;
using ChurchFamily.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChurchFamily.Infrastructure.Persistence.Configurations;

public class DonationConfiguration : IEntityTypeConfiguration<Donation>
{
    public void Configure(EntityTypeBuilder<Donation> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedNever();

        builder.Property(e => e.Amount).HasPrecision(18, 2);
        builder.Property(e => e.Reference).HasMaxLength(100);

        builder.Property(e => e.PaymentMethod)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(e => e.CreatedBy).HasMaxLength(200);
        builder.Property(e => e.LastModifiedBy).HasMaxLength(200);

        // FK relationships configured on parent entities (Batch, Household, Fund)
    }
}
