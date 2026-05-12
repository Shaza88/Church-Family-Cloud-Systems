namespace ChurchFamily.Application.Common.Models;

public class SortOptions
{
    public string? Active { get; set; }
    public string? Direction { get; set; } // "asc" | "desc"
}

public class QueryFilters
{
    public string? Status { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Profession { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? City { get; set; }
    public string? Zip { get; set; }
}

public class QueryRequest : PageRequest
{
    public SortOptions? Sort { get; set; }
    public string? Search { get; set; }
    public QueryFilters? Filters { get; set; }
}
