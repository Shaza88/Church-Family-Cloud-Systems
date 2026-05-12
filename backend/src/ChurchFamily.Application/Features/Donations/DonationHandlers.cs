using ChurchFamily.Application.Common.Interfaces;
using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Mappings;
using ChurchFamily.Core.Entities;
using ChurchFamily.Core.Enums;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchFamily.Application.Features.Donations;

// --- Queries ---
public record GetAllDonationsQuery : IRequest<List<DonationDto>>;

public class GetAllDonationsQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetAllDonationsQuery, List<DonationDto>>
{
    public async Task<List<DonationDto>> Handle(GetAllDonationsQuery _, CancellationToken ct)
    {
        var donations = await context.Donations.AsNoTracking().OrderByDescending(d => d.Date).ToListAsync(ct);
        return donations.Select(d => d.ToDto()).ToList();
    }
}

public record GetDonationsByHouseholdQuery(Guid HouseholdId) : IRequest<List<DonationDto>>;

public class GetDonationsByHouseholdQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetDonationsByHouseholdQuery, List<DonationDto>>
{
    public async Task<List<DonationDto>> Handle(GetDonationsByHouseholdQuery query, CancellationToken ct)
    {
        var donations = await context.Donations
            .AsNoTracking()
            .Where(d => d.HouseholdId == query.HouseholdId)
            .OrderByDescending(d => d.Date)
            .ToListAsync(ct);
        return donations.Select(d => d.ToDto()).ToList();
    }
}

public record GetDonationsByBatchQuery(Guid BatchId) : IRequest<List<DonationDto>>;

public class GetDonationsByBatchQueryHandler(IApplicationDbContext context)
    : IRequestHandler<GetDonationsByBatchQuery, List<DonationDto>>
{
    public async Task<List<DonationDto>> Handle(GetDonationsByBatchQuery query, CancellationToken ct)
    {
        var donations = await context.Donations
            .AsNoTracking()
            .Where(d => d.BatchId == query.BatchId)
            .OrderByDescending(d => d.Date)
            .ToListAsync(ct);
        return donations.Select(d => d.ToDto()).ToList();
    }
}

// --- Commands ---
public record CreateDonationCommand(CreateDonationDto Dto) : IRequest<DonationDto>;

public class CreateDonationCommandHandler(IApplicationDbContext context)
    : IRequestHandler<CreateDonationCommand, DonationDto>
{
    public async Task<DonationDto> Handle(CreateDonationCommand command, CancellationToken ct)
    {
        var dto = command.Dto;
        var donation = new Donation
        {
            Id = Guid.CreateVersion7(),
            BatchId = dto.BatchId, HouseholdId = dto.HouseholdId, FundId = dto.FundId,
            Date = dto.Date, Amount = dto.Amount,
            PaymentMethod = Enum.Parse<PaymentMethod>(dto.PaymentMethod),
            Reference = dto.Reference,
            CreatedAt = DateTime.UtcNow,
        };
        context.Donations.Add(donation);
        await context.SaveChangesAsync(ct);
        return donation.ToDto();
    }
}

/// <summary>
/// Creates multiple donations in a single transaction (batch entry).
/// </summary>
public record CreateDonationsBatchCommand(List<CreateDonationDto> Donations) : IRequest<List<DonationDto>>;

public class CreateDonationsBatchCommandHandler(IApplicationDbContext context)
    : IRequestHandler<CreateDonationsBatchCommand, List<DonationDto>>
{
    public async Task<List<DonationDto>> Handle(CreateDonationsBatchCommand command, CancellationToken ct)
    {
        var entities = new List<Donation>();

        foreach (var dto in command.Donations)
        {
            var donation = new Donation
            {
                Id = Guid.CreateVersion7(),
                BatchId = dto.BatchId, HouseholdId = dto.HouseholdId, FundId = dto.FundId,
                Date = dto.Date, Amount = dto.Amount,
                PaymentMethod = Enum.Parse<PaymentMethod>(dto.PaymentMethod),
                Reference = dto.Reference,
                CreatedAt = DateTime.UtcNow,
            };
            context.Donations.Add(donation);
            entities.Add(donation);
        }

        await context.SaveChangesAsync(ct);
        return entities.Select(d => d.ToDto()).ToList();
    }
}

// --- Validators ---
public class CreateDonationValidator : AbstractValidator<CreateDonationCommand>
{
    public CreateDonationValidator()
    {
        RuleFor(x => x.Dto.BatchId).NotEmpty();
        RuleFor(x => x.Dto.HouseholdId).NotEmpty();
        RuleFor(x => x.Dto.FundId).NotEmpty();
        RuleFor(x => x.Dto.Amount).GreaterThan(0);
        RuleFor(x => x.Dto.PaymentMethod).NotEmpty().Must(s => s is "Cash" or "Check" or "Online")
            .WithMessage("PaymentMethod must be Cash, Check, or Online.");
    }
}
