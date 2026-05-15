namespace CFCS.Core.Entities;

public class Group : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string MeetingTime { get; set; } = string.Empty;
}
