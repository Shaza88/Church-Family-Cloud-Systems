using CFCS.Application.DTOs;
using CFCS.Core.Entities;

namespace CFCS.Application.Mappings;

public static class GroupMappings
{
    public static GroupDto ToDto(this Group entity) => new(
        entity.Id, entity.Name, entity.Description, entity.MeetingTime,
        entity.CreatedBy, entity.CreatedAt, entity.LastModifiedBy, entity.LastModifiedAt);
}
