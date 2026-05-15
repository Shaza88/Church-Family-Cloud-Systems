using CFCS.Application.Common.Interfaces;
using CFCS.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace CFCS.Application.Tests.Helpers;

/// <summary>
/// Factory for creating isolated InMemory ApplicationDbContext instances for testing.
/// Each call creates a unique database to avoid cross-test state contamination.
/// </summary>
public static class TestDbContextFactory
{
    /// <summary>
    /// Creates a fresh InMemory ApplicationDbContext with a unique database name.
    /// The context implements IApplicationDbContext and is ready for use in handlers.
    /// </summary>
    public static ApplicationDbContext Create(string? databaseName = null)
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName ?? Guid.NewGuid().ToString())
            .Options;

        var context = new ApplicationDbContext(options);
        context.Database.EnsureCreated();
        return context;
    }
}
