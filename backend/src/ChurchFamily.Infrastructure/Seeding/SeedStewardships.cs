using ChurchFamily.Core.Entities;
using ChurchFamily.Core.Enums;

namespace ChurchFamily.Infrastructure.Seeding;

public static class SeedStewardships
{
    private static readonly Guid H2 = new("a0000002-0000-0000-0000-000000000001");
    private static readonly Guid H4 = new("a0000004-0000-0000-0000-000000000001");
    private static readonly Guid H9 = new("a0000009-0000-0000-0000-000000000001");

    public static List<Stewardship> GetStewardships() =>
    [
        new()
        {
            Id = new("f8b1c1d0-1b2b-4e6c-a2f0-1e5b1f9c8d7e"),
            HouseholdId = H2, FiscalYear = "2025", Amount = 1000m,
            Frequency = StewardshipFrequency.Monthly, TotalYearlyAmount = 12000m,
            Status = StewardshipStatus.Active,
            CreatedBy = "system", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"),
            HouseholdId = H2, FiscalYear = "2024", Amount = 50m,
            Frequency = StewardshipFrequency.Weekly, TotalYearlyAmount = 2600m,
            Status = StewardshipStatus.Completed,
            CreatedBy = "system", CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e"),
            HouseholdId = H4, FiscalYear = "2024", Amount = 5000m,
            Frequency = StewardshipFrequency.Annual, TotalYearlyAmount = 5000m,
            Status = StewardshipStatus.Completed,
            CreatedBy = "system", CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f"),
            HouseholdId = H9, FiscalYear = "2025", Amount = 200m,
            Frequency = StewardshipFrequency.Biweekly, TotalYearlyAmount = 5200m,
            Status = StewardshipStatus.Active,
            CreatedBy = "system", CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc),
        },
    ];
}
