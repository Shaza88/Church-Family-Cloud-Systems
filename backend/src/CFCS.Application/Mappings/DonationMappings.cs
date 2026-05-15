using CFCS.Application.DTOs;
using CFCS.Core.Entities;

namespace CFCS.Application.Mappings;

public static class DonationMappings
{
    public static DonationDto ToDto(this Donation entity) => new(
        entity.Id, entity.BatchId, entity.HouseholdId, entity.FundId,
        entity.Date, entity.Amount, entity.PaymentMethod.ToString(), entity.Reference,
        entity.CreatedBy, entity.CreatedAt, entity.LastModifiedBy, entity.LastModifiedAt);
}
