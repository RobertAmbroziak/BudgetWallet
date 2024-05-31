using AutoFixture;
using BusinessLogic.Abstractions;
using BusinessLogic.Services;
using BusinessLogic.Services.Mappers;
using DataAccessLayer;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Localization;
using Model.Application;
using Model.Tables;
using Moq;
using NUnit.Framework;
using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using Tests.Helpers;
using Tests.Util;
using Util.Helpers;
using Util.Resources;

namespace Tests.BusinessLogic
{
    [UnitTests]
    [TestFixture]
    public class ApplicationServiceTests : BaseTest
    {
        private ApplicationService _applicationService;
        private Mock<IApplicationRepository> _applicationRepositoryMock;
        private Mock<IIdentityService> _identityServiceMock;
        private Mock<IStringLocalizer<AppResource>> _localizerMock;
        private IMapperService<BudgetDto, Budget> _budgetMapperMock;
        private IMapperService<BudgetPeriodDto, BudgetPeriod> _budgetPeriodMapperMock;
        private IMapperService<CategoryDto, Category> _categoryMapperMock;
        private IMapperService<AccountDto, Account> _accountMapperMock;
        private Mock<IMapperService<PostTransfer, TransferDto>> _postTransferMapperMock;
        private Mock<IMapperService<TransferDto, Transfer>> _transferMapperMock;
        private Mock<IDateTimeProvider> _dateTimeProviderMock;

        [SetUp]
        public void Setup()
        {
            _applicationRepositoryMock = new Mock<IApplicationRepository>();
            _identityServiceMock = new Mock<IIdentityService>();
            _localizerMock = new Mock<IStringLocalizer<AppResource>>();
            _categoryMapperMock = new CategoryMapper();
            _accountMapperMock = new AccountMapper();
            _budgetPeriodMapperMock = new BudgetPeriodMapper(_categoryMapperMock);
            _budgetMapperMock = new BudgetMapper(_budgetPeriodMapperMock, _categoryMapperMock);
            _postTransferMapperMock = new Mock<IMapperService<PostTransfer, TransferDto>>();
            _transferMapperMock = new Mock<IMapperService<TransferDto, Transfer>>();
            _dateTimeProviderMock = new Mock<IDateTimeProvider>();

            _applicationService = new ApplicationService(
                _applicationRepositoryMock.Object,
                _identityServiceMock.Object,
                _localizerMock.Object,
                _budgetMapperMock,
                _budgetPeriodMapperMock,
                _categoryMapperMock,
                _accountMapperMock,
                _postTransferMapperMock.Object,
                _transferMapperMock.Object,
                _dateTimeProviderMock.Object
            );
        }

        [Test]
        public async Task CloneBudget_ReturnsNewBudget()
        {
            // Arrange
            var budgetId = 1;
            var user = UserHelper.CreateUserDto();
            var rootBudget = BudgetHelper.CreateBudgetDto();
            var userBudgetsInfo = UserBudgetsInfoHelper.CreateUserBudgetsInfo();
            var categories = new List<CategoryDto>();
            var accounts = new List<AccountDto>();


            _identityServiceMock.Setup(service => service.GetCurrentUser()).ReturnsAsync(user);
            _applicationRepositoryMock.Setup(repo => repo.GetBudget(budgetId)).ReturnsAsync(rootBudget);
            _applicationRepositoryMock.Setup(repo => repo.FilterAsync<BudgetDto>(It.IsAny<Expression<Func<BudgetDto, bool>>>()))
                                 .ReturnsAsync(new List<BudgetDto> { rootBudget });
            _applicationRepositoryMock.Setup(repo => repo.GetCategoriesByBudgetId(It.IsAny<int>()))
                                      .ReturnsAsync(categories);
            _applicationRepositoryMock.Setup(repo => repo.FilterAsync<CategoryDto>(It.IsAny<Expression<Func<CategoryDto, bool>>>()))
                                      .ReturnsAsync(categories);
            _applicationRepositoryMock.Setup(repo => repo.FilterAsync<AccountDto>(It.IsAny<Expression<Func<AccountDto, bool>>>()))
                                      .ReturnsAsync(accounts);

            _localizerMock.Setup(l => l["rule_budgetIdBelongsToUser"]).Returns(new LocalizedString("rule_budgetIdBelongsToUser", "The budget ID does not belong to the user."));

            // Act
            var clonedBudget = await _applicationService.CloneBudget(budgetId);

            // Assert
            clonedBudget.Should().NotBeNull();

            foreach (var budgetCategory in clonedBudget.BudgetCategories)
            {
                var relatedBudgetPeriodCategories = clonedBudget.BudgetPeriods
                    .SelectMany(bp => bp.BudgetPeriodCategories)
                    .Where(bpc => bpc.CategoryId == budgetCategory.CategoryId);

                var totalMaxValue = relatedBudgetPeriodCategories.Sum(bpc => bpc.MaxValue);

                budgetCategory.MaxValue.Should().Be(totalMaxValue);
            }
        }
    }
}
