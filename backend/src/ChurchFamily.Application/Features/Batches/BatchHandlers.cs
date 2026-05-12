using ChurchFamily.Application.Common.Interfaces;
using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Mappings;
using ChurchFamily.Core.Entities;
using ChurchFamily.Core.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchFamily.Application.Features.Batches;

// --- Queries ---
public record GetBatchesQuery : IRequest<List<BatchDto>>;

public class GetBatchesQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetBatchesQuery, List<BatchDto>>
{
    public async Task<List<BatchDto>> Handle(GetBatchesQuery _, CancellationToken ct)
    {
        var batches = await context.Batches.AsNoTracking().OrderByDescending(b => b.Date).ToListAsync(ct);
        return batches.Select(b => b.ToDto()).ToList();
    }
}

public record GetBatchByIdQuery(Guid Id) : IRequest<BatchDto>;

public class GetBatchByIdQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetBatchByIdQuery, BatchDto>
{
    public async Task<BatchDto> Handle(GetBatchByIdQuery query, CancellationToken ct)
    {
        var batch = await context.Batches.AsNoTracking().FirstOrDefaultAsync(b => b.Id == query.Id, ct)
            ?? throw new Core.Exceptions.NotFoundException(nameof(Batch), query.Id);
        return batch.ToDto();
    }
}

// --- Commands ---
public record CreateBatchCommand(CreateBatchDto Dto) : IRequest<BatchDto>;

public class CreateBatchCommandHandler(IApplicationDbContext context)
    : IRequestHandler<CreateBatchCommand, BatchDto>
{
    public async Task<BatchDto> Handle(CreateBatchCommand command, CancellationToken ct)
    {
        var batch = new Batch
        {
            Id = Guid.CreateVersion7(),
            Date = command.Dto.Date,
            ExpectedTotal = command.Dto.ExpectedTotal,
            ActualTotal = 0m, DonationCount = 0,
            Status = Enum.Parse<BatchStatus>(command.Dto.Status),
            CreatedAt = DateTime.UtcNow,
        };
        context.Batches.Add(batch);
        await context.SaveChangesAsync(ct);
        return batch.ToDto();
    }
}

public record UpdateBatchCommand(Guid Id, UpdateBatchDto Dto) : IRequest<BatchDto>;

public class UpdateBatchCommandHandler(IApplicationDbContext context)
    : IRequestHandler<UpdateBatchCommand, BatchDto>
{
    public async Task<BatchDto> Handle(UpdateBatchCommand command, CancellationToken ct)
    {
        var batch = await context.Batches.FindAsync([command.Id], ct)
            ?? throw new Core.Exceptions.NotFoundException(nameof(Batch), command.Id);

        if (command.Dto.Date.HasValue) batch.Date = command.Dto.Date.Value;
        if (command.Dto.ExpectedTotal.HasValue) batch.ExpectedTotal = command.Dto.ExpectedTotal.Value;
        if (command.Dto.ActualTotal.HasValue) batch.ActualTotal = command.Dto.ActualTotal.Value;
        if (command.Dto.DonationCount.HasValue) batch.DonationCount = command.Dto.DonationCount.Value;
        if (command.Dto.Status is not null) batch.Status = Enum.Parse<BatchStatus>(command.Dto.Status);

        batch.LastModifiedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
        return batch.ToDto();
    }
}

public record DeleteBatchCommand(Guid Id) : IRequest<Unit>;

public class DeleteBatchCommandHandler(IApplicationDbContext context)
    : IRequestHandler<DeleteBatchCommand, Unit>
{
    public async Task<Unit> Handle(DeleteBatchCommand command, CancellationToken ct)
    {
        var batch = await context.Batches.FindAsync([command.Id], ct)
            ?? throw new Core.Exceptions.NotFoundException(nameof(Batch), command.Id);

        context.Batches.Remove(batch);
        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }
}

// --- Validators ---
public class CreateBatchValidator : AbstractValidator<CreateBatchCommand>
{
    public CreateBatchValidator()
    {
        RuleFor(x => x.Dto.Date).NotEmpty();
        RuleFor(x => x.Dto.ExpectedTotal).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Dto.Status).NotEmpty().Must(s => s is "Open" or "Posted")
            .WithMessage("Status must be Open or Posted.");
    }
}
