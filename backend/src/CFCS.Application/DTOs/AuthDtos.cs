namespace CFCS.Application.DTOs;

public record PermissionDto(Guid Id, string Name, string Group, string Description);

public record RoleDto(string Id, string Name, string? Description, List<string> PermissionIds,
    string? CreatedBy, DateTime? CreatedAt, string? LastModifiedBy, DateTime? LastModifiedAt);

public record UserDto(
    string Id, string Email, string FirstName, string LastName,
    string? Phone, string? AvatarUrl, List<string> Roles,
    string? CreatedBy, DateTime? CreatedAt, string? LastModifiedBy, DateTime? LastModifiedAt);

public record LoginRequestDto(string Email, string Password);
public record AuthResponseDto(UserDto User, string Token, List<string> Permissions);
