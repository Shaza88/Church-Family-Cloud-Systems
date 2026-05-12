namespace ChurchFamily.Core.Entities;

public class BroadcastLog
{
    public Guid Id { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string Body { get; set; } = string.Empty;
    public DateTime DateSent { get; set; }
    public int RecipientCount { get; set; }
    public string TargetAudience { get; set; } = string.Empty;

    // Encapsulated child collection
    private readonly List<BroadcastRecipient> _recipients = [];
    public IReadOnlyCollection<BroadcastRecipient> Recipients => _recipients.AsReadOnly();

    public void AddRecipient(BroadcastRecipient recipient)
    {
        recipient.BroadcastLogId = Id;
        _recipients.Add(recipient);
    }
}
