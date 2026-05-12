using ChurchFamily.Application.DTOs;
using ChurchFamily.Core.Entities;

namespace ChurchFamily.Application.Mappings;

public static class BroadcastMappings
{
    public static BroadcastLogDto ToDto(this BroadcastLog entity) => new(
        entity.Id, entity.Subject, entity.Body, entity.DateSent,
        entity.RecipientCount, entity.TargetAudience);

    public static BroadcastRecipientDto ToDto(this BroadcastRecipient entity) => new(
        entity.Name, entity.Household, entity.Email);
}
