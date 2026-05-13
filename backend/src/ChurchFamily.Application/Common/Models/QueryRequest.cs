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

/// <summary>
/// Full query request with sort/search/filter.
/// Used internally by handlers — not directly bound from Minimal API endpoints.
/// </summary>
public class QueryRequest : PageRequest
{
    public SortOptions? Sort { get; set; }
    public string? Search { get; set; }
    public QueryFilters? Filters { get; set; }
}

/// <summary>
/// Flat query parameters for Minimal API binding via [AsParameters].
/// All nested objects are flattened to scalar properties so Minimal API
/// can bind them from query strings.
/// </summary>
public class FlatQueryRequest
{
    public int? PageIndex { get; set; }
    public int? PageSize { get; set; }
    public string? Search { get; set; }
    public string? SortActive { get; set; }
    public string? SortDirection { get; set; }
    public string? FilterStatus { get; set; }
    public string? FilterCity { get; set; }
    public string? FilterZip { get; set; }

    /// <summary>
    /// Converts the flat binding model to the rich QueryRequest used by handlers.
    /// </summary>
    public QueryRequest ToQueryRequest() => new()
    {
        PageIndex = PageIndex ?? 0,
        PageSize = PageSize ?? 10,
        Search = Search,
        Sort = (SortActive is not null || SortDirection is not null) ? new SortOptions { Active = SortActive, Direction = SortDirection } : null,
        Filters = (FilterStatus is not null || FilterCity is not null || FilterZip is not null) ? new QueryFilters { Status = FilterStatus, City = FilterCity, Zip = FilterZip } : null,
    };
}
