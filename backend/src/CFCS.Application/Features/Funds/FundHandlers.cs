using CFCS.Application.Common.Interfaces;
using CFCS.Application.DTOs;
using CFCS.Application.Mappings;
using CFCS.Core.Entities;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CFCS.Application.Features.Funds;

// --- Queries ---
public record GetFundsQuery : IRequest<List<FundDto>>;

public class GetFundsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetFundsQuery, List<FundDto>>
{
    public async Task<List<FundDto>> Handle(GetFundsQuery _, CancellationToken ct)
    {
        var funds = await context.Funds.AsNoTracking().OrderBy(f => f.Name).ToListAsync(ct);
        return funds.Select(f => f.ToDto()).ToList();
    }
}

// --- Commands ---
public record CreateFundCommand(CreateFundDto Dto) : IRequest<FundDto>;

public class CreateFundCommandHandler(IApplicationDbContext context)
    : IRequestHandler<CreateFundCommand, FundDto>
{
    public async Task<FundDto> Handle(CreateFundCommand command, CancellationToken ct)
    {
        var fund = new Fund
        {
            Id = Guid.CreateVersion7(),
            Name = command.Dto.Name, Description = command.Dto.Description,
            Active = command.Dto.Active, TaxDeductible = command.Dto.TaxDeductible,
            CreatedAt = DateTime.UtcNow,
        };
        context.Funds.Add(fund);
        await context.SaveChangesAsync(ct);
        return fund.ToDto();
    }
}

public record UpdateFundCommand(Guid Id, UpdateFundDto Dto) : IRequest<FundDto>;

public class UpdateFundCommandHandler(IApplicationDbContext context)
    : IRequestHandler<UpdateFundCommand, FundDto>
{
    public async Task<FundDto> Handle(UpdateFundCommand command, CancellationToken ct)
    {
        var fund = await context.Funds.FindAsync([command.Id], ct)
            ?? throw new Core.Exceptions.NotFoundException(nameof(Fund), command.Id);

        if (command.Dto.Name is not null) fund.Name = command.Dto.Name;
        if (command.Dto.Description is not null) fund.Description = command.Dto.Description;
        if (command.Dto.Active.HasValue) fund.Active = command.Dto.Active.Value;
        if (command.Dto.TaxDeductible.HasValue) fund.TaxDeductible = command.Dto.TaxDeductible.Value;

        fund.LastModifiedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);
        return fund.ToDto();
    }
}

public record DeleteFundCommand(Guid Id) : IRequest<Unit>;

public class DeleteFundCommandHandler(IApplicationDbContext context)
    : IRequestHandler<DeleteFundCommand, Unit>
{
    public async Task<Unit> Handle(DeleteFundCommand command, CancellationToken ct)
    {
        var fund = await context.Funds.FindAsync([command.Id], ct)
            ?? throw new Core.Exceptions.NotFoundException(nameof(Fund), command.Id);

        context.Funds.Remove(fund);
        await context.SaveChangesAsync(ct);
        return Unit.Value;
    }
}

// --- Validators ---
public class CreateFundValidator : AbstractValidator<CreateFundCommand>
{
    public CreateFundValidator()
    {
        RuleFor(x => x.Dto.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.Dto.Description).MaximumLength(500);
    }
}
