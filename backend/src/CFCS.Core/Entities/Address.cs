namespace CFCS.Core.Entities;

/// <summary>
/// Value object representing a physical address. Configured as an EF Core owned type.
/// </summary>
public class Address
{
    public string Street1 { get; set; } = string.Empty;
    public string? Street2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Zip { get; set; } = string.Empty;
}
