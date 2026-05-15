namespace CFCS.Application.DTOs;

public record AddressDto(string Street1, string? Street2, string City, string State, string Zip);

public record IndividualDto(
    Guid Id, string FirstName, string? MiddleName, string? LastName,
    string Role, string Gender, DateTime? DateOfBirth,
    string? Email, string? Phone, string? Profession, string? Relationship);

public record HouseholdDto(
    Guid Id, string Name, AddressDto Address, string Status,
    string? Phone, string? Phone2, int MemberCount,
    List<IndividualDto> Members,
    string? CreatedBy, DateTime? CreatedAt, string? LastModifiedBy, DateTime? LastModifiedAt);

public record CreateHouseholdDto(
    string Name, AddressDto Address, string Status,
    string? Phone, string? Phone2,
    List<CreateIndividualDto> Members);

public record CreateIndividualDto(
    string FirstName, string? MiddleName, string? LastName,
    string Role, string Gender, DateTime? DateOfBirth,
    string? Email, string? Phone, string? Profession, string? Relationship);

public record UpdateHouseholdDto(
    string? Name, AddressDto? Address, string? Status,
    string? Phone, string? Phone2,
    List<IndividualDto>? Members);
