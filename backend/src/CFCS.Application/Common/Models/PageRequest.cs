namespace CFCS.Application.Common.Models;

public class PageRequest
{
    public int PageIndex { get; set; }
    public int PageSize { get; set; } = 10;
}
