using ChurchFamily.Core.Entities;

namespace ChurchFamily.Infrastructure.Seeding;

public static class SeedFunds
{
    public static List<Fund> GetFunds() =>
    [
        new()
        {
            Id = new("f0000001-0000-0000-0000-000000000001"),
            Name = "General Fund",
            Description = "Primary fund for day-to-day operations and ministries.",
            Active = true, TaxDeductible = true,
            CreatedBy = "system", CreatedAt = new DateTime(2023, 1, 1, 8, 0, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("f0000002-0000-0000-0000-000000000001"),
            Name = "Building Fund",
            Description = "Dedicated to property maintenance, renovations, and new construction.",
            Active = true, TaxDeductible = true,
            CreatedBy = "system", CreatedAt = new DateTime(2023, 1, 1, 8, 0, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("f0000003-0000-0000-0000-000000000001"),
            Name = "Youth Ministry",
            Description = "Supports youth group activities, retreats, and events.",
            Active = true, TaxDeductible = true,
            CreatedBy = "system", CreatedAt = new DateTime(2023, 1, 1, 8, 0, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("f0000004-0000-0000-0000-000000000001"),
            Name = "Missions",
            Description = "Support for local and global missionary work.",
            Active = true, TaxDeductible = true,
            CreatedBy = "system", CreatedAt = new DateTime(2023, 1, 1, 8, 0, 0, DateTimeKind.Utc),
        },
    ];
}
