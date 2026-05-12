using ChurchFamily.Application.DTOs;
using ChurchFamily.Core.Entities;
using ChurchFamily.Core.Enums;

namespace ChurchFamily.Application.Mappings;

public static class HouseholdMappings
{
    public static HouseholdDto ToDto(this Household entity) => new(
        entity.Id, entity.Name,
        entity.Address.ToDto(),
        entity.Status.ToString(),
        entity.Phone, entity.Phone2, entity.MemberCount,
        entity.Members.Select(m => m.ToDto()).ToList(),
        entity.CreatedBy, entity.CreatedAt, entity.LastModifiedBy, entity.LastModifiedAt);

    public static AddressDto ToDto(this Address entity) => new(
        entity.Street1, entity.Street2, entity.City, entity.State, entity.Zip);

    public static IndividualDto ToDto(this Individual entity) => new(
        entity.Id, entity.FirstName, entity.MiddleName, entity.LastName,
        entity.Role.ToString(), entity.Gender.ToString(), entity.DateOfBirth,
        entity.Email, entity.Phone, entity.Profession, entity.Relationship);

    public static Address ToEntity(this AddressDto dto) => new()
    {
        Street1 = dto.Street1, Street2 = dto.Street2,
        City = dto.City, State = dto.State, Zip = dto.Zip,
    };

    public static Individual ToEntity(this CreateIndividualDto dto, Guid id) => new()
    {
        Id = id, FirstName = dto.FirstName, MiddleName = dto.MiddleName, LastName = dto.LastName,
        Role = Enum.Parse<MemberRole>(dto.Role), Gender = Enum.Parse<Gender>(dto.Gender),
        DateOfBirth = dto.DateOfBirth, Email = dto.Email, Phone = dto.Phone,
        Profession = dto.Profession, Relationship = dto.Relationship,
    };
}
