using CFCS.Core.Entities;
using CFCS.Core.Enums;

namespace CFCS.Infrastructure.Seeding;

public static class SeedBatches
{
    public static List<Batch> GetBatches() =>
    [
        new()
        {
            Id = new("b1a2b3c4-1234-5678-9abc-def012345678"),
            Date = new DateTime(2024, 10, 15, 0, 0, 0, DateTimeKind.Utc),
            ExpectedTotal = 500.00m, ActualTotal = 500.00m, DonationCount = 1,
            Status = BatchStatus.Posted,
            CreatedBy = "system", CreatedAt = new DateTime(2024, 10, 15, 10, 0, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("b2b3c4d5-2345-6789-abcd-ef0123456789"),
            Date = new DateTime(2024, 11, 1, 0, 0, 0, DateTimeKind.Utc),
            ExpectedTotal = 250.00m, ActualTotal = 250.00m, DonationCount = 1,
            Status = BatchStatus.Posted,
            CreatedBy = "system", CreatedAt = new DateTime(2024, 11, 1, 9, 30, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("b3c4d5e6-3456-7890-bcde-f0123456789a"),
            Date = new DateTime(2024, 12, 25, 0, 0, 0, DateTimeKind.Utc),
            ExpectedTotal = 1000.00m, ActualTotal = 1000.00m, DonationCount = 1,
            Status = BatchStatus.Posted,
            CreatedBy = "system", CreatedAt = new DateTime(2024, 12, 25, 11, 15, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("b4d5e6f7-4567-8901-cdef-0123456789ab"),
            Date = new DateTime(2025, 1, 10, 0, 0, 0, DateTimeKind.Utc),
            ExpectedTotal = 100.00m, ActualTotal = 100.00m, DonationCount = 1,
            Status = BatchStatus.Posted,
            CreatedBy = "system", CreatedAt = new DateTime(2025, 1, 10, 8, 45, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("b5e6f708-5678-9012-def0-123456789abc"),
            Date = new DateTime(2025, 2, 5, 0, 0, 0, DateTimeKind.Utc),
            ExpectedTotal = 150.00m, ActualTotal = 150.00m, DonationCount = 1,
            Status = BatchStatus.Posted,
            CreatedBy = "system", CreatedAt = new DateTime(2025, 2, 5, 14, 20, 0, DateTimeKind.Utc),
        },
    ];
}
