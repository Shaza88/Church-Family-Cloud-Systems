namespace ChurchFamily.Core.Entities;

/// <summary>
/// Base class for entities that track creation and modification metadata.
/// </summary>
public abstract class AuditableEntity
{
    public Guid Id { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime? CreatedAt { get; set; }
    public string? LastModifiedBy { get; set; }
    public DateTime? LastModifiedAt { get; set; }
}
