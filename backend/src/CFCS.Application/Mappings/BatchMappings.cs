using CFCS.Application.DTOs;
using CFCS.Core.Entities;

namespace CFCS.Application.Mappings;

public static class BatchMappings
{
    public static BatchDto ToDto(this Batch entity) => new(
        entity.Id, entity.Date, entity.ExpectedTotal, entity.ActualTotal,
        entity.DonationCount, entity.Status.ToString(),
        entity.CreatedBy, entity.CreatedAt, entity.LastModifiedBy, entity.LastModifiedAt);
}
