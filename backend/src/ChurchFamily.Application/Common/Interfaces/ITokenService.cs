using ChurchFamily.Core.Entities;

namespace ChurchFamily.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateToken(ApplicationUser user, IList<string> roles, IList<string> permissions);
}
