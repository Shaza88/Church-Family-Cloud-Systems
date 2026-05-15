namespace CFCS.Core.Entities;

public class Fund : AuditableEntity
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool Active { get; set; }
    public bool TaxDeductible { get; set; }

    // Encapsulated child collection
    private readonly List<Donation> _donations = [];
    public IReadOnlyCollection<Donation> Donations => _donations.AsReadOnly();

    public void AddDonation(Donation donation)
    {
        donation.FundId = Id;
        _donations.Add(donation);
    }
}
