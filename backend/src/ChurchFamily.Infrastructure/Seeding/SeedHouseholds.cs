using ChurchFamily.Core.Entities;
using ChurchFamily.Core.Enums;

namespace ChurchFamily.Infrastructure.Seeding;

/// <summary>
/// Seeds household data. The first 17 are hand-crafted to match the frontend exactly.
/// The remaining ~143 use a deterministic PRNG to replicate the frontend's random generation.
/// </summary>
public static class SeedHouseholds
{
    // Deterministic GUIDs for the 17 hand-crafted households
    private static readonly Guid[] HouseholdIds =
    [
        new("a0000002-0000-0000-0000-000000000001"), // h2
        new("a0000003-0000-0000-0000-000000000001"), // h3
        new("a0000004-0000-0000-0000-000000000001"), // h4
        new("a0000005-0000-0000-0000-000000000001"), // h5
        new("a0000006-0000-0000-0000-000000000001"), // h6
        new("a0000007-0000-0000-0000-000000000001"), // h7
        new("a0000008-0000-0000-0000-000000000001"), // h8
        new("a0000009-0000-0000-0000-000000000001"), // h9
        new("a0000010-0000-0000-0000-000000000001"), // h10
        new("a0000011-0000-0000-0000-000000000001"), // h11
        new("a0000012-0000-0000-0000-000000000001"), // h12
        new("a0000013-0000-0000-0000-000000000001"), // h13
        new("a0000014-0000-0000-0000-000000000001"), // h14
        new("a0000015-0000-0000-0000-000000000001"), // h15
        new("a0000016-0000-0000-0000-000000000001"), // h16
        new("a0000017-0000-0000-0000-000000000001"), // h17
    ];

    public static List<Household> GetHouseholds()
    {
        var households = GetHandCraftedHouseholds();
        households.AddRange(GetGeneratedHouseholds());
        return households;
    }

    private static Household CreateHousehold(Guid id, string name, Address address, HouseholdStatus status, int memberCount, List<Individual> members, string? createdBy = null, DateTime? createdAt = null, string? lastModifiedBy = null, DateTime? lastModifiedAt = null)
    {
        var h = new Household
        {
            Id = id, Name = name, Address = address, Status = status, MemberCount = memberCount,
            CreatedBy = createdBy, CreatedAt = createdAt, LastModifiedBy = lastModifiedBy, LastModifiedAt = lastModifiedAt,
        };
        foreach (var m in members) h.AddMember(m);
        return h;
    }

    private static List<Household> GetHandCraftedHouseholds()
    {
        return
        [
            CreateHousehold(HouseholdIds[0], "Smith, John",
                new Address { Street1 = "450 West Ave", City = "Wayne", State = "PA", Zip = "19087" },
                HouseholdStatus.Visitor, 1,
                [new() { Id = new("b0000005-0000-0000-0000-000000000001"), FirstName = "John", LastName = "Smith", Role = MemberRole.Head, Gender = Gender.Male, Email = "john.smith@example.com" }],
                "system", new DateTime(2023, 2, 10, 9, 15, 0, DateTimeKind.Utc), "admin@example.com", new DateTime(2024, 1, 15, 14, 30, 0, DateTimeKind.Utc)),

            CreateHousehold(HouseholdIds[1], "Doe, Jane",
                new Address { Street1 = "99 Old Road", City = "Paoli", State = "PA", Zip = "19301" },
                HouseholdStatus.Inactive, 1,
                [new() { Id = new("b0000006-0000-0000-0000-000000000001"), FirstName = "Jane", LastName = "Doe", Role = MemberRole.Head, Gender = Gender.Female, Email = "jane.doe@example.com" }],
                "system", new DateTime(2023, 3, 5, 11, 20, 0, DateTimeKind.Utc), "system", new DateTime(2023, 3, 5, 11, 20, 0, DateTimeKind.Utc)),

            CreateHousehold(HouseholdIds[2], "Johnson, Michael & Sarah",
                new Address { Street1 = "789 Pine St", City = "Malvern", State = "PA", Zip = "19355" },
                HouseholdStatus.Active, 3,
                [
                    new() { Id = new("b0000007-0000-0000-0000-000000000001"), FirstName = "Michael", LastName = "Johnson", Role = MemberRole.Head, Gender = Gender.Male, Email = "mike.j@example.com" },
                    new() { Id = new("b0000008-0000-0000-0000-000000000001"), FirstName = "Sarah", LastName = "Johnson", Role = MemberRole.Spouse, Gender = Gender.Female, Email = "sarah.j@example.com" },
                    new() { Id = new("b0000009-0000-0000-0000-000000000001"), FirstName = "Emily", LastName = "Johnson", Role = MemberRole.Child, Gender = Gender.Female, DateOfBirth = new DateTime(2010, 3, 15, 0, 0, 0, DateTimeKind.Utc) },
                ],
                "admin@example.com", new DateTime(2023, 11, 20, 16, 45, 0, DateTimeKind.Utc), "admin@example.com", new DateTime(2024, 2, 1, 9, 10, 0, DateTimeKind.Utc)),

            CreateHousehold(HouseholdIds[3], "Williams, David",
                new Address { Street1 = "321 Oak Dr", City = "Berwyn", State = "PA", Zip = "19312" },
                HouseholdStatus.Active, 1,
                [new() { Id = new("b0000010-0000-0000-0000-000000000001"), FirstName = "David", LastName = "Williams", Role = MemberRole.Head, Gender = Gender.Male, Email = "david.w@example.com" }],
                "system", new DateTime(2023, 5, 12, 10, 5, 0, DateTimeKind.Utc), "system", new DateTime(2023, 5, 12, 10, 5, 0, DateTimeKind.Utc)),

            CreateHousehold(HouseholdIds[4], "Brown, Emily",
                new Address { Street1 = "654 Cedar Ln", City = "Devon", State = "PA", Zip = "19333" },
                HouseholdStatus.Visitor, 1,
                [new() { Id = new("b0000011-0000-0000-0000-000000000001"), FirstName = "Emily", LastName = "Brown", Role = MemberRole.Head, Gender = Gender.Female, Email = "emily.b@example.com" }],
                "system", new DateTime(2023, 8, 22, 13, 40, 0, DateTimeKind.Utc), "admin@example.com", new DateTime(2024, 5, 18, 10, 15, 0, DateTimeKind.Utc)),

            CreateHousehold(HouseholdIds[5], "Jones, Chris & Pat",
                new Address { Street1 = "987 Birch Rd", City = "King of Prussia", State = "PA", Zip = "19406" },
                HouseholdStatus.Active, 2,
                [
                    new() { Id = new("b0000012-0000-0000-0000-000000000001"), FirstName = "Chris", LastName = "Jones", Role = MemberRole.Head, Gender = Gender.Male, Email = "chris.j@example.com" },
                    new() { Id = new("b0000013-0000-0000-0000-000000000001"), FirstName = "Pat", LastName = "Jones", Role = MemberRole.Spouse, Gender = Gender.Female, Email = "pat.j@example.com" },
                ]),

            CreateHousehold(HouseholdIds[6], "Garcia, Maria",
                new Address { Street1 = "147 Elm St", City = "Norristown", State = "PA", Zip = "19401" },
                HouseholdStatus.Inactive, 1,
                [new() { Id = new("b0000014-0000-0000-0000-000000000001"), FirstName = "Maria", LastName = "Garcia", Role = MemberRole.Head, Gender = Gender.Female, Email = "maria.g@example.com" }]),

            CreateHousehold(HouseholdIds[7], "Miller, Robert & Linda",
                new Address { Street1 = "258 Spruce Ave", City = "Phoenixville", State = "PA", Zip = "19460" },
                HouseholdStatus.Active, 2,
                [
                    new() { Id = new("b0000015-0000-0000-0000-000000000001"), FirstName = "Robert", LastName = "Miller", Role = MemberRole.Head, Gender = Gender.Male, Email = "robert.m@example.com" },
                    new() { Id = new("b0000016-0000-0000-0000-000000000001"), FirstName = "Linda", LastName = "Miller", Role = MemberRole.Spouse, Gender = Gender.Female, Email = "linda.m@example.com" },
                ]),

            CreateHousehold(HouseholdIds[8], "Davis, James",
                new Address { Street1 = "369 Walnut Blvd", City = "West Chester", State = "PA", Zip = "19380" },
                HouseholdStatus.Visitor, 1,
                [new() { Id = new("b0000017-0000-0000-0000-000000000001"), FirstName = "James", LastName = "Davis", Role = MemberRole.Head, Gender = Gender.Male, Email = "james.d@example.com" }]),

            CreateHousehold(HouseholdIds[9], "Rodriguez, Jose & Elena",
                new Address { Street1 = "741 Cherry Ct", City = "Exton", State = "PA", Zip = "19341" },
                HouseholdStatus.Active, 4,
                [
                    new() { Id = new("b0000018-0000-0000-0000-000000000001"), FirstName = "Jose", LastName = "Rodriguez", Role = MemberRole.Head, Gender = Gender.Male, Email = "jose.r@example.com" },
                    new() { Id = new("b0000019-0000-0000-0000-000000000001"), FirstName = "Elena", LastName = "Rodriguez", Role = MemberRole.Spouse, Gender = Gender.Female, Email = "elena.r@example.com" },
                    new() { Id = new("b0000020-0000-0000-0000-000000000001"), FirstName = "Carlos", LastName = "Rodriguez", Role = MemberRole.Child, Gender = Gender.Male, DateOfBirth = new DateTime(2012, 6, 20, 0, 0, 0, DateTimeKind.Utc) },
                    new() { Id = new("b0000021-0000-0000-0000-000000000001"), FirstName = "Sofia", LastName = "Rodriguez", Role = MemberRole.Child, Gender = Gender.Female, DateOfBirth = new DateTime(2014, 9, 12, 0, 0, 0, DateTimeKind.Utc) },
                ]),

            CreateHousehold(HouseholdIds[10], "Martinez, William",
                new Address { Street1 = "852 Poplar Pl", City = "Downingtown", State = "PA", Zip = "19335" },
                HouseholdStatus.Active, 1,
                [new() { Id = new("b0000022-0000-0000-0000-000000000001"), FirstName = "William", LastName = "Martinez", Role = MemberRole.Head, Gender = Gender.Male, Email = "william.m@example.com" }]),

            CreateHousehold(HouseholdIds[11], "Hernandez, Jennifer",
                new Address { Street1 = "963 Sycamore Way", City = "Coatesville", State = "PA", Zip = "19320" },
                HouseholdStatus.Inactive, 1,
                [new() { Id = new("b0000023-0000-0000-0000-000000000001"), FirstName = "Jennifer", LastName = "Hernandez", Role = MemberRole.Head, Gender = Gender.Female, Email = "jen.h@example.com" }]),

            CreateHousehold(HouseholdIds[12], "Lopez, Charles & Amanda",
                new Address { Street1 = "159 Willow Dr", City = "Media", State = "PA", Zip = "19063" },
                HouseholdStatus.Active, 3,
                [
                    new() { Id = new("b0000024-0000-0000-0000-000000000001"), FirstName = "Charles", LastName = "Lopez", Role = MemberRole.Head, Gender = Gender.Male, Email = "charles.l@example.com" },
                    new() { Id = new("b0000025-0000-0000-0000-000000000001"), FirstName = "Amanda", LastName = "Lopez", Role = MemberRole.Spouse, Gender = Gender.Female, Email = "amanda.l@example.com" },
                    new() { Id = new("b0000026-0000-0000-0000-000000000001"), FirstName = "Mateo", LastName = "Lopez", Role = MemberRole.Child, Gender = Gender.Male, DateOfBirth = new DateTime(2019, 2, 28, 0, 0, 0, DateTimeKind.Utc) },
                ]),

            CreateHousehold(HouseholdIds[13], "Gonzalez, Thomas",
                new Address { Street1 = "357 Magnolia Ln", City = "Springfield", State = "PA", Zip = "19064" },
                HouseholdStatus.Visitor, 1,
                [new() { Id = new("b0000027-0000-0000-0000-000000000001"), FirstName = "Thomas", LastName = "Gonzalez", Role = MemberRole.Head, Gender = Gender.Male, Email = "thomas.g@example.com" }]),

            CreateHousehold(HouseholdIds[14], "Wilson, Daniel & Michelle",
                new Address { Street1 = "486 Dogwood Rd", City = "Broomall", State = "PA", Zip = "19008" },
                HouseholdStatus.Active, 2,
                [
                    new() { Id = new("b0000028-0000-0000-0000-000000000001"), FirstName = "Daniel", LastName = "Wilson", Role = MemberRole.Head, Gender = Gender.Male, Email = "daniel.w@example.com" },
                    new() { Id = new("b0000029-0000-0000-0000-000000000001"), FirstName = "Michelle", LastName = "Wilson", Role = MemberRole.Spouse, Gender = Gender.Female, Email = "michelle.w@example.com" },
                ]),

            CreateHousehold(HouseholdIds[15], "Anderson, Matthew",
                new Address { Street1 = "519 Cypress Cir", City = "Newtown Square", State = "PA", Zip = "19073" },
                HouseholdStatus.Active, 1,
                [new() { Id = new("b0000030-0000-0000-0000-000000000001"), FirstName = "Matthew", LastName = "Anderson", Role = MemberRole.Head, Gender = Gender.Male, Email = "matt.a@example.com" }]),
        ];
    }

    private static List<Household> GetGeneratedHouseholds()
    {
        var firstNames = new[] { "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen" };
        var lastNames = new[] { "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin" };
        var cities = new[] { "Wayne", "Paoli", "Malvern", "Berwyn", "Devon", "Exton", "Media", "Chester", "King of Prussia", "Norristown" };
        var statuses = new[] { HouseholdStatus.Active, HouseholdStatus.Inactive, HouseholdStatus.Visitor };

        var rng = new Random(42);
        var households = new List<Household>();

        for (var i = 18; i <= 160; i++)
        {
            var lastName = lastNames[rng.Next(lastNames.Length)];
            var headName = firstNames[rng.Next(firstNames.Length)];
            var spouseName = firstNames[rng.Next(firstNames.Length)];
            var hasSpouse = rng.NextDouble() > 0.4;
            var status = statuses[rng.Next(statuses.Length)];
            var householdId = new Guid($"a0000{i:D3}-0000-0000-0000-000000000001");
            var headGender = rng.NextDouble() > 0.5 ? Gender.Male : Gender.Female;
            var spouseGender = rng.NextDouble() > 0.5 ? Gender.Male : Gender.Female;

            var members = new List<Individual>
            {
                new()
                {
                    Id = new Guid($"b0000{i:D3}-0001-0000-0000-000000000001"),
                    FirstName = headName, LastName = lastName, Role = MemberRole.Head,
                    Gender = headGender, Email = $"{headName.ToLowerInvariant()}.{lastName.ToLowerInvariant()}@example.com",
                    Phone = $"555-{rng.Next(1000, 9999)}",
                }
            };

            if (hasSpouse)
            {
                members.Add(new()
                {
                    Id = new Guid($"b0000{i:D3}-0002-0000-0000-000000000001"),
                    FirstName = spouseName, LastName = lastName, Role = MemberRole.Spouse,
                    Gender = spouseGender, Email = $"{spouseName.ToLowerInvariant()}.{lastName.ToLowerInvariant()}@example.com",
                    Phone = $"555-{rng.Next(1000, 9999)}",
                });
            }

            var extraMembers = rng.NextDouble() > 0.7 ? rng.Next(1, 4) : 0;
            var baseDate = new DateTime(2023, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            households.Add(CreateHousehold(
                householdId,
                hasSpouse ? $"{lastName}, {headName} & {spouseName}" : $"{lastName}, {headName}",
                new Address { Street1 = $"{rng.Next(1, 999)} Maple Stick Rd", City = cities[rng.Next(cities.Length)], State = "PA", Zip = $"19{rng.Next(300, 399)}" },
                status, members.Count + extraMembers, members,
                "system", baseDate.AddDays(rng.Next(0, 730)), "system", baseDate.AddDays(rng.Next(730, 1095))));
        }

        return households;
    }
}
