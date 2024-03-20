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

            var fakeJwtKey = Fixture.Create<string>();
            var fakeIssuer = Fixture.Create<string>();
            var fakeAudience = Fixture.Create<string>();

            configurationMock.SetupGet(x => x["Jwt:Key"]).Returns(fakeJwtKey);
            configurationMock.SetupGet(x => x["Jwt:Issuer"]).Returns(fakeIssuer);
            configurationMock.SetupGet(x => x["Jwt:Audience"]).Returns(fakeAudience);

            var identityService = new IdentityService(httpContextAccessorMock.Object, configurationMock.Object, applicationRepositoryMock.Object);

            // Act
            var token = await identityService.GenerateToken(user);

            // Assert
            token.Should().NotBeNull();

            // TODO: More asserts
        }
    }
}
