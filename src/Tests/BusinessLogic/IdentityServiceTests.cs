using Model.Tables;
using NUnit.Framework;
using Tests.Util;
using FluentAssertions;
using AutoFixture;
using BusinessLogic.Services;
using Microsoft.AspNetCore.Http;
using Moq;
using Microsoft.Extensions.Configuration;
using DataAccessLayer;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using BusinessLogic.Abstractions;
using Util.Helpers;

namespace Tests.BusinessLogic
{
    [UnitTests]
    [TestFixture]
    public class IdentityServiceTests : BaseTest
    {
        [Test]
        public async Task GenerateToken_ReturnsToken()
        {
            // Arange
            var user = Fixture.Create<UserDto>();

            var httpContextAccessorMock = new Mock<IHttpContextAccessor>();
            var configurationMock = new Mock<IConfiguration>();
            var applicationRepositoryMock = new Mock<IApplicationRepository>();
            var emailServiceMock = new Mock<IEmailService>();
            var dateTimeProviderMock = new Mock<IDateTimeProvider>();
            dateTimeProviderMock.Setup(provider => provider.Now).Returns(DateTime.Now);

            var fakeJwtKey = Fixture.Create<string>();
            var fakeIssuer = Fixture.Create<string>();
            var fakeAudience = Fixture.Create<string>();

            configurationMock.SetupGet(x => x["Jwt:Key"]).Returns(fakeJwtKey);
            configurationMock.SetupGet(x => x["Jwt:Issuer"]).Returns(fakeIssuer);
            configurationMock.SetupGet(x => x["Jwt:Audience"]).Returns(fakeAudience);

            var identityService = new IdentityService(httpContextAccessorMock.Object, configurationMock.Object, applicationRepositoryMock.Object, emailServiceMock.Object, dateTimeProviderMock.Object);

            // Act
            var token = await identityService.GenerateToken(user);

            // Assert
            token.Should().NotBeNull();

            var tokenHandler = new JwtSecurityTokenHandler();
            tokenHandler.CanReadToken(token).Should().BeTrue("Generated token is not in valid JWT format");

            var validatedToken = tokenHandler.ReadJwtToken(token);
            validatedToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Sid)?.Value.Should().Be(user.Id.ToString());
            validatedToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value.Should().Be(user.UserName);
            validatedToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value.Should().Be(user.Email);
            validatedToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role)?.Value.Should().Be(user.UserRole.ToString());

            validatedToken.ValidTo.Should().BeAfter(DateTime.UtcNow, "Token has expired");
        }
    }
}
