using CFCS.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CFCS.Application.Common.Interfaces;

/// <summary>
/// Abstraction over the EF Core DbContext for the Application layer.
/// </summary>
public interface IApplicationDbContext
{
    DbSet<Household> Households { get; }
    DbSet<Individual> Individuals { get; }
    DbSet<Fund> Funds { get; }
    DbSet<Batch> Batches { get; }
    DbSet<Donation> Donations { get; }
    DbSet<Stewardship> Stewardships { get; }
    DbSet<BroadcastLog> BroadcastLogs { get; }
    DbSet<BroadcastRecipient> BroadcastRecipients { get; }
    DbSet<Group> Groups { get; }
    DbSet<Permission> Permissions { get; }
    DbSet<RolePermission> RolePermissions { get; }
    DbSet<ApplicationRole> Roles { get; }
    DbSet<ApplicationUser> Users { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
