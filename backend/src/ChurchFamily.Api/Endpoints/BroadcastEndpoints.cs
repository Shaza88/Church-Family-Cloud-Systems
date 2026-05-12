using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Features.Broadcasts;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ChurchFamily.Api.Endpoints;

public static class BroadcastEndpoints
{
    public static RouteGroupBuilder MapBroadcastEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/broadcasts").WithTags("Broadcasts");

        group.MapGet("/", async (ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetBroadcastLogsQuery(), ct)))
            .WithName("GetBroadcastLogs");

        group.MapGet("/{id:guid}/recipients", async (Guid id, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetBroadcastRecipientsQuery(id), ct)))
            .WithName("GetBroadcastRecipients");

        group.MapPost("/", async ([FromBody] CreateBroadcastDto dto, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new CreateBroadcastCommand(dto), ct);
            return Results.Created($"/api/broadcasts/{result.Id}", result);
        }).WithName("CreateBroadcast");

        return group;
    }
}
