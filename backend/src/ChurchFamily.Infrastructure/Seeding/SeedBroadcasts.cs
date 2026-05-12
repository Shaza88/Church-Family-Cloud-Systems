using ChurchFamily.Core.Entities;

namespace ChurchFamily.Infrastructure.Seeding;

public static class SeedBroadcasts
{
    public static List<BroadcastLog> GetBroadcastLogs()
    {
        var bl1 = new BroadcastLog
        {
            Id = new("cc000001-0000-0000-0000-000000000001"),
            Subject = "Sunday Service Update \u2013 April 13",
            Body = "Dear Congregation, please be advised that this Sunday's service will begin 30 minutes earlier at 9:30 AM due to a special guest speaker.",
            DateSent = new DateTime(2025, 4, 13, 9, 0, 0, DateTimeKind.Utc),
            RecipientCount = 84, TargetAudience = "All Active Households",
        };
        bl1.AddRecipient(new() { Id = new("dd000001-0001-0000-0000-000000000001"), Name = "John Doe", Household = "Doe Family", Email = "john@example.com" });
        bl1.AddRecipient(new() { Id = new("dd000001-0002-0000-0000-000000000001"), Name = "Jane Doe", Household = "Doe Family", Email = "jane@example.com" });

        var bl2 = new BroadcastLog
        {
            Id = new("cc000002-0000-0000-0000-000000000001"),
            Subject = "Choir Rehearsal Cancelled \u2013 March 28",
            Body = "Hi Choir members, this Friday's rehearsal session has been cancelled due to a scheduling conflict. We will resume next Friday.",
            DateSent = new DateTime(2025, 3, 28, 14, 30, 0, DateTimeKind.Utc),
            RecipientCount = 22, TargetAudience = "Choir",
        };
        bl2.AddRecipient(new() { Id = new("dd000002-0001-0000-0000-000000000001"), Name = "Alice Smith", Household = "Smith Family", Email = "alice@example.com" });

        var bl3 = new BroadcastLog
        {
            Id = new("cc000003-0000-0000-0000-000000000001"),
            Subject = "Annual Stewardship Campaign Kickoff",
            Body = "We are excited to announce the beginning of this year's stewardship campaign. More details to follow. May God bless your generosity.",
            DateSent = new DateTime(2025, 3, 1, 8, 0, 0, DateTimeKind.Utc),
            RecipientCount = 97, TargetAudience = "All Active Households",
        };
        bl3.AddRecipient(new() { Id = new("dd000003-0001-0000-0000-000000000001"), Name = "Bob Johnson", Household = "Johnson Family", Email = "bob@example.com" });

        return [bl1, bl2, bl3];
    }
}
