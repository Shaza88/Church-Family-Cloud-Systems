using CFCS.Application.DTOs;
using CFCS.Application.Features.Donations;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace CFCS.Api.Endpoints;

public static class DonationEndpoints
{
    public static RouteGroupBuilder MapDonationEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/donations").WithTags("Donations");

        group.MapGet("/", async (ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetAllDonationsQuery(), ct)))
            .WithName("GetAllDonations");

        group.MapGet("/household/{householdId:guid}", async (Guid householdId, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetDonationsByHouseholdQuery(householdId), ct)))
            .WithName("GetDonationsByHousehold");

        group.MapGet("/batch/{batchId:guid}", async (Guid batchId, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetDonationsByBatchQuery(batchId), ct)))
            .WithName("GetDonationsByBatch");

        group.MapPost("/", async ([FromBody] CreateDonationDto dto, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new CreateDonationCommand(dto), ct);
            return Results.Created($"/api/donations/{result.Id}", result);
        }).WithName("CreateDonation");

        group.MapPost("/batch-entry", async ([FromBody] List<CreateDonationDto> donations, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new CreateDonationsBatchCommand(donations), ct);
            return Results.Ok(result);
        }).WithName("CreateDonationsBatch")
          .WithSummary("Create multiple donations in a single batch entry");

        return group;
    }
}
