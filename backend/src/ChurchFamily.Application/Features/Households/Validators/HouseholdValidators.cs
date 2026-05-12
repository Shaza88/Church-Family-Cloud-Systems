using ChurchFamily.Application.DTOs;
using FluentValidation;

namespace ChurchFamily.Application.Features.Households.Validators;

public class CreateHouseholdValidator : AbstractValidator<Features.Households.Commands.CreateHouseholdCommand>
{
    public CreateHouseholdValidator()
    {
        RuleFor(x => x.Dto.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Dto.Status).NotEmpty().Must(s =>
            s is "Active" or "Inactive" or "Visitor")
            .WithMessage("Status must be Active, Inactive, or Visitor.");
        RuleFor(x => x.Dto.Address).NotNull();
        RuleFor(x => x.Dto.Address.Street1).NotEmpty().MaximumLength(200).When(x => x.Dto.Address is not null);
        RuleFor(x => x.Dto.Address.City).NotEmpty().MaximumLength(100).When(x => x.Dto.Address is not null);
        RuleFor(x => x.Dto.Address.State).NotEmpty().MaximumLength(2).When(x => x.Dto.Address is not null);
        RuleFor(x => x.Dto.Address.Zip).NotEmpty().MaximumLength(10).When(x => x.Dto.Address is not null);
        RuleFor(x => x.Dto.Members).NotEmpty().WithMessage("At least one member is required.");
        RuleForEach(x => x.Dto.Members).ChildRules(member =>
        {
            member.RuleFor(m => m.FirstName).NotEmpty().MaximumLength(100);
            member.RuleFor(m => m.Role).NotEmpty();
            member.RuleFor(m => m.Gender).NotEmpty();
        });
    }
}

public class UpdateHouseholdValidator : AbstractValidator<Features.Households.Commands.UpdateHouseholdCommand>
{
    public UpdateHouseholdValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Dto.Name).MaximumLength(200).When(x => x.Dto.Name is not null);
        RuleFor(x => x.Dto.Status).Must(s =>
            s is "Active" or "Inactive" or "Visitor")
            .When(x => x.Dto.Status is not null)
            .WithMessage("Status must be Active, Inactive, or Visitor.");
    }
}
