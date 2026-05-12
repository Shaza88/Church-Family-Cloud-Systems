using ChurchFamily.Core.Entities;

namespace ChurchFamily.Infrastructure.Seeding;

public static class SeedGroups
{
    public static List<Group> GetGroups() =>
    [
        new()
        {
            Id = new("e0000001-0000-0000-0000-000000000001"),
            Name = "Choir",
            Description = "Leads Sunday worship through vocal praise.",
            MeetingTime = "Wednesdays at 7:00 PM",
            CreatedBy = "system", CreatedAt = new DateTime(2024, 1, 1, 10, 0, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("e0000002-0000-0000-0000-000000000001"),
            Name = "Sunday School",
            Description = "Children and youth biblical education and activities.",
            MeetingTime = "Sundays at 9:00 AM",
            CreatedBy = "system", CreatedAt = new DateTime(2024, 1, 1, 10, 0, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("e0000003-0000-0000-0000-000000000001"),
            Name = "Finance Committee",
            Description = "Oversees the financial health and stewardship of the church.",
            MeetingTime = "First Tuesday of every month at 6:30 PM",
            CreatedBy = "system", CreatedAt = new DateTime(2024, 1, 1, 10, 0, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = new("e0000004-0000-0000-0000-000000000001"),
            Name = "Hospitality",
            Description = "Greets visitors and manages Sunday morning coffee and donuts.",
            MeetingTime = "Sundays at 8:30 AM",
            CreatedBy = "system", CreatedAt = new DateTime(2024, 1, 1, 10, 0, 0, DateTimeKind.Utc),
        },
    ];
}
