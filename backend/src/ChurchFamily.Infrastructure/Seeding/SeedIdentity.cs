using ChurchFamily.Core.Entities;

namespace ChurchFamily.Infrastructure.Seeding;

public static class SeedIdentity
{
    public static List<Permission> GetPermissions() =>
    [
        new() { Id = new("10000001-0000-0000-0000-000000000001"), Name = "household.view", Group = "Household", Description = "View households" },
        new() { Id = new("10000002-0000-0000-0000-000000000001"), Name = "household.create", Group = "Household", Description = "Create new households" },
        new() { Id = new("10000003-0000-0000-0000-000000000001"), Name = "household.edit", Group = "Household", Description = "Edit existing households" },
        new() { Id = new("10000004-0000-0000-0000-000000000001"), Name = "household.delete", Group = "Household", Description = "Delete households" },
        new() { Id = new("10000005-0000-0000-0000-000000000001"), Name = "settings.view", Group = "Settings", Description = "View settings" },
        new() { Id = new("10000006-0000-0000-0000-000000000001"), Name = "settings.edit", Group = "Settings", Description = "Edit settings" },
        new() { Id = new("10000007-0000-0000-0000-000000000001"), Name = "roles.view", Group = "Administration", Description = "View roles" },
        new() { Id = new("10000008-0000-0000-0000-000000000001"), Name = "roles.manage", Group = "Administration", Description = "Manage roles and permissions" },
        new() { Id = new("10000009-0000-0000-0000-000000000001"), Name = "users.view", Group = "Administration", Description = "View users" },
        new() { Id = new("10000010-0000-0000-0000-000000000001"), Name = "users.create", Group = "Administration", Description = "Create users" },
        new() { Id = new("10000011-0000-0000-0000-000000000001"), Name = "users.edit", Group = "Administration", Description = "Edit users" },
        new() { Id = new("10000012-0000-0000-0000-000000000001"), Name = "users.delete", Group = "Administration", Description = "Delete users" },
        new() { Id = new("10000013-0000-0000-0000-000000000001"), Name = "relationships.view", Group = "Household", Description = "View relationships" },
        new() { Id = new("10000014-0000-0000-0000-000000000001"), Name = "relationships.manage", Group = "Household", Description = "Manage relationships" },
        new() { Id = new("10000015-0000-0000-0000-000000000001"), Name = "documents.view", Group = "Household", Description = "View documents" },
        new() { Id = new("10000016-0000-0000-0000-000000000001"), Name = "documents.manage", Group = "Household", Description = "Manage documents" },
        new() { Id = new("10000017-0000-0000-0000-000000000001"), Name = "pictures.view", Group = "Household", Description = "View pictures" },
        new() { Id = new("10000018-0000-0000-0000-000000000001"), Name = "pictures.manage", Group = "Household", Description = "Manage pictures" },
        new() { Id = new("10000019-0000-0000-0000-000000000001"), Name = "stewardships.view", Group = "Household", Description = "View stewardships" },
        new() { Id = new("10000020-0000-0000-0000-000000000001"), Name = "stewardships.manage", Group = "Household", Description = "Manage stewardships" },
        new() { Id = new("10000021-0000-0000-0000-000000000001"), Name = "donations.view", Group = "Finances", Description = "View individual donations" },
        new() { Id = new("10000022-0000-0000-0000-000000000001"), Name = "donations.manage", Group = "Finances", Description = "Manage individual donations" },
        new() { Id = new("10000023-0000-0000-0000-000000000001"), Name = "donations.batch", Group = "Finances", Description = "Access batch entry" },
        new() { Id = new("10000024-0000-0000-0000-000000000001"), Name = "taxstatements.view", Group = "Finances", Description = "View tax statements" },
        new() { Id = new("10000025-0000-0000-0000-000000000001"), Name = "taxstatements.generate", Group = "Finances", Description = "Generate tax statements" },
        new() { Id = new("10000026-0000-0000-0000-000000000001"), Name = "groups.view", Group = "Groups", Description = "View groups and ministries" },
        new() { Id = new("10000027-0000-0000-0000-000000000001"), Name = "groups.manage", Group = "Groups", Description = "Manage groups and members" },
        new() { Id = new("10000028-0000-0000-0000-000000000001"), Name = "communications.view", Group = "Communications", Description = "View communications" },
        new() { Id = new("10000029-0000-0000-0000-000000000001"), Name = "communications.send", Group = "Communications", Description = "Send communications" },
        new() { Id = new("10000030-0000-0000-0000-000000000001"), Name = "reports.view", Group = "Reports", Description = "View reports" },
    ];

    // Role IDs
    public static readonly string AdminRoleId = "r0000001-0000-0000-0000-000000000001";
    public static readonly string SecretaryRoleId = "r0000002-0000-0000-0000-000000000001";
    public static readonly string ViewerRoleId = "r0000003-0000-0000-0000-000000000001";

    public static List<ApplicationRole> GetRoles() =>
    [
        new()
        {
            Id = AdminRoleId, Name = "Admin", NormalizedName = "ADMIN",
            Description = "Full access to all features",
            CreatedBy = "system", CreatedAt = new DateTime(2023, 1, 1, 8, 0, 0, DateTimeKind.Utc),
            LastModifiedBy = "system", LastModifiedAt = new DateTime(2023, 1, 1, 8, 0, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = SecretaryRoleId, Name = "Secretary", NormalizedName = "SECRETARY",
            Description = "Can manage households but not security settings",
            CreatedBy = "system", CreatedAt = new DateTime(2023, 1, 15, 10, 30, 0, DateTimeKind.Utc),
            LastModifiedBy = "admin@example.com", LastModifiedAt = new DateTime(2023, 6, 20, 14, 15, 0, DateTimeKind.Utc),
        },
        new()
        {
            Id = ViewerRoleId, Name = "Viewer", NormalizedName = "VIEWER",
            Description = "Read-only access",
            CreatedBy = "system", CreatedAt = new DateTime(2023, 1, 15, 10, 35, 0, DateTimeKind.Utc),
            LastModifiedBy = "system", LastModifiedAt = new DateTime(2023, 1, 15, 10, 35, 0, DateTimeKind.Utc),
        },
    ];

    /// <summary>
    /// All 30 permission IDs for Admin role.
    /// </summary>
    private static readonly int[] AdminPermissionIndices = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
    private static readonly int[] SecretaryPermissionIndices = [1,2,3,5,6,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
    private static readonly int[] ViewerPermissionIndices = [1,5,13,15,17,19,21,24,26,28,30];

    public static List<RolePermission> GetRolePermissions()
    {
        var result = new List<RolePermission>();

        foreach (var idx in AdminPermissionIndices)
            result.Add(new RolePermission { RoleId = Guid.Parse(AdminRoleId), PermissionId = new Guid($"100000{idx:D2}-0000-0000-0000-000000000001") });

        foreach (var idx in SecretaryPermissionIndices)
            result.Add(new RolePermission { RoleId = Guid.Parse(SecretaryRoleId), PermissionId = new Guid($"100000{idx:D2}-0000-0000-0000-000000000001") });

        foreach (var idx in ViewerPermissionIndices)
            result.Add(new RolePermission { RoleId = Guid.Parse(ViewerRoleId), PermissionId = new Guid($"100000{idx:D2}-0000-0000-0000-000000000001") });

        return result;
    }

    // User IDs
    public static readonly string AdminUserId = "u0000001-0000-0000-0000-000000000001";
    public static readonly string UserUserId = "u0000002-0000-0000-0000-000000000001";
    public static readonly string ViewerUserId = "u0000003-0000-0000-0000-000000000001";

    public static List<ApplicationUser> GetUsers() =>
    [
        new()
        {
            Id = AdminUserId, UserName = "admin@example.com", NormalizedUserName = "ADMIN@EXAMPLE.COM",
            Email = "admin@example.com", NormalizedEmail = "ADMIN@EXAMPLE.COM", EmailConfirmed = true,
            FirstName = "Admin", LastName = "User",
            AvatarUrl = "https://ui-avatars.com/api/?name=admin&rounded=true&format=svg&bold=true&background=random",
            CreatedBy = "system", CreatedAt = new DateTime(2023, 1, 1, 8, 0, 0, DateTimeKind.Utc),
            LastModifiedBy = "system", LastModifiedAt = new DateTime(2023, 1, 1, 8, 0, 0, DateTimeKind.Utc),
            SecurityStamp = Guid.NewGuid().ToString(),
        },
        new()
        {
            Id = UserUserId, UserName = "user@example.com", NormalizedUserName = "USER@EXAMPLE.COM",
            Email = "user@example.com", NormalizedEmail = "USER@EXAMPLE.COM", EmailConfirmed = true,
            FirstName = "User", LastName = "User",
            AvatarUrl = "https://ui-avatars.com/api/?name=user&rounded=true&format=svg&bold=true&background=random",
            CreatedBy = "system", CreatedAt = new DateTime(2023, 1, 1, 8, 0, 0, DateTimeKind.Utc),
            LastModifiedBy = "system", LastModifiedAt = new DateTime(2023, 1, 1, 8, 0, 0, DateTimeKind.Utc),
            SecurityStamp = Guid.NewGuid().ToString(),
        },
        new()
        {
            Id = ViewerUserId, UserName = "viewer@example.com", NormalizedUserName = "VIEWER@EXAMPLE.COM",
            Email = "viewer@example.com", NormalizedEmail = "VIEWER@EXAMPLE.COM", EmailConfirmed = true,
            FirstName = "Viewer", LastName = "User",
            AvatarUrl = "https://ui-avatars.com/api/?name=viewer&rounded=true&format=svg&bold=true&background=random",
            CreatedBy = "system", CreatedAt = new DateTime(2023, 1, 1, 8, 0, 0, DateTimeKind.Utc),
            LastModifiedBy = "system", LastModifiedAt = new DateTime(2023, 1, 1, 8, 0, 0, DateTimeKind.Utc),
            SecurityStamp = Guid.NewGuid().ToString(),
        },
    ];
}
