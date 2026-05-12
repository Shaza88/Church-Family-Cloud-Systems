namespace ChurchFamily.Core.Entities;

public class BroadcastRecipient
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Household { get; set; } = string.Empty;
    public string? Email { get; set; }

    // Foreign key
    public Guid BroadcastLogId { get; set; }
    public BroadcastLog BroadcastLog { get; set; } = null!;
}
