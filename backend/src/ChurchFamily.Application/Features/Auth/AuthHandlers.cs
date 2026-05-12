using ChurchFamily.Application.Common.Interfaces;
using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Mappings;
using ChurchFamily.Core.Entities;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ChurchFamily.Application.Features.Auth;

// --- Login ---
public record LoginCommand(LoginRequestDto Dto) : IRequest<AuthResponseDto>;

public class LoginCommandHandler(
    UserManager<ApplicationUser> userManager,
    ITokenService tokenService,
    IApplicationDbContext context)
    : IRequestHandler<LoginCommand, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(LoginCommand command, CancellationToken ct)
    {
        var user = await userManager.FindByEmailAsync(command.Dto.Email)
            ?? throw new Core.Exceptions.NotFoundException("User", command.Dto.Email);

        var validPassword = await userManager.CheckPasswordAsync(user, command.Dto.Password);
        if (!validPassword)
            throw new Core.Exceptions.ValidationException(
                new Dictionary<string, string[]> { { "Password", ["Invalid credentials."] } });

        var roles = await userManager.GetRolesAsync(user);

        // Resolve permissions from roles
        var roleIds = await context.Roles
            .Where(r => roles.Contains(r.Name!))
            .Select(r => r.Id)
            .ToListAsync(ct);

        var permissions = await context.RolePermissions
            .Where(rp => roleIds.Contains(rp.RoleId.ToString()))
            .Select(rp => rp.Permission.Name)
            .Distinct()
            .ToListAsync(ct);

        var token = tokenService.GenerateToken(user, roles, permissions);
        var userDto = user.ToDto(roles.ToList());

        return new AuthResponseDto(userDto, token, permissions);
    }
}

// --- Get Current User ---
public record GetCurrentUserQuery(string UserId) : IRequest<AuthResponseDto>;

public class GetCurrentUserQueryHandler(
    UserManager<ApplicationUser> userManager,
    ITokenService tokenService,
    IApplicationDbContext context)
    : IRequestHandler<GetCurrentUserQuery, AuthResponseDto>
{
    public async Task<AuthResponseDto> Handle(GetCurrentUserQuery query, CancellationToken ct)
    {
        var user = await userManager.FindByIdAsync(query.UserId)
            ?? throw new Core.Exceptions.NotFoundException("User", query.UserId);

        var roles = await userManager.GetRolesAsync(user);

        var roleIds = await context.Roles
            .Where(r => roles.Contains(r.Name!))
            .Select(r => r.Id)
            .ToListAsync(ct);

        var permissions = await context.RolePermissions
            .Where(rp => roleIds.Contains(rp.RoleId.ToString()))
            .Select(rp => rp.Permission.Name)
            .Distinct()
            .ToListAsync(ct);

        var token = tokenService.GenerateToken(user, roles, permissions);
        var userDto = user.ToDto(roles.ToList());

        return new AuthResponseDto(userDto, token, permissions);
    }
}

// --- Validators ---
public class LoginValidator : AbstractValidator<LoginCommand>
{
    public LoginValidator()
    {
        RuleFor(x => x.Dto.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Dto.Password).NotEmpty();
    }
}
