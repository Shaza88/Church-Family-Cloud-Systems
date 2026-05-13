using ChurchFamily.Application.Common.Models;
using ChurchFamily.Application.DTOs;
using ChurchFamily.Application.Features.Groups;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace ChurchFamily.Api.Endpoints;

public static class GroupEndpoints
{
    public static RouteGroupBuilder MapGroupEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/groups").WithTags("Groups");

        group.MapGet("/", async (int? pageIndex, int? pageSize, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetGroupsQuery(new PageRequest { PageIndex = pageIndex ?? 0, PageSize = pageSize ?? 10 }), ct)))
            .WithName("GetGroups")
            .WithSummary("Get paginated list of groups");

        group.MapGet("/all", async (ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetAllGroupsQuery(), ct)))
            .WithName("GetAllGroups");

        group.MapGet("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetGroupByIdQuery(id), ct)))
            .WithName("GetGroupById");

        group.MapPost("/", async ([FromBody] CreateGroupDto dto, ISender sender, CancellationToken ct) =>
        {
            var result = await sender.Send(new CreateGroupCommand(dto), ct);
            return Results.Created($"/api/groups/{result.Id}", result);
        }).WithName("CreateGroup");

        group.MapPut("/{id:guid}", async (Guid id, [FromBody] UpdateGroupDto dto, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new UpdateGroupCommand(id, dto), ct)))
            .WithName("UpdateGroup");

        group.MapDelete("/{id:guid}", async (Guid id, ISender sender, CancellationToken ct) =>
        {
            await sender.Send(new DeleteGroupCommand(id), ct);
            return Results.NoContent();
        }).WithName("DeleteGroup");

        return group;
    }
}
