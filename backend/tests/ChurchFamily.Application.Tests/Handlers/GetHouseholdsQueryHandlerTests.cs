using ChurchFamily.Application.Common.Models;
using ChurchFamily.Application.Features.Households.Queries;
using ChurchFamily.Application.Tests.Helpers;
using ChurchFamily.Core.Entities;
using ChurchFamily.Core.Enums;

namespace ChurchFamily.Application.Tests.Handlers;

public class GetHouseholdsQueryHandlerTests
{
    /// <summary>
    /// Seeds the context with N households named alphabetically for consistent sorting.
    /// </summary>
    private static async Task SeedHouseholds(Infrastructure.Persistence.ApplicationDbContext context, int count)
    {
        var names = new[]
        {
            "Adams", "Brown", "Clark", "Davis", "Evans",
            "Foster", "Garcia", "Harris", "Irwin", "Jones",
            "Kim", "Lopez", "Miller", "Nelson", "Ortiz",
        };

        for (int i = 0; i < count; i++)
        {
            var lastName = names[i % names.Length];
            var household = new Household
            {
                Id = Guid.CreateVersion7(),
                Name = $"{lastName}, Test{i}",
                Address = new Address { Street1 = $"{i} Main St", City = i % 2 == 0 ? "Wayne" : "Devon", State = "PA", Zip = i % 2 == 0 ? "19087" : "19333" },
                Status = i % 3 == 0 ? HouseholdStatus.Visitor : HouseholdStatus.Active,
                MemberCount = 1,
            };
            household.AddMember(new Individual
            {
                Id = Guid.CreateVersion7(),
                FirstName = $"Test{i}",
                LastName = lastName,
                Role = MemberRole.Head,
                Gender = Gender.Male,
            });
            context.Households.Add(household);
        }
        await context.SaveChangesAsync();
    }

    // --- Test: Pagination math (Skip/Take) ---

    [Fact]
    public async Task Handle_Pagination_ReturnsCorrectPage()
    {
        // Arrange: Seed 12 households
        using var context = TestDbContextFactory.Create();
        await SeedHouseholds(context, 12);

        var handler = new GetHouseholdsQueryHandler(context);
        var query = new GetHouseholdsQuery(new QueryRequest { PageIndex = 0, PageSize = 5 });

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.Equal(12, result.Total);
        Assert.Equal(5, result.Items.Count);
        Assert.Equal(0, result.PageIndex);
        Assert.Equal(5, result.PageSize);
        Assert.Equal(3, result.TotalPages); // ceil(12/5) = 3
    }

    [Fact]
    public async Task Handle_SecondPage_ReturnsCorrectItems()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        await SeedHouseholds(context, 12);

        var handler = new GetHouseholdsQueryHandler(context);

        var page0 = await handler.Handle(
            new GetHouseholdsQuery(new QueryRequest { PageIndex = 0, PageSize = 5 }),
            CancellationToken.None);

        var page1 = await handler.Handle(
            new GetHouseholdsQuery(new QueryRequest { PageIndex = 1, PageSize = 5 }),
            CancellationToken.None);

        // Assert: Pages don't overlap
        Assert.Equal(5, page0.Items.Count);
        Assert.Equal(5, page1.Items.Count);

        var page0Ids = page0.Items.Select(h => h.Id).ToHashSet();
        var page1Ids = page1.Items.Select(h => h.Id).ToHashSet();
        Assert.Empty(page0Ids.Intersect(page1Ids)); // No overlap
    }

    [Fact]
    public async Task Handle_LastPage_ReturnsRemainingItems()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        await SeedHouseholds(context, 12);

        var handler = new GetHouseholdsQueryHandler(context);
        var query = new GetHouseholdsQuery(new QueryRequest { PageIndex = 2, PageSize = 5 });

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: Last page should have 2 remaining items (12 - 5 - 5 = 2)
        Assert.Equal(12, result.Total);
        Assert.Equal(2, result.Items.Count);
        Assert.Equal(2, result.PageIndex);
    }

    // --- Test: Search logic ---

    [Fact]
    public async Task Handle_SearchByName_FiltersCorrectly()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        await SeedHouseholds(context, 10);

        var handler = new GetHouseholdsQueryHandler(context);
        var query = new GetHouseholdsQuery(new QueryRequest
        {
            PageIndex = 0, PageSize = 50,
            Search = "Adams"
        });

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: Only households matching "Adams" are returned
        Assert.True(result.Total > 0);
        Assert.All(result.Items, item =>
            Assert.Contains("Adams", item.Name, StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task Handle_SearchByMemberFirstName_FiltersCorrectly()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        await SeedHouseholds(context, 10);

        var handler = new GetHouseholdsQueryHandler(context);
        var query = new GetHouseholdsQuery(new QueryRequest
        {
            PageIndex = 0, PageSize = 50,
            Search = "Test0" // Member first name
        });

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: At least one match on member first name
        Assert.True(result.Total > 0);
    }

    [Fact]
    public async Task Handle_SearchNoMatch_ReturnsEmpty()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        await SeedHouseholds(context, 5);

        var handler = new GetHouseholdsQueryHandler(context);
        var query = new GetHouseholdsQuery(new QueryRequest
        {
            PageIndex = 0, PageSize = 10,
            Search = "ZZZZZ_NoMatch"
        });

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.Equal(0, result.Total);
        Assert.Empty(result.Items);
    }

    // --- Test: Filter logic ---

    [Fact]
    public async Task Handle_FilterByStatus_FiltersCorrectly()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        await SeedHouseholds(context, 12); // i%3==0 → Visitor, others → Active

        var handler = new GetHouseholdsQueryHandler(context);
        var query = new GetHouseholdsQuery(new QueryRequest
        {
            PageIndex = 0, PageSize = 50,
            Filters = new QueryFilters { Status = "Visitor" }
        });

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: 0, 3, 6, 9 → 4 visitors
        Assert.Equal(4, result.Total);
        Assert.All(result.Items, item => Assert.Equal("Visitor", item.Status));
    }

    [Fact]
    public async Task Handle_FilterByCity_FiltersCorrectly()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        await SeedHouseholds(context, 10); // i%2==0 → Wayne, others → Devon

        var handler = new GetHouseholdsQueryHandler(context);
        var query = new GetHouseholdsQuery(new QueryRequest
        {
            PageIndex = 0, PageSize = 50,
            Filters = new QueryFilters { City = "Wayne" }
        });

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: 0, 2, 4, 6, 8 → 5 in Wayne
        Assert.Equal(5, result.Total);
        Assert.All(result.Items, item => Assert.Equal("Wayne", item.Address.City));
    }

    // --- Test: Sort logic ---

    [Fact]
    public async Task Handle_SortByNameAsc_ReturnsSortedResults()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        await SeedHouseholds(context, 5);

        var handler = new GetHouseholdsQueryHandler(context);
        var query = new GetHouseholdsQuery(new QueryRequest
        {
            PageIndex = 0, PageSize = 50,
            Sort = new SortOptions { Active = "name", Direction = "asc" }
        });

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: Items should be sorted alphabetically by name
        var names = result.Items.Select(h => h.Name).ToList();
        var sorted = names.OrderBy(n => n).ToList();
        Assert.Equal(sorted, names);
    }

    [Fact]
    public async Task Handle_SortByNameDesc_ReturnsSortedResults()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        await SeedHouseholds(context, 5);

        var handler = new GetHouseholdsQueryHandler(context);
        var query = new GetHouseholdsQuery(new QueryRequest
        {
            PageIndex = 0, PageSize = 50,
            Sort = new SortOptions { Active = "name", Direction = "desc" }
        });

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: Items should be sorted reverse alphabetically
        var names = result.Items.Select(h => h.Name).ToList();
        var sorted = names.OrderByDescending(n => n).ToList();
        Assert.Equal(sorted, names);
    }

    // --- Test: Combined search + pagination ---

    [Fact]
    public async Task Handle_SearchWithPagination_TotalReflectsFilteredCount()
    {
        // Arrange
        using var context = TestDbContextFactory.Create();
        await SeedHouseholds(context, 15);

        var handler = new GetHouseholdsQueryHandler(context);

        // "Adams" appears at index 0 in the name cycle (15 items / 15 names = 1 Adams household)
        var query = new GetHouseholdsQuery(new QueryRequest
        {
            PageIndex = 0, PageSize = 2,
            Search = "Adams"
        });

        // Act
        var result = await handler.Handle(query, CancellationToken.None);

        // Assert: Total reflects filtered count, not all households
        Assert.Equal(result.Total, result.Items.Count); // All Adams fit in one page
        Assert.True(result.Total < 15); // Fewer than total seeded
    }
}
