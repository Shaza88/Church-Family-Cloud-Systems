using ChurchFamily.Core.Enums;

namespace ChurchFamily.Core.Entities;

public class Stewardship : AuditableEntity
{
    public Guid HouseholdId { get; set; }
    public string FiscalYear { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public StewardshipFrequency Frequency { get; set; }
    public decimal TotalYearlyAmount { get; set; }
    public StewardshipStatus Status { get; set; }

    // Navigation
    public Household Household { get; set; } = null!;
}
