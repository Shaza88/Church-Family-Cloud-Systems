using ChurchFamily.Core.Entities;
using ChurchFamily.Core.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChurchFamily.Infrastructure.Persistence.Configurations;

public class IndividualConfiguration : IEntityTypeConfiguration<Individual>
{
    public void Configure(EntityTypeBuilder<Individual> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedNever();

        builder.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
        builder.Property(e => e.MiddleName).HasMaxLength(100);
        builder.Property(e => e.LastName).HasMaxLength(100);
        builder.Property(e => e.Email).HasMaxLength(200);
        builder.Property(e => e.Phone).HasMaxLength(20);
        builder.Property(e => e.Profession).HasMaxLength(100);
        builder.Property(e => e.Relationship).HasMaxLength(100);

        builder.Property(e => e.Role)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        builder.Property(e => e.Gender)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);
    }
}
