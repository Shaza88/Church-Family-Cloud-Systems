namespace CFCS.Application.DTOs;

public record FundDto(
    Guid Id, string Name, string Description, bool Active, bool TaxDeductible,
    string? CreatedBy, DateTime? CreatedAt, string? LastModifiedBy, DateTime? LastModifiedAt);

public record CreateFundDto(string Name, string Description, bool Active, bool TaxDeductible);
public record UpdateFundDto(string? Name, string? Description, bool? Active, bool? TaxDeductible);
