using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Features.Funds;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ChurchFamily.Api.Endpoints;

public static class FundEndpoints
{
    public static RouteGroupBuilder MapFundEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/funds").WithTags("Funds");

        group.MapGet("/", async (ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetFundsQuery(), ct)))
            .WithName("GetFunds");

        group.MapPost("/", async ([FromBody] CreateFundDto dto, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new CreateFundCommand(dto), ct);
            return Results.Created($"/api/funds/{result.Id}", result);
        }).WithName("CreateFund");

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateFundDto dto, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new UpdateFundCommand(id, dto), ct)))
            .WithName("UpdateFund");

        group.MapDelete("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            await sender.Send(new DeleteFundCommand(id), ct);
            return Results.NoContent();
        }).WithName("DeleteFund");

        return group;
    }
}
