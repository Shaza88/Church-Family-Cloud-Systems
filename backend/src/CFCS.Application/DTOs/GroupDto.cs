namespace CFCS.Application.DTOs;

public record GroupDto(
    Guid Id, string Name, string Description, string MeetingTime,
    string? CreatedBy, DateTime? CreatedAt, string? LastModifiedBy, DateTime? LastModifiedAt);

public record CreateGroupDto(string Name, string Description, string MeetingTime);
public record UpdateGroupDto(string? Name, string? Description, string? MeetingTime);
