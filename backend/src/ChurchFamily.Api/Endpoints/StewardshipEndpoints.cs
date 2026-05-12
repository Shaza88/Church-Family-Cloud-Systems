using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Features.Stewardships;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ChurchFamily.Api.Endpoints;

public static class StewardshipEndpoints
{
    public static RouteGroupBuilder MapStewardshipEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/stewardships").WithTags("Stewardships");

        group.MapGet("/household/{householdId:guid}", async (Guid householdId, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetStewardshipsByHouseholdQuery(householdId), ct)))
            .WithName("GetStewardshipsByHousehold");

        group.MapPost("/", async ([FromBody] CreateStewardshipDto dto, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new CreateStewardshipCommand(dto), ct);
            return Results.Created($"/api/stewardships/{result.Id}", result);
        }).WithName("CreateStewardship");

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateStewardshipDto dto, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new UpdateStewardshipCommand(id, dto), ct)))
            .WithName("UpdateStewardship");

        group.MapDelete("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            await sender.Send(new DeleteStewardshipCommand(id), ct);
            return Results.NoContent();
        }).WithName("DeleteStewardship");

        return group;
    }
}
