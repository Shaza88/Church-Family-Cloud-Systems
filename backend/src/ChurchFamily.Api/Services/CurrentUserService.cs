using System.Security.Claims;
using ChurchFamily.Application.Common.Interfaces;

namespace ChurchFamily.Api.Services;

public class CurrentUserService : ICurrentUserService
{
    public CurrentUserService(IHttpContextAccessor httpContextAccessor)
    {
        UserId = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
        Email = httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);
    }

    public string? UserId { get; }
    public string? Email { get; }
}
