using ChurchFamily.Application.Common.Models;
using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Features.Households.Commands;
using ChurchFamily.Application.Features.Households.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ChurchFamily.Api.Endpoints;

public static class HouseholdEndpoints
{
    public static RouteGroupBuilder MapHouseholdEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/households")
            .WithTags("Households")
            ;

        // GET /api/households?pageIndex=0&pageSize=10&search=...&sort.active=name&sort.direction=asc
        group.MapGet("/", async (
            [AsParameters] QueryRequest request,
            ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetHouseholdsQuery(request), ct);
            return Results.Ok(result);
        })
        .WithName("GetHouseholds")
        .WithSummary("Get paginated list of households with search, filter, and sort");

        // GET /api/households/all
        group.MapGet("/all", async (ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetAllHouseholdsQuery(), ct);
            return Results.Ok(result);
        })
        .WithName("GetAllHouseholds")
        .WithSummary("Get all households (unpaginated, for dropdowns)");

        // GET /api/households/{id}
        group.MapGet("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new GetHouseholdByIdQuery(id), ct);
            return Results.Ok(result);
        })
        .WithName("GetHouseholdById")
        .WithSummary("Get a household by ID");

        // POST /api/households
        group.MapPost("/", async ([FromBody] CreateHouseholdDto dto, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new CreateHouseholdCommand(dto), ct);
            return Results.Created($"/api/households/{result.Id}", result);
        })
        .WithName("CreateHousehold")
        .WithSummary("Create a new household");

        // PUT /api/households/{id}
        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateHouseholdDto dto, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new UpdateHouseholdCommand(id, dto), ct);
            return Results.Ok(result);
        })
        .WithName("UpdateHousehold")
        .WithSummary("Update an existing household");

        return group;
    }
}
