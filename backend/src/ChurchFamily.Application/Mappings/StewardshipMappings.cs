using ChurchFamily.Application.DTOs;
using ChurchFamily.Core.Entities;

namespace ChurchFamily.Application.Mappings;

public static class StewardshipMappings
{
    public static StewardshipDto ToDto(this Stewardship entity) => new(
        entity.Id, entity.HouseholdId, entity.FiscalYear, entity.Amount,
        entity.Frequency.ToString(), entity.TotalYearlyAmount, entity.Status.ToString(),
        entity.CreatedBy, entity.CreatedAt, entity.LastModifiedBy, entity.LastModifiedAt);
}
