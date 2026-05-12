using ChurchFamily.Application.Common.Interfaces;
using ChurchFamily.Application.Common.Models;
using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Mappings;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchFamily.Application.Features.Households.Queries;

// --- Paginated list ---
public record GetHouseholdsQuery(QueryRequest Request) : IRequest<PageResponse<HouseholdDto>>;

public class GetHouseholdsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetHouseholdsQuery, PageResponse<HouseholdDto>>
{
    public async Task<PageResponse<HouseholdDto>> Handle(GetHouseholdsQuery query, CancellationToken ct)
    {
        var req = query.Request;
        var q = context.Households.AsNoTracking().Include(h => h.Members).AsQueryable();

        // Search
        if (!string.IsNullOrWhiteSpace(req.Search))
        {
            var term = req.Search.ToLower();
            q = q.Where(h =>
                h.Name.ToLower().Contains(term) ||
                h.Members.Any(m => m.FirstName.ToLower().Contains(term) || (m.LastName != null && m.LastName.ToLower().Contains(term))));
        }

        // Filters
        if (req.Filters is not null)
        {
            if (!string.IsNullOrWhiteSpace(req.Filters.Status))
                q = q.Where(h => h.Status.ToString() == req.Filters.Status);
            if (!string.IsNullOrWhiteSpace(req.Filters.City))
                q = q.Where(h => h.Address.City.ToLower().Contains(req.Filters.City.ToLower()));
            if (!string.IsNullOrWhiteSpace(req.Filters.Zip))
                q = q.Where(h => h.Address.Zip.Contains(req.Filters.Zip));
        }

        // Sort
        q = req.Sort?.Active switch
        {
            "name" => req.Sort.Direction == "desc" ? q.OrderByDescending(h => h.Name) : q.OrderBy(h => h.Name),
            "status" => req.Sort.Direction == "desc" ? q.OrderByDescending(h => h.Status) : q.OrderBy(h => h.Status),
            "memberCount" => req.Sort.Direction == "desc" ? q.OrderByDescending(h => h.MemberCount) : q.OrderBy(h => h.MemberCount),
            _ => q.OrderBy(h => h.Name),
        };

        var total = await q.CountAsync(ct);
        var items = await q.Skip(req.PageIndex * req.PageSize).Take(req.PageSize).ToListAsync(ct);

        return new PageResponse<HouseholdDto>
        {
            Items = items.Select(h => h.ToDto()).ToList(),
            Total = total, PageIndex = req.PageIndex, PageSize = req.PageSize,
        };
    }
}

// --- Get all (unpaginated — for dropdowns) ---
public record GetAllHouseholdsQuery : IRequest<List<HouseholdDto>>;

public class GetAllHouseholdsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetAllHouseholdsQuery, List<HouseholdDto>>
{
    public async Task<List<HouseholdDto>> Handle(GetAllHouseholdsQuery _, CancellationToken ct)
    {
        var households = await context.Households
            .AsNoTracking()
            .Include(h => h.Members)
            .OrderBy(h => h.Name)
            .ToListAsync(ct);

        return households.Select(h => h.ToDto()).ToList();
    }
}

// --- Get by ID ---
public record GetHouseholdByIdQuery(Guid Id) : IRequest<HouseholdDto>;

public class GetHouseholdByIdQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetHouseholdByIdQuery, HouseholdDto>
{
    public async Task<HouseholdDto> Handle(GetHouseholdByIdQuery query, CancellationToken ct)
    {
        var household = await context.Households
            .AsNoTracking()
            .Include(h => h.Members)
            .FirstOrDefaultAsync(h => h.Id == query.Id, ct)
            ?? throw new Core.Exceptions.NotFoundException(nameof(Core.Entities.Household), query.Id);

        return household.ToDto();
    }
}
