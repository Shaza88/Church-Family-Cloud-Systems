using ChurchFamily.Application.DTOs;
using ChurchFamily.Core.Entities;

namespace ChurchFamily.Application.Mappings;

public static class FundMappings
{
    public static FundDto ToDto(this Fund entity) => new(
        entity.Id, entity.Name, entity.Description, entity.Active, entity.TaxDeductible,
        entity.CreatedBy, entity.CreatedAt, entity.LastModifiedBy, entity.LastModifiedAt);
}
