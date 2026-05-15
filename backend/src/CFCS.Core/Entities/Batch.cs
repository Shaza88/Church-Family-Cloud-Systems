using CFCS.Core.Enums;

namespace CFCS.Core.Entities;

public class Batch : AuditableEntity
{
    public DateTime Date { get; set; }
    public decimal ExpectedTotal { get; set; }
    public decimal ActualTotal { get; set; }
    public int DonationCount { get; set; }
    public BatchStatus Status { get; set; }

    // Encapsulated child collection
    private readonly List<Donation> _donations = [];
    public IReadOnlyCollection<Donation> Donations => _donations.AsReadOnly();

    public void AddDonation(Donation donation)
    {
        donation.BatchId = Id;
        _donations.Add(donation);
    }
}
