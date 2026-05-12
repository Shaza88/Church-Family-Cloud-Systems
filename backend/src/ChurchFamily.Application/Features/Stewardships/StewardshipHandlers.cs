using ChurchFamily.Application.Common.Interfaces;
using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Mappings;
using ChurchFamily.Core.Entities;
using ChurchFamily.Core.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchFamily.Application.Features.Stewardships;

// --- Queries ---
public record GetStewardshipsByHouseholdQuery(Guid HouseholdId) : IRequest<List<StewardshipDto>>;

public class GetStewardshipsByHouseholdQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetStewardshipsByHouseholdQuery, List<StewardshipDto>>
{
    public async Task<List<StewardshipDto>> Handle(GetStewardshipsByHouseholdQuery query, CancellationToken ct)
    {
        var stewardships = await context.Stewardships
            .AsNoTracking()
            .Where(s => s.HouseholdId == query.HouseholdId)
            .OrderByDescending(s => s.FiscalYear)
            .ToListAsync(ct);
        return stewardships.Select(s => s.ToDto()).ToList();
    }
}

// --- Commands ---
public record CreateStewardshipCommand(CreateStewardshipDto Dto) : IRequest<StewardshipDto>;

public class CreateStewardshipCommandHandler(IApplicationDbContext context)
    : IRequestHandler<CreateStewardshipCommand, StewardshipDto>
{
    public async Task<StewardshipDto> Handle(CreateStewardshipCommand command, CancellationToken ct)
    {
        var dto = command.Dto;

        // Check for duplicate fiscal year
        var exists = await context.Stewardships.AnyAsync(
            s => s.HouseholdId == dto.HouseholdId && s.FiscalYear == dto.FiscalYear, ct);
        if (exists)
            throw new Core.Exceptions.ConflictException(
                $"A stewardship for fiscal year {dto.FiscalYear} already exists for this household.");

        var stewardship = new Stewardship
        {
            Id = Guid.CreateVersion7(),
            HouseholdId = dto.HouseholdId, FiscalYear = dto.FiscalYear,
            Amount = dto.Amount,
            Frequency = Enum.Parse<StewardshipFrequency>(dto.Frequency),
            TotalYearlyAmount = dto.TotalYearlyAmount,
            Status = StewardshipStatus.Active,
            CreatedAt = DateTime.UtcNow,
        };
        context.Stewardships.Add(stewardship);
        await context.SaveChangesAsync(ct);
        return stewardship.ToDto();
    }
}

public record UpdateStewardshipCommand(Guid Id, UpdateStewardshipDto Dto) : IRequest<StewardshipDto>;

public class UpdateStewardshipCommandHandler(IApplicationDbContext context)
    : IRequestHandler<UpdateStewardshipCommand, StewardshipDto>
{
    public async Task<StewardshipDto> Handle(UpdateStewardshipCommand command, CancellationToken ct)
    {
        var s = await context.Stewardships.FindAsync([command.Id], ct)
            ?? throw new Core.Exceptions.NotFoundException(nameof(Stewardship), command.Id);

        if (command.Dto.FiscalYear is not null) s.FiscalYear = command.Dto.FiscalYear;
        if (command.Dto.Amount.HasValue) s.Amount = command.Dto.Amount.Value;
        if (command.Dto.Frequency is not null) s.Frequency = Enum.Parse<StewardshipFrequency>(command.Dto.Frequency);
        if (command.Dto.TotalYearlyAmount.HasValue) s.TotalYearlyAmount = command.Dto.TotalYearlyAmount.Value;
        if (command.Dto.Status is not null) s.Status = Enum.Parse<StewardshipStatus>(command.Dto.Status);

        s.LastModifiedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
        return s.ToDto();
    }
}

public record DeleteStewardshipCommand(Guid Id) : IRequest<Unit>;

public class DeleteStewardshipCommandHandler(IApplicationDbContext context)
    : IRequestHandler<DeleteStewardshipCommand, Unit>
{
    public async Task<Unit> Handle(DeleteStewardshipCommand command, CancellationToken ct)
    {
        var s = await context.Stewardships.FindAsync([command.Id], ct)
            ?? throw new Core.Exceptions.NotFoundException(nameof(Stewardship), command.Id);

        context.Stewardships.Remove(s);
        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }
}

// --- Validators ---
public class CreateStewardshipValidator : AbstractValidator<CreateStewardshipCommand>
{
    public CreateStewardshipValidator()
    {
        RuleFor(x => x.Dto.HouseholdId).NotEmpty();
        RuleFor(x => x.Dto.FiscalYear).NotEmpty().MaximumLength(10);
        RuleFor(x => x.Dto.Amount).GreaterThan(0);
        RuleFor(x => x.Dto.TotalYearlyAmount).GreaterThan(0);
        RuleFor(x => x.Dto.Frequency).NotEmpty();
    }
}
