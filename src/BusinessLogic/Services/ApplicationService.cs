using BusinessLogic.Abstractions;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using DataAccessLayer;
using Model.Application;
using Model.Tables;
using Mocks.MockData;

namespace BusinessLogic.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IIdentityService _identityService;

        private readonly IMapperService<BudgetDto, Budget> _budgetMapper;
        private readonly IMapperService<BudgetPeriodDto, BudgetPeriod> _budgetPeriodMapper;
        private readonly IMapperService<CategoryDto, Category> _categoryMapper;
        private readonly IMapperService<AccountDto, Account> _accountMapper;

        public ApplicationService
        (
            IApplicationRepository applicationRepository,
            IIdentityService identityService,

            IMapperService<BudgetDto, Budget> budgetMapper,
            IMapperService<BudgetPeriodDto, BudgetPeriod> budgetPeriodMapper,
            IMapperService<CategoryDto, Category> categoryMapper,
            IMapperService<AccountDto, Account> accountMapper
        )
        {
            _applicationRepository = applicationRepository;
            _identityService = identityService;

            _budgetMapper = budgetMapper;
            _budgetPeriodMapper = budgetPeriodMapper;
            _categoryMapper = categoryMapper;
            _accountMapper = accountMapper;
        }

        public async Task<SplitsResponse> GetSplitsResponse(SplitsRequest splitsRequest)
        {
            var budget = await _applicationRepository.GetByIdAsync<BudgetDto>(splitsRequest.BudgetId);
            var user = await _identityService.GetCurrentUser();

            if (budget.UserId != user.Id)
            {
                throw new BadHttpRequestException("Selected budget does not belong to the user.");
            }

            var spiltDtos = await _applicationRepository.GetSplits(splitsRequest);

            var splits = new List<Split>();
            int k = 0;
            foreach (var split in spiltDtos)
            {
                k++;
                splits.Add(
                    new Split
                    {
                        SplitId = split.Id,
                        SplitName = split.Name,
                        SplitDescription = split.Description,
                        SplitValue = split.Value,
                        CategoryId = split.CategoryId,
                        CategoryName = split.Category.Name,
                        CategoryDescription = split.Category.Description,
                        AccountSourceId = split.Transfer.SourceAccountId.Value,
                        AccountSourceName = split.Transfer.SourceAccount.Name,
                        AccountSourceDescription = split.Transfer.SourceAccount.Description,
                        TransferId = split.TransferId,
                        TransferName = split.Transfer.Name,
                        TransferDescription = split.Transfer.Description,
                        TransferDate = split.Transfer.TransferDate,

                        OrderId = k,
                        Percentage = 0 // TODO:  chciałem żeby to był stosunek przyrostowej wartość wydatków do założonego budżetu na budgetCategory lub PeriodCategory
                    });
            }

            /* TODO: budgetValue jest zależny od filtra. to może być cały budżet więc suma z wszystkich BudgetPeriod, pojedynczy Period, może być tylko dla BudgetPeriodCategory lub mix. Tylko użycie Account w filtrze ma zwrócić 0 */
            var splitSummary = new SplitSummary
            {
                SplitsValue = splits.Sum(x => x.SplitValue),
                BudgetValue = splits.Sum(x => x.SplitValue) // TODO : będzie zastąpione przez budgetPeriod
            };

            var splitChartsItems = new List<SplitChartItem>(); // TODO: dane na potrzeby wykresu

            var splitsResponse = new SplitsResponse
            {
                Splits = splits,
                SplitChartItems = splitChartsItems,
                SplitSummary = splitSummary
            };

            return splitsResponse;
        }

        public async Task AddMockData()
        {
            var user = await _identityService.GetCurrentUser();

            var isUserAccountsExist = await _applicationRepository.Any<AccountDto>(x => x.UserId == user.Id);
            var isUserBudgetsExist = await _applicationRepository.Any<BudgetDto>(x => x.UserId == user.Id);

            if (isUserAccountsExist && isUserBudgetsExist)
            {
                throw new Exception("Istnieją już konta i budżety dla tego użytkownika");
            }

            IEnumerable<AccountDto> accountMock = null;
            IEnumerable<BudgetDto> budgetMock = null;

            if (!isUserAccountsExist)
            {
                accountMock = AccountMockCreator.CreateAccounts(user.Id);
            }

            if (!isUserBudgetsExist)
            {
                var budgetMockCreator = new BudgetMockCreator(DateTime.Now);
                budgetMock = budgetMockCreator.CreateBudgets(user.Id);
            }

            await _applicationRepository.AddMockData(budgetMock, accountMock);
        }

        public async Task<Filter> GetFilter()
        {
            var user = await _identityService.GetCurrentUser();

            var budgets = await _applicationRepository.FilterAsync<BudgetDto>(x => x.UserId == user.Id);
            var currentBudget = budgets.FirstOrDefault(x => x.ValidFrom <= DateTime.Now && x.ValidTo > DateTime.Now);
            var budgetPeriods = await _applicationRepository.FilterAsync<BudgetPeriodDto>(x => x.BudgetId == currentBudget.Id);
            var categories = await _applicationRepository.FilterAsync<CategoryDto>(x => x.UserId == user.Id);
            var accounts = await _applicationRepository.FilterAsync<AccountDto>(x => x.UserId == user.Id);

            return new Filter
            {
                CurrentBudgetId = currentBudget.Id,
                Budgets = _budgetMapper.Map(budgets),
                BudgetPeriods = _budgetPeriodMapper.Map(budgetPeriods),
                Categories = _categoryMapper.Map(categories),
                Accounts = _accountMapper.Map(accounts)
            };
        }
    }
}