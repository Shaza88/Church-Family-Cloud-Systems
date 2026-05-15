using CFCS.Core.Entities;

namespace CFCS.Application.Common.Interfaces;

public interface ITokenService
{
    string GenerateToken(ApplicationUser user, IList<string> roles, IList<string> permissions);
}
