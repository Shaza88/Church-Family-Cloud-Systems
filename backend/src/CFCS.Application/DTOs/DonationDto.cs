namespace CFCS.Application.DTOs;

public record DonationDto(
    Guid Id, Guid BatchId, Guid HouseholdId, Guid FundId,
    DateTime Date, decimal Amount, string PaymentMethod, string? Reference,
    string? CreatedBy, DateTime? CreatedAt, string? LastModifiedBy, DateTime? LastModifiedAt);

public record CreateDonationDto(
    Guid BatchId, Guid HouseholdId, Guid FundId,
    DateTime Date, decimal Amount, string PaymentMethod, string? Reference);
