using ChurchFamily.Application.Common.Interfaces;
using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Mappings;
using ChurchFamily.Core.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchFamily.Application.Features.Broadcasts;

// --- Queries ---
public record GetBroadcastLogsQuery : IRequest<List<BroadcastLogDto>>;

public class GetBroadcastLogsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetBroadcastLogsQuery, List<BroadcastLogDto>>
{
    public async Task<List<BroadcastLogDto>> Handle(GetBroadcastLogsQuery _, CancellationToken ct)
    {
        var logs = await context.BroadcastLogs.AsNoTracking().OrderByDescending(b => b.DateSent).ToListAsync(ct);
        return logs.Select(b => b.ToDto()).ToList();
    }
}

public record GetBroadcastRecipientsQuery(Guid BroadcastLogId) : IRequest<List<BroadcastRecipientDto>>;

public class GetBroadcastRecipientsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetBroadcastRecipientsQuery, List<BroadcastRecipientDto>>
{
    public async Task<List<BroadcastRecipientDto>> Handle(GetBroadcastRecipientsQuery query, CancellationToken ct)
    {
        var recipients = await context.BroadcastRecipients
            .AsNoTracking()
            .Where(r => r.BroadcastLogId == query.BroadcastLogId)
            .ToListAsync(ct);
        return recipients.Select(r => r.ToDto()).ToList();
    }
}

// --- Commands ---
public record CreateBroadcastCommand(CreateBroadcastDto Dto) : IRequest<BroadcastLogDto>;

public class CreateBroadcastCommandHandler(IApplicationDbContext context)
    : IRequestHandler<CreateBroadcastCommand, BroadcastLogDto>
{
    public async Task<BroadcastLogDto> Handle(CreateBroadcastCommand command, CancellationToken ct)
    {
        var dto = command.Dto;
        var log = new BroadcastLog
        {
            Id = Guid.CreateVersion7(),
            Subject = dto.Subject, Body = dto.Body,
            DateSent = DateTime.UtcNow,
            TargetAudience = dto.TargetAudience,
            RecipientCount = dto.Recipients.Count,
        };

        foreach (var r in dto.Recipients)
        {
            log.AddRecipient(new BroadcastRecipient
            {
                Id = Guid.CreateVersion7(),
                Name = r.Name, Household = r.Household, Email = r.Email,
            });
        }

        context.BroadcastLogs.Add(log);
        await context.SaveChangesAsync(ct);
        return log.ToDto();
    }
}

// --- Validators ---
public class CreateBroadcastValidator : AbstractValidator<CreateBroadcastCommand>
{
    public CreateBroadcastValidator()
    {
        RuleFor(x => x.Dto.Subject).NotEmpty().MaximumLength(300);
        RuleFor(x => x.Dto.Body).NotEmpty().MaximumLength(4000);
        RuleFor(x => x.Dto.TargetAudience).NotEmpty().MaximumLength(500);
        RuleFor(x => x.Dto.Recipients).NotEmpty();
    }
}
