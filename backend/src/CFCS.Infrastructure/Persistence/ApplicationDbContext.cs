using CFCS.Application.Common.Interfaces;
using CFCS.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CFCS.Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Household> Households => Set<Household>();
    public DbSet<Individual> Individuals => Set<Individual>();
    public DbSet<Fund> Funds => Set<Fund>();
    public DbSet<Batch> Batches => Set<Batch>();
    public DbSet<Donation> Donations => Set<Donation>();
    public DbSet<Stewardship> Stewardships => Set<Stewardship>();
    public DbSet<BroadcastLog> BroadcastLogs => Set<BroadcastLog>();
    public DbSet<BroadcastRecipient> BroadcastRecipients => Set<BroadcastRecipient>();
    public DbSet<Group> Groups => Set<Group>();
    public DbSet<Permission> Permissions => Set<Permission>();
    public DbSet<RolePermission> RolePermissions => Set<RolePermission>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
    }
}
