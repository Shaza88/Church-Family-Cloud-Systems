namespace ChurchFamily.Core.Entities;

/// <summary>
/// Join entity for the many-to-many relationship between ApplicationRole and Permission.
/// </summary>
public class RolePermission
{
    public Guid RoleId { get; set; }
    public ApplicationRole Role { get; set; } = null!;

    public Guid PermissionId { get; set; }
    public Permission Permission { get; set; } = null!;
}
