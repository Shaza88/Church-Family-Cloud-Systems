namespace ChurchFamily.Application.DTOs;

public record BroadcastRecipientDto(string Name, string Household, string? Email);

public record BroadcastLogDto(
    Guid Id, string Subject, string Body, DateTime DateSent,
    int RecipientCount, string TargetAudience);

public record CreateBroadcastDto(string Subject, string Body, string TargetAudience, List<BroadcastRecipientDto> Recipients);
