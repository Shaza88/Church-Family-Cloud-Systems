using Microsoft.AspNetCore.Identity;

namespace ChurchFamily.Core.Entities;

public class ApplicationRole : IdentityRole
{
    public string? Description { get; set; }

    // Audit fields
    public string? CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? LastModifiedBy { get; set; }
    public DateTime? LastModifiedAt { get; set; }

    // Encapsulated child collection
    private readonly List<RolePermission> _rolePermissions = [];
    public IReadOnlyCollection<RolePermission> RolePermissions => _rolePermissions.AsReadOnly();
}
