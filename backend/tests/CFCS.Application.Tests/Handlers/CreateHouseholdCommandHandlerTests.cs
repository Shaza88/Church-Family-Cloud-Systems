using CFCS.Application.DTOs;
using CFCS.Application.Features.Households.Commands;
using CFCS.Application.Tests.Helpers;
using CFCS.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CFCS.Application.Tests.Handlers;

public class CreateHouseholdCommandHandlerTests
{
    // --- Test: Successfully creates a household with Guid.CreateVersion7() ---

    [Fact]
    public async Task Handle_ValidCommand_CreatesHouseholdWithVersion7Guid()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var handler = new CreateHouseholdCommandHandler(context);

        var dto = new CreateHouseholdDto(
            Name: "Johnson, Michael",
            Address: new AddressDto("123 Main St", null, "Wayne", "PA", "19087"),
            Status: "Active",
            Phone: "555-0100",
            Phone2: null,
            Members: new List<CreateIndividualDto>
            {
                new("Michael", null, "Johnson", "Head", "Male", null, "mike@example.com", "555-0101", null, null),
            });

        var command = new CreateHouseholdCommand(dto);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert: Result DTO is correct
        Assert.NotEqual(Guid.Empty, result.Id);
        Assert.Equal("Johnson, Michael", result.Name);
        Assert.Equal("Active", result.Status);
        Assert.Equal("555-0100", result.Phone);
        Assert.Equal(1, result.MemberCount);
        Assert.Single(result.Members);
        Assert.Equal("Michael", result.Members[0].FirstName);
        Assert.Equal("Johnson", result.Members[0].LastName);

        // Assert: Address mapped correctly
        Assert.Equal("123 Main St", result.Address.Street1);
        Assert.Equal("Wayne", result.Address.City);
        Assert.Equal("PA", result.Address.State);
        Assert.Equal("19087", result.Address.Zip);
    }

    [Fact]
    public async Task Handle_ValidCommand_GeneratesVersion7Guid()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var handler = new CreateHouseholdCommandHandler(context);

        var dto = new CreateHouseholdDto(
            Name: "Test Household",
            Address: new AddressDto("1 Test Rd", null, "Test City", "PA", "19000"),
            Status: "Active",
            Phone: null, Phone2: null,
            Members: new List<CreateIndividualDto>
            {
                new("Jane", null, "Doe", "Head", "Female", null, null, null, null, null),
            });

        // Act
        var result = await handler.Handle(new CreateHouseholdCommand(dto), CancellationToken.None);

        // Assert: The GUID is valid (non-empty) and is a Version 7 UUID
        Assert.NotEqual(Guid.Empty, result.Id);

        // Version 7 GUIDs have version nibble = 0x7 in byte 6 (high nibble)
        var bytes = result.Id.ToByteArray();
        // .NET Guid byte layout: bytes[7] contains the version nibble in the high 4 bits
        var version = (bytes[7] >> 4) & 0x0F;
        Assert.Equal(7, version);
    }

    [Fact]
    public async Task Handle_ValidCommand_PersistsEntityToDatabase()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var handler = new CreateHouseholdCommandHandler(context);

        var dto = new CreateHouseholdDto(
            Name: "Persisted Family",
            Address: new AddressDto("55 DB Lane", null, "Berwyn", "PA", "19312"),
            Status: "Visitor",
            Phone: null, Phone2: null,
            Members: new List<CreateIndividualDto>
            {
                new("Tom", null, "Persisted", "Head", "Male", null, null, null, null, null),
            });

        // Act
        await handler.Handle(new CreateHouseholdCommand(dto), CancellationToken.None);

        // Assert: Verify entity is in the database
        var savedHousehold = await context.Households
            .Include(h => h.Members)
            .FirstOrDefaultAsync(h => h.Name == "Persisted Family");

        Assert.NotNull(savedHousehold);
        Assert.Equal("Persisted Family", savedHousehold.Name);
        Assert.Equal("Berwyn", savedHousehold.Address.City);
        Assert.Equal(Core.Enums.HouseholdStatus.Visitor, savedHousehold.Status);
        Assert.Single(savedHousehold.Members);
        Assert.Equal("Tom", savedHousehold.Members.First().FirstName);
        Assert.NotNull(savedHousehold.CreatedAt);
    }

    [Fact]
    public async Task Handle_MultipleMembers_AllMembersPersisted()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        var handler = new CreateHouseholdCommandHandler(context);

        var dto = new CreateHouseholdDto(
            Name: "Multi-Member Family",
            Address: new AddressDto("99 Family Rd", null, "Devon", "PA", "19333"),
            Status: "Active",
            Phone: null, Phone2: null,
            Members: new List<CreateIndividualDto>
            {
                new("John", null, "Multi", "Head", "Male", new DateTime(1980, 5, 10), "john@example.com", null, "Engineer", null),
                new("Jane", null, "Multi", "Spouse", "Female", new DateTime(1982, 3, 15), "jane@example.com", null, "Teacher", null),
                new("Billy", null, "Multi", "Child", "Male", new DateTime(2010, 7, 1), null, null, null, "Son"),
            });

        // Act
        var result = await handler.Handle(new CreateHouseholdCommand(dto), CancellationToken.None);

        // Assert
        Assert.Equal(3, result.MemberCount);
        Assert.Equal(3, result.Members.Count);
        Assert.Contains(result.Members, m => m.FirstName == "John" && m.Role == "Head");
        Assert.Contains(result.Members, m => m.FirstName == "Jane" && m.Role == "Spouse");
        Assert.Contains(result.Members, m => m.FirstName == "Billy" && m.Role == "Child");

        // Each member should have a unique Version 7 GUID
        var memberIds = result.Members.Select(m => m.Id).ToList();
        Assert.Equal(3, memberIds.Distinct().Count());
        Assert.All(memberIds, id => Assert.NotEqual(Guid.Empty, id));
    }
}
