using CFCS.Core.Enums;

namespace CFCS.Core.Entities;

public class Household : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public Address Address { get; set; } = new();
    public HouseholdStatus Status { get; set; }
    public string? Phone { get; set; }
    public string? Phone2 { get; set; }
    public int MemberCount { get; set; }

    // Encapsulated child collections
    private readonly List<Individual> _members = [];
    public IReadOnlyCollection<Individual> Members => _members.AsReadOnly();

    private readonly List<Stewardship> _stewardships = [];
    public IReadOnlyCollection<Stewardship> Stewardships => _stewardships.AsReadOnly();

    private readonly List<Donation> _donations = [];
    public IReadOnlyCollection<Donation> Donations => _donations.AsReadOnly();

    public void AddMember(Individual member)
    {
        member.HouseholdId = Id;
        _members.Add(member);
    }

    public void AddStewardship(Stewardship stewardship)
    {
        stewardship.HouseholdId = Id;
        _stewardships.Add(stewardship);
    }

    public void AddDonation(Donation donation)
    {
        donation.HouseholdId = Id;
        _donations.Add(donation);
    }
}
