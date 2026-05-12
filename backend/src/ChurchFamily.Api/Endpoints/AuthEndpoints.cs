using System.Security.Claims;
using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Features.Auth;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ChurchFamily.Api.Endpoints;

public static class AuthEndpoints
{
    public static RouteGroupBuilder MapAuthEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/auth").WithTags("Authentication");

        group.MapPost("/login", async ([FromBody] LoginRequestDto dto, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new LoginCommand(dto), ct);
            return Results.Ok(result);
        }).WithName("Login")
          .AllowAnonymous();

        group.MapGet("/me", async (HttpContext httpContext, ISender sender, CancellationToken ct) =>
        {
            var userId = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new UnauthorizedAccessException("User not authenticated.");
            var result = await sender.Send(new GetCurrentUserQuery(userId), ct);
            return Results.Ok(result);
        }).WithName("GetCurrentUser")
          .RequireAuthorization();

        return group;
    }
}
