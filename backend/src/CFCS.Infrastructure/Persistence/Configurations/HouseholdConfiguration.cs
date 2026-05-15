using CFCS.Core.Entities;
using CFCS.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CFCS.Infrastructure.Persistence.Configurations;

public class HouseholdConfiguration : IEntityTypeConfiguration<Household>
{
    public void Configure(EntityTypeBuilder<Household> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedNever();

        builder.Property(e => e.Name).IsRequired().HasMaxLength(200);
        builder.Property(e => e.Phone).HasMaxLength(20);
        builder.Property(e => e.Phone2).HasMaxLength(20);

        builder.Property(e => e.Status)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        // Audit fields
        builder.Property(e => e.CreatedBy).HasMaxLength(200);
        builder.Property(e => e.LastModifiedBy).HasMaxLength(200);

        // Owned Address
        builder.OwnsOne(e => e.Address, a =>
        {
            a.Property(p => p.Street1).IsRequired().HasMaxLength(200);
            a.Property(p => p.Street2).HasMaxLength(200);
            a.Property(p => p.City).IsRequired().HasMaxLength(100);
            a.Property(p => p.State).IsRequired().HasMaxLength(2);
            a.Property(p => p.Zip).IsRequired().HasMaxLength(10);
        });

        // Relationships using backing fields
        builder.HasMany(e => e.Members)
            .WithOne(m => m.Household)
            .HasForeignKey(m => m.HouseholdId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(e => e.Members).UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasMany(e => e.Stewardships)
            .WithOne(s => s.Household)
            .HasForeignKey(s => s.HouseholdId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(e => e.Stewardships).UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasMany(e => e.Donations)
            .WithOne(d => d.Household)
            .HasForeignKey(d => d.HouseholdId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.Navigation(e => e.Donations).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
