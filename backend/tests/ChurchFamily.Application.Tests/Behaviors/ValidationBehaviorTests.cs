using ChurchFamily.Application.Common.Behaviors;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Moq;

namespace ChurchFamily.Application.Tests.Behaviors;

public class ValidationBehaviorTests
{
    // --- Test: Throws ValidationException when validation fails ---

    [Fact]
    public async Task Handle_WhenValidationFails_ThrowsCustomValidationException()
    {
        // Arrange: Create a fake request and a validator that returns failures
        var request = new FakeRequest(""); // Empty name will fail

        var validatorMock = new Mock<IValidator<FakeRequest>>();
        validatorMock.Setup(v => v.ValidateAsync(
            It.IsAny<ValidationContext<FakeRequest>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult(new[]
            {
                new ValidationFailure("Name", "Name is required."),
                new ValidationFailure("Name", "Name must be at least 2 characters."),
            }));

        var behavior = new ValidationBehavior<FakeRequest, FakeResponse>(new[] { validatorMock.Object });

        var nextMock = new Mock<RequestHandlerDelegate<FakeResponse>>();

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Core.Exceptions.ValidationException>(
            () => behavior.Handle(request, nextMock.Object, CancellationToken.None));

        // Verify the error dictionary structure
        Assert.Single(exception.Errors); // One property key: "Name"
        Assert.True(exception.Errors.ContainsKey("Name"));
        Assert.Equal(2, exception.Errors["Name"].Length); // Two error messages

        // Verify that next() was never called
        nextMock.Verify(n => n.Invoke(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WhenMultiplePropertiesFail_ErrorDictionaryHasMultipleKeys()
    {
        // Arrange
        var request = new FakeRequest("");

        var validatorMock = new Mock<IValidator<FakeRequest>>();
        validatorMock.Setup(v => v.ValidateAsync(
            It.IsAny<ValidationContext<FakeRequest>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult(new[]
            {
                new ValidationFailure("Name", "Name is required."),
                new ValidationFailure("Email", "Email is required."),
            }));

        var behavior = new ValidationBehavior<FakeRequest, FakeResponse>(new[] { validatorMock.Object });
        var nextMock = new Mock<RequestHandlerDelegate<FakeResponse>>();

        // Act & Assert
        var exception = await Assert.ThrowsAsync<Core.Exceptions.ValidationException>(
            () => behavior.Handle(request, nextMock.Object, CancellationToken.None));

        Assert.Equal(2, exception.Errors.Count); // Two property keys
        Assert.True(exception.Errors.ContainsKey("Name"));
        Assert.True(exception.Errors.ContainsKey("Email"));
    }

    // --- Test: Calls next() when validation passes ---

    [Fact]
    public async Task Handle_WhenValidationPasses_CallsNextDelegate()
    {
        // Arrange
        var request = new FakeRequest("Valid Name");
        var expectedResponse = new FakeResponse("Success");

        var validatorMock = new Mock<IValidator<FakeRequest>>();
        validatorMock.Setup(v => v.ValidateAsync(
            It.IsAny<ValidationContext<FakeRequest>>(),
            It.IsAny<CancellationToken>()))
            .ReturnsAsync(new ValidationResult()); // No errors

        var behavior = new ValidationBehavior<FakeRequest, FakeResponse>(new[] { validatorMock.Object });

        var nextMock = new Mock<RequestHandlerDelegate<FakeResponse>>();
        nextMock.Setup(n => n.Invoke(It.IsAny<CancellationToken>())).ReturnsAsync(expectedResponse);

        // Act
        var result = await behavior.Handle(request, nextMock.Object, CancellationToken.None);

        // Assert
        Assert.Equal(expectedResponse, result);
        nextMock.Verify(n => n.Invoke(It.IsAny<CancellationToken>()), Times.Once);
    }

    // --- Test: Skips validation when no validators registered ---

    [Fact]
    public async Task Handle_WhenNoValidatorsRegistered_CallsNextDirectly()
    {
        // Arrange: Empty validator list
        var request = new FakeRequest("Anything");
        var expectedResponse = new FakeResponse("Direct pass");

        var behavior = new ValidationBehavior<FakeRequest, FakeResponse>(
            Enumerable.Empty<IValidator<FakeRequest>>());

        var nextMock = new Mock<RequestHandlerDelegate<FakeResponse>>();
        nextMock.Setup(n => n.Invoke(It.IsAny<CancellationToken>())).ReturnsAsync(expectedResponse);

        // Act
        var result = await behavior.Handle(request, nextMock.Object, CancellationToken.None);

        // Assert
        Assert.Equal(expectedResponse, result);
        nextMock.Verify(n => n.Invoke(It.IsAny<CancellationToken>()), Times.Once);
    }

    // --- Test support types ---

    public record FakeRequest(string Name) : IRequest<FakeResponse>;
    public record FakeResponse(string Result);
}
