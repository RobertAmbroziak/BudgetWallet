using BusinessLogic.Services.Mappers;
using Model.Application;
using Model.Tables;
using NUnit.Framework;
using Tests.Util;
using FluentAssertions;
using BusinessLogic.Abstractions;
using AutoFixture;

namespace Tests.BusinessLogic
{
    [UnitTests]
    [TestFixture]
    public class MapperServiceTests : BaseTest
    {
        [Test]
        public void Map_ValidAccountDto_ReturnsMappedAccount()
        {
            // Arrange
            var mapper = new AccountMapper();
            var accountDto = Fixture.Create<AccountDto>();

            // Act
            Account mappedAccount = mapper.Map(accountDto);

            // Assert
            mappedAccount.Should().NotBeNull();
            mappedAccount.Id.Should().Be(accountDto.Id);
            mappedAccount.Name.Should().Be(accountDto.Name);
            mappedAccount.Description.Should().Be(accountDto.Description);
            mappedAccount.MinValue.Should().Be(accountDto.MinValue);
            mappedAccount.IsActive.Should().Be(accountDto.IsActive);
        }

        [Test]
        public void MapCollection_ValidAccountDtoList_ReturnsMappedAccountList()
        {
            // Arrange
            var mapper = new AccountMapper();
            var accountDtoList = Fixture.CreateMany<AccountDto>();

            // Act
            var mappedAccounts = ((IMapperService<AccountDto, Account>)mapper).Map(accountDtoList);

            // Assert
            mappedAccounts.Should().NotBeNull();
            mappedAccounts.Should().HaveCount(accountDtoList.Count());

            // Verify each mapped account
            foreach (var accountDto in accountDtoList)
            {
                var mappedAccount = mappedAccounts.Single(a => a.Id == accountDto.Id);
                mappedAccount.Id.Should().Be(accountDto.Id);
                mappedAccount.Name.Should().Be(accountDto.Name);
                mappedAccount.Description.Should().Be(accountDto.Description);
                mappedAccount.MinValue.Should().Be(accountDto.MinValue);
                mappedAccount.IsActive.Should().Be(accountDto.IsActive);
            }
        }
    }
}
