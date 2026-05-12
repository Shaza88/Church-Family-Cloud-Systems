using ChurchFamily.Application.Common.Interfaces;
using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Mappings;
using ChurchFamily.Core.Entities;
using ChurchFamily.Core.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace ChurchFamily.Application.Features.Households.Commands;

// --- Create ---
public record CreateHouseholdCommand(CreateHouseholdDto Dto) : IRequest<HouseholdDto>;

public class CreateHouseholdCommandHandler(IApplicationDbContext context)
    : IRequestHandler<CreateHouseholdCommand, HouseholdDto>
{
    public async Task<HouseholdDto> Handle(CreateHouseholdCommand command, CancellationToken ct)
    {
        var dto = command.Dto;
        var household = new Household
        {
            Id = Guid.CreateVersion7(),
            Name = dto.Name,
            Address = dto.Address.ToEntity(),
            Status = Enum.Parse<HouseholdStatus>(dto.Status),
            Phone = dto.Phone, Phone2 = dto.Phone2,
        };

        foreach (var memberDto in dto.Members)
        {
            household.AddMember(memberDto.ToEntity(Guid.CreateVersion7()));
        }

        household.MemberCount = household.Members.Count;
        household.CreatedAt = DateTime.UtcNow;

        context.Households.Add(household);
        await context.SaveChangesAsync(ct);

        return household.ToDto();
    }
}

// --- Update ---
public record UpdateHouseholdCommand(Guid Id, UpdateHouseholdDto Dto) : IRequest<HouseholdDto>;

public class UpdateHouseholdCommandHandler(IApplicationDbContext context)
    : IRequestHandler<UpdateHouseholdCommand, HouseholdDto>
{
    public async Task<HouseholdDto> Handle(UpdateHouseholdCommand command, CancellationToken ct)
    {
        var household = await context.Households
            .Include(h => h.Members)
            .FirstOrDefaultAsync(h => h.Id == command.Id, ct)
            ?? throw new Core.Exceptions.NotFoundException(nameof(Household), command.Id);

        var dto = command.Dto;

        if (dto.Name is not null) household.Name = dto.Name;
        if (dto.Address is not null) household.Address = dto.Address.ToEntity();
        if (dto.Status is not null) household.Status = Enum.Parse<HouseholdStatus>(dto.Status);
        if (dto.Phone is not null) household.Phone = dto.Phone;
        if (dto.Phone2 is not null) household.Phone2 = dto.Phone2;

        if (dto.Members is not null)
        {
            // Replace members: remove existing, add new
            var existingMembers = await context.Individuals
                .Where(i => i.HouseholdId == household.Id).ToListAsync(ct);
            context.Individuals.RemoveRange(existingMembers);

            foreach (var memberDto in dto.Members)
            {
                var member = new Individual
                {
                    Id = memberDto.Id == Guid.Empty ? Guid.CreateVersion7() : memberDto.Id,
                    FirstName = memberDto.FirstName, MiddleName = memberDto.MiddleName,
                    LastName = memberDto.LastName,
                    Role = Enum.Parse<MemberRole>(memberDto.Role),
                    Gender = Enum.Parse<Gender>(memberDto.Gender),
                    DateOfBirth = memberDto.DateOfBirth, Email = memberDto.Email,
                    Phone = memberDto.Phone, Profession = memberDto.Profession,
                    Relationship = memberDto.Relationship,
                    HouseholdId = household.Id,
                };
                context.Individuals.Add(member);
            }

            household.MemberCount = dto.Members.Count;
        }

        household.LastModifiedAt = DateTime.UtcNow;
        await context.SaveChangesAsync(ct);

        // Reload with includes
        var updated = await context.Households.Include(h => h.Members)
            .FirstAsync(h => h.Id == household.Id, ct);
        return updated.ToDto();
    }
}
