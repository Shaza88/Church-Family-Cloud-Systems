namespace CFCS.Application.DTOs;

public record StewardshipDto(
    Guid Id, Guid HouseholdId, string FiscalYear, decimal Amount,
    string Frequency, decimal TotalYearlyAmount, string Status,
    string? CreatedBy, DateTime? CreatedAt, string? LastModifiedBy, DateTime? LastModifiedAt);

public record CreateStewardshipDto(Guid HouseholdId, string FiscalYear, decimal Amount, string Frequency, decimal TotalYearlyAmount);
public record UpdateStewardshipDto(string? FiscalYear, decimal? Amount, string? Frequency, decimal? TotalYearlyAmount, string? Status);
