using CFCS.Application.Common.Interfaces;
using CFCS.Application.Common.Models;
using CFCS.Application.DTOs;
using CFCS.Application.Mappings;
using CFCS.Core.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CFCS.Application.Features.Groups;

// --- Paginated list ---
public record GetGroupsQuery(PageRequest Request) : IRequest<PageResponse<GroupDto>>;

public class GetGroupsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetGroupsQuery, PageResponse<GroupDto>>
{
    public async Task<PageResponse<GroupDto>> Handle(GetGroupsQuery query, CancellationToken ct)
    {
        var req = query.Request;
        var q = context.Groups.AsNoTracking().OrderBy(g => g.Name).AsQueryable();

        var total = await q.CountAsync(ct);
        var items = await q.Skip(req.PageIndex * req.PageSize).Take(req.PageSize).ToListAsync(ct);

        return new PageResponse<GroupDto>
        {
            Items = items.Select(g => g.ToDto()).ToList(),
            Total = total, PageIndex = req.PageIndex, PageSize = req.PageSize,
        };
    }
}

// --- Get all (unpaginated) ---
public record GetAllGroupsQuery : IRequest<List<GroupDto>>;

public class GetAllGroupsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetAllGroupsQuery, List<GroupDto>>
{
    public async Task<List<GroupDto>> Handle(GetAllGroupsQuery _, CancellationToken ct)
    {
        var groups = await context.Groups.AsNoTracking().OrderBy(g => g.Name).ToListAsync(ct);
        return groups.Select(g => g.ToDto()).ToList();
    }
}

// --- Get by ID ---
public record GetGroupByIdQuery(Guid Id) : IRequest<GroupDto>;

public class GetGroupByIdQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetGroupByIdQuery, GroupDto>
{
    public async Task<GroupDto> Handle(GetGroupByIdQuery query, CancellationToken ct)
    {
        var group = await context.Groups.AsNoTracking().FirstOrDefaultAsync(g => g.Id == query.Id, ct)
            ?? throw new Core.Exceptions.NotFoundException(nameof(Group), query.Id);
        return group.ToDto();
    }
}

// --- Commands ---
public record CreateGroupCommand(CreateGroupDto Dto) : IRequest<GroupDto>;

public class CreateGroupCommandHandler(IApplicationDbContext context)
    : IRequestHandler<CreateGroupCommand, GroupDto>
{
    public async Task<GroupDto> Handle(CreateGroupCommand command, CancellationToken ct)
    {
        var group = new Group
        {
            Id = Guid.CreateVersion7(),
            Name = command.Dto.Name, Description = command.Dto.Description,
            MeetingTime = command.Dto.MeetingTime,
            CreatedAt = DateTime.UtcNow,
        };
        context.Groups.Add(group);
        await context.SaveChangesAsync(ct);
        return group.ToDto();
    }
}

public record UpdateGroupCommand(Guid Id, UpdateGroupDto Dto) : IRequest<GroupDto>;

public class UpdateGroupCommandHandler(IApplicationDbContext context)
    : IRequestHandler<UpdateGroupCommand, GroupDto>
{
    public async Task<GroupDto> Handle(UpdateGroupCommand command, CancellationToken ct)
    {
        var group = await context.Groups.FindAsync([command.Id], ct)
            ?? throw new Core.Exceptions.NotFoundException(nameof(Group), command.Id);

        if (command.Dto.Name is not null) group.Name = command.Dto.Name;
        if (command.Dto.Description is not null) group.Description = command.Dto.Description;
        if (command.Dto.MeetingTime is not null) group.MeetingTime = command.Dto.MeetingTime;

        group.LastModifiedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
        return group.ToDto();
    }
}

public record DeleteGroupCommand(Guid Id) : IRequest<Unit>;

public class DeleteGroupCommandHandler(IApplicationDbContext context)
    : IRequestHandler<DeleteGroupCommand, Unit>
{
    public async Task<Unit> Handle(DeleteGroupCommand command, CancellationToken ct)
    {
        var group = await context.Groups.FindAsync([command.Id], ct)
            ?? throw new Core.Exceptions.NotFoundException(nameof(Group), command.Id);

        context.Groups.Remove(group);
        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }
}

// --- Validators ---
public class CreateGroupValidator : AbstractValidator<CreateGroupCommand>
{
    public CreateGroupValidator()
    {
        RuleFor(x => x.Dto.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Dto.Description).MaximumLength(500);
        RuleFor(x => x.Dto.MeetingTime).MaximumLength(200);
    }
}
