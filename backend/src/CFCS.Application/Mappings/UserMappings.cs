using CFCS.Application.DTOs;
using CFCS.Core.Entities;

namespace CFCS.Application.Mappings;

public static class UserMappings
{
    public static UserDto ToDto(this ApplicationUser entity, List<string> roleNames) => new(
        entity.Id, entity.Email!, entity.FirstName, entity.LastName,
        entity.PhoneNumber, entity.AvatarUrl, roleNames,
        entity.CreatedBy, entity.CreatedAt, entity.LastModifiedBy, entity.LastModifiedAt);

    public static PermissionDto ToDto(this Permission entity) => new(
        entity.Id, entity.Name, entity.Group, entity.Description);
}
