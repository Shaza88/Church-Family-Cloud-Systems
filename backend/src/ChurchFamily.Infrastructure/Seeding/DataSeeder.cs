using ChurchFamily.Core.Entities;
using ChurchFamily.Infrastructure.Persistence;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace ChurchFamily.Infrastructure.Seeding;

/// <summary>
/// Orchestrates seeding of all data into the InMemory database on application startup.
/// </summary>
public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();

        try
        {
            await context.Database.EnsureCreatedAsync();

            // Seed Permissions
            if (!await context.Permissions.AnyAsync())
            {
                context.Permissions.AddRange(SeedIdentity.GetPermissions());
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded {Count} permissions", 30);
            }

            // Seed Roles
            if (!await context.Roles.AnyAsync())
            {
                context.Roles.AddRange(SeedIdentity.GetRoles());
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded 3 roles");
            }

            // Seed RolePermissions
            if (!await context.RolePermissions.AnyAsync())
            {
                context.RolePermissions.AddRange(SeedIdentity.GetRolePermissions());
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded role-permission mappings");
            }

            // Seed Users via UserManager (handles password hashing)
            if (!await context.Users.AnyAsync())
            {
                var users = SeedIdentity.GetUsers();
                var passwords = new[] { "admin", "user", "viewer" };
                var roleNames = new[] { "Admin", "Secretary", "Viewer" };

                for (var i = 0; i < users.Count; i++)
                {
                    var result = await userManager.CreateAsync(users[i], passwords[i]);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(users[i], roleNames[i]);
                        logger.LogInformation("Seeded user {Email} with role {Role}", users[i].Email, roleNames[i]);
                    }
                    else
                    {
                        logger.LogWarning("Failed to seed user {Email}: {Errors}", users[i].Email,
                            string.Join(", ", result.Errors.Select(e => e.Description)));
                    }
                }
            }

            // Seed Households (with Members)
            if (!await context.Households.AnyAsync())
            {
                var households = SeedHouseholds.GetHouseholds();
                context.Households.AddRange(households);
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded {Count} households", households.Count);
            }

            // Seed Funds
            if (!await context.Funds.AnyAsync())
            {
                context.Funds.AddRange(SeedFunds.GetFunds());
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded 4 funds");
            }

            // Seed Batches
            if (!await context.Batches.AnyAsync())
            {
                context.Batches.AddRange(SeedBatches.GetBatches());
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded 5 batches");
            }

            // Seed Donations
            if (!await context.Donations.AnyAsync())
            {
                context.Donations.AddRange(SeedDonations.GetDonations());
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded 5 donations");
            }

            // Seed Stewardships
            if (!await context.Stewardships.AnyAsync())
            {
                context.Stewardships.AddRange(SeedStewardships.GetStewardships());
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded 4 stewardships");
            }

            // Seed Broadcasts
            if (!await context.BroadcastLogs.AnyAsync())
            {
                context.BroadcastLogs.AddRange(SeedBroadcasts.GetBroadcastLogs());
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded 3 broadcast logs");
            }

            // Seed Groups
            if (!await context.Groups.AnyAsync())
            {
                context.Groups.AddRange(SeedGroups.GetGroups());
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded 4 groups");
            }

            logger.LogInformation("Database seeding completed successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while seeding the database");
            throw;
        }
    }
}
