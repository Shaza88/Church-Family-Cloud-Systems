using ChurchFamily.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ChurchFamily.Infrastructure.Persistence.Configurations;

public class BroadcastLogConfiguration : IEntityTypeConfiguration<BroadcastLog>
{
    public void Configure(EntityTypeBuilder<BroadcastLog> builder)
    {
        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).ValueGeneratedNever();

        builder.Property(e => e.Subject).IsRequired().HasMaxLength(300);
        builder.Property(e => e.Body).IsRequired().HasMaxLength(4000);
        builder.Property(e => e.TargetAudience).IsRequired().HasMaxLength(500);

        // Relationship using backing field
        builder.HasMany(e => e.Recipients)
            .WithOne(r => r.BroadcastLog)
            .HasForeignKey(r => r.BroadcastLogId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(e => e.Recipients).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
