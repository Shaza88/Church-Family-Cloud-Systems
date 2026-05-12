namespace ChurchFamily.Application.Common.Models;

public class PageResponse<T>
{
    public List<T> Items { get; set; } = [];
    public int Total { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling((double)Total / PageSize) : 0;
}
