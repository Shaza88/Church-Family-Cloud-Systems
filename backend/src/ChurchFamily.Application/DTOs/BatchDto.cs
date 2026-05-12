namespace ChurchFamily.Application.DTOs;

public record BatchDto(
    Guid Id, DateTime Date, decimal ExpectedTotal, decimal ActualTotal,
    int DonationCount, string Status,
    string? CreatedBy, DateTime? CreatedAt, string? LastModifiedBy, DateTime? LastModifiedAt);

public record CreateBatchDto(DateTime Date, decimal ExpectedTotal, string Status);
public record UpdateBatchDto(DateTime? Date, decimal? ExpectedTotal, decimal? ActualTotal, int? DonationCount, string? Status);
