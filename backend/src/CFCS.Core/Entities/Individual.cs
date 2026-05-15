using CFCS.Core.Enums;

namespace CFCS.Core.Entities;

public class Individual
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string? MiddleName { get; set; }
    public string? LastName { get; set; }
    public MemberRole Role { get; set; }
    public Gender Gender { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Profession { get; set; }
    public string? Relationship { get; set; }

    // Foreign key
    public Guid HouseholdId { get; set; }
    public Household Household { get; set; } = null!;
}
