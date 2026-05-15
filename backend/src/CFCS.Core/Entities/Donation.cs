using CFCS.Core.Enums;

namespace CFCS.Core.Entities;

public class Donation : AuditableEntity
{
    public Guid BatchId { get; set; }
    public Guid HouseholdId { get; set; }
    public Guid FundId { get; set; }
    public DateTime Date { get; set; }
    public decimal Amount { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string? Reference { get; set; }

    // Navigation
    public Batch Batch { get; set; } = null!;
    public Household Household { get; set; } = null!;
    public Fund Fund { get; set; } = null!;
}
