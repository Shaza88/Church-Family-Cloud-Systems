using CFCS.Application.DTOs;
using CFCS.Application.Features.Batches;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CFCS.Api.Endpoints;

public static class BatchEndpoints
{
    public static RouteGroupBuilder MapBatchEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/batches").WithTags("Batches");

        group.MapGet("/", async (ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetBatchesQuery(), ct)))
            .WithName("GetBatches");

        group.MapGet("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetBatchByIdQuery(id), ct)))
            .WithName("GetBatchById");

        group.MapPost("/", async ([FromBody] CreateBatchDto dto, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new CreateBatchCommand(dto), ct);
            return Results.Created($"/api/batches/{result.Id}", result);
        }).WithName("CreateBatch");

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateBatchDto dto, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new UpdateBatchCommand(id, dto), ct)))
            .WithName("UpdateBatch");

        group.MapDelete("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            await sender.Send(new DeleteBatchCommand(id), ct);
            return Results.NoContent();
        }).WithName("DeleteBatch");

        return group;
    }
}
