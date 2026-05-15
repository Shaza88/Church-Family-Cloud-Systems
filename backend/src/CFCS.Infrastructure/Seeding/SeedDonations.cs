using CFCS.Core.Entities;
using CFCS.Core.Enums;

namespace CFCS.Infrastructure.Seeding;

public static class SeedDonations
{
    // Household IDs matching SeedHouseholds
    private static readonly Guid HouseholdH2 = new("a0000002-0000-0000-0000-000000000001");
    private static readonly Guid HouseholdH4 = new("a0000004-0000-0000-0000-000000000001");
    private static readonly Guid HouseholdH9 = new("a0000009-0000-0000-0000-000000000001");

    public static List<Donation> GetDonations() =>
    [
        new()
        {
            Id = new("d1a2b3c4-1234-5678-9abc-def012345678"),
            BatchId = new("b1a2b3c4-1234-5678-9abc-def012345678"),
            HouseholdId = HouseholdH2, FundId = new("f0000001-0000-0000-0000-000000000001"),
            Date = new DateTime(2024, 10, 15, 10, 0, 0, DateTimeKind.Utc),
            Amount = 500.00m, PaymentMethod = PaymentMethod.Online, Reference = "TXN-987654",
            CreatedBy = "system", CreatedAt = new DateTime(2024, 10, 15, 10, 0, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("d2b3c4d5-2345-6789-abcd-ef0123456789"),
            BatchId = new("b2b3c4d5-2345-6789-abcd-ef0123456789"),
            HouseholdId = HouseholdH2, FundId = new("f0000002-0000-0000-0000-000000000001"),
            Date = new DateTime(2024, 11, 1, 9, 30, 0, DateTimeKind.Utc),
            Amount = 250.00m, PaymentMethod = PaymentMethod.Check, Reference = "1024",
            CreatedBy = "system", CreatedAt = new DateTime(2024, 11, 1, 9, 30, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("d3c4d5e6-3456-7890-bcde-f0123456789a"),
            BatchId = new("b3c4d5e6-3456-7890-bcde-f0123456789a"),
            HouseholdId = HouseholdH4, FundId = new("f0000001-0000-0000-0000-000000000001"),
            Date = new DateTime(2024, 12, 25, 11, 15, 0, DateTimeKind.Utc),
            Amount = 1000.00m, PaymentMethod = PaymentMethod.Check, Reference = "2056",
            CreatedBy = "system", CreatedAt = new DateTime(2024, 12, 25, 11, 15, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("d4d5e6f7-4567-8901-cdef-0123456789ab"),
            BatchId = new("b4d5e6f7-4567-8901-cdef-0123456789ab"),
            HouseholdId = HouseholdH9, FundId = new("f0000003-0000-0000-0000-000000000001"),
            Date = new DateTime(2025, 1, 10, 8, 45, 0, DateTimeKind.Utc),
            Amount = 100.00m, PaymentMethod = PaymentMethod.Cash,
            CreatedBy = "system", CreatedAt = new DateTime(2025, 1, 10, 8, 45, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("d5e6f708-5678-9012-def0-123456789abc"),
            BatchId = new("b5e6f708-5678-9012-def0-123456789abc"),
            HouseholdId = HouseholdH2, FundId = new("f0000004-0000-0000-0000-000000000001"),
            Date = new DateTime(2025, 2, 5, 14, 20, 0, DateTimeKind.Utc),
            Amount = 150.00m, PaymentMethod = PaymentMethod.Online, Reference = "TXN-112233",
            CreatedBy = "system", CreatedAt = new DateTime(2025, 2, 5, 14, 20, 0, DateTimeKind.Utc),
        },
    ];
}
