﻿using BusinessLogic.Abstractions;
using Microsoft.AspNetCore.Http;
using DataAccessLayer;
using Model.Application;
using Model.Tables;
using Mocks.MockData;
using Microsoft.Extensions.Localization;
using Util.Resources;

namespace BusinessLogic.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IIdentityService _identityService;
        private readonly IStringLocalizer<AppResource> _localizer;
        private readonly IMapperService<BudgetDto, Budget> _budgetMapper;
        private readonly IMapperService<BudgetPeriodDto, BudgetPeriod> _budgetPeriodMapper;
        private readonly IMapperService<CategoryDto, Category> _categoryMapper;
        private readonly IMapperService<AccountDto, Account> _accountMapper;
        private readonly IMapperService<PostTransfer, TransferDto> _postTransferMapper;

        public ApplicationService
        (
            IApplicationRepository applicationRepository,
            IIdentityService identityService,
            IStringLocalizer<AppResource> localizer,
            IMapperService<BudgetDto, Budget> budgetMapper,
            IMapperService<BudgetPeriodDto, BudgetPeriod> budgetPeriodMapper,
            IMapperService<CategoryDto, Category> categoryMapper,
            IMapperService<AccountDto, Account> accountMapper,
            IMapperService<PostTransfer, TransferDto> postTransferMapper
        )
        {
            _applicationRepository = applicationRepository;
            _identityService = identityService;
            _localizer = localizer;
            _budgetMapper = budgetMapper;
            _budgetPeriodMapper = budgetPeriodMapper;
            _categoryMapper = categoryMapper;
            _accountMapper = accountMapper;
            _postTransferMapper = postTransferMapper;
        }

        public async Task<SplitsResponse> GetSplitsResponse(SplitsRequest splitsRequest)
        {
            var budget = await _applicationRepository.GetByIdAsync<BudgetDto>(splitsRequest.BudgetId);
            var user = await _identityService.GetCurrentUser();

            if (budget.UserId != user.Id)
            {
                throw new BadHttpRequestException(_localizer["rule_budgetIdBelongsToUser"].Value);
            }

            var spiltDtos = await _applicationRepository.GetSplits(splitsRequest);

            var splits = new List<Split>();
            int k = 0;

            decimal currentValue = 0;
            decimal budgetFilterValue = 0;

            if (splitsRequest.AccountId == null)
            {
                if (splitsRequest.BudgetPeriodId != null && splitsRequest.CategoryId != null)
                {
                    budgetFilterValue = (await _applicationRepository.FirstOrDefault<BudgetPeriodCategoryDto>(x => x.BudgetPeriodId == splitsRequest.BudgetPeriodId && x.CategoryId == splitsRequest.CategoryId))?.MaxValue ?? 0;
                }
                else if (splitsRequest.BudgetPeriodId == null && splitsRequest.CategoryId != null)
                {
                    budgetFilterValue = (await _applicationRepository.FirstOrDefault<BudgetCategoryDto>(x => x.CategoryId == splitsRequest.CategoryId))?.MaxValue ?? 0;
                }
                else if (splitsRequest.BudgetPeriodId != null && splitsRequest.CategoryId == null)
                {
                    budgetFilterValue = (await _applicationRepository.FilterAsync<BudgetPeriodCategoryDto>(x => x.BudgetPeriodId == splitsRequest.BudgetPeriodId)).Sum(x => x.MaxValue);
                }
                else
                {
                    budgetFilterValue = (await _applicationRepository.FilterAsync<BudgetCategoryDto>(x => x.BudgetId == splitsRequest.BudgetId)).Sum(x => x.MaxValue);
                }
            }


            foreach (var split in spiltDtos)
            {
                k++;
                currentValue += split.Value;
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
                        Percentage = (budgetFilterValue > 0) ? Math.Round((currentValue / budgetFilterValue) * 100, 2) : 0
                    });
            }

            var splitSummary = new SplitSummary
            {
                SplitsValue = currentValue,
                BudgetValue = budgetFilterValue
            };

            var splitChartsItems = new List<SplitChartItem>(); // TODO: dane na potrzeby wykresu

            Dictionary<int, DateOnly> axisX;
            if (splitsRequest.BudgetPeriodId != null)
            {
                var budgetPeriod = await _applicationRepository.GetByIdAsync<BudgetPeriodDto>(splitsRequest.BudgetPeriodId.Value);
                axisX = SetAxisX(budgetPeriod.ValidFrom, budgetPeriod.ValidTo);
            }
            else
            {
                axisX = SetAxisX(budget.ValidFrom, budget.ValidTo);
            }

            Dictionary<int, decimal> budgetValues;
            Dictionary<int, decimal> splitValues;



            /*
                ustawiamy tylko jeśli nie ma filtra na Account
                jeśli jest filtr na Period to bierzemy okres periodu i liczbę dni z niego - jako oś X
                jeśli nie to z budżetu i to samo
                
                bierzemy budgetFilterValue i rozbijamy proporcjonalnie przyrostowo jako linia prosta na wszystkie dni
                może jeśli budżet to zbudujmy nie prostą tylko łamaną z periodów ??? - ale to opcja
                to oczywiście przyrostowa wartość będzie na oś Y

                ze splitów value liczymy sumy po dacie i jako Y rzucamy na wykres
               
             */


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
            if (currentBudget == null)
            {
                budgets.FirstOrDefault();
            }
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

        public async Task<IEnumerable<BudgetPeriod>> GetBudgetPeriodsByBudgetId(int budgetId)
        {
            var user = await _identityService.GetCurrentUser();

            var budget = await _applicationRepository.GetByIdAsync<BudgetDto>(budgetId);
            if (budget == null)
            {
                throw new BadHttpRequestException(_localizer["rule_budgetIdBelongsToUser"].Value);
            }
            if (budget.UserId != user.Id)
            {
                throw new BadHttpRequestException(_localizer["rule_budgetIdBelongsToUser"].Value);
            }

            var budgetPeriods = await _applicationRepository.FilterAsync<BudgetPeriodDto>(x => x.BudgetId == budgetId);
            return _budgetPeriodMapper.Map(budgetPeriods);
        }

        public async Task<UserBudgetsInfo> GetUserBudgetsInfo()
        {
            var user = await _identityService.GetCurrentUser();

            var budgets = await _applicationRepository.FilterAsync<BudgetDto>(x => x.UserId == user.Id);
            var currentBudget = budgets.FirstOrDefault(x => x.ValidFrom <= DateTime.Now && x.ValidTo > DateTime.Now);
            if (currentBudget == null)
            {
                budgets.FirstOrDefault();
            }

            // TODO: docelowo powinienem chyba pobierać Categories na podstawie BudgetCategories
            var categories = await _applicationRepository.FilterAsync<CategoryDto>(x => x.UserId == user.Id);
            var accounts = await _applicationRepository.FilterAsync<AccountDto>(x => x.UserId == user.Id && x.IsActive);

            var userBudgetsInfo = new UserBudgetsInfo
            {
                Budgets = _budgetMapper.Map(budgets),
                CurrentBudgetAccounts = _accountMapper.Map(accounts),
                CurrentBudgetCategories = _categoryMapper.Map(categories),
                CurrentBudgetId = currentBudget.Id
            };

            return userBudgetsInfo;
        }
        public async Task<IEnumerable<Category>> GetBudgetCategories(int budgetId)
        {
            var budget = await _applicationRepository.GetByIdAsync<BudgetDto>(budgetId);
            var user = await _identityService.GetCurrentUser();

            if (budget.UserId != user.Id)
            {
                throw new BadHttpRequestException(_localizer["rule_budgetIdBelongsToUser"].Value);
            }

            // TODO: docelowo powinienem chyba pobierać Categories na podstawie BudgetCategories
            var categories = await _applicationRepository.FilterAsync<CategoryDto>(x => x.UserId == user.Id);
            return _categoryMapper.Map(categories);
        }
        public async Task<IEnumerable<Account>> GetBudgetAccounts(int budgetId)
        {
            var budget = await _applicationRepository.GetByIdAsync<BudgetDto>(budgetId);
            var user = await _identityService.GetCurrentUser();

            if (budget.UserId != user.Id)
            {
                throw new BadHttpRequestException(_localizer["rule_budgetIdBelongsToUser"].Value);
            }

            var accounts = await _applicationRepository.FilterAsync<AccountDto>(x => x.UserId == user.Id && x.IsActive);
            return _accountMapper.Map(accounts);
        }

        public async Task AddTransfer(PostTransfer postTransfer)
        {
            var transfer = _postTransferMapper.Map(postTransfer);

            await _applicationRepository.InsertAsync(transfer);
            await _applicationRepository.SaveChangesAsync();
        }

        public async Task<bool> IsAccountIdsBelongToUser(int userId, IEnumerable<int> accountIds, bool onlyActive = false)
        {
            var accounts = await _applicationRepository.FilterAsync<AccountDto>(x => accountIds.Contains(x.Id) && (!onlyActive || x.IsActive));
            foreach (var account in accounts)
            {
                if (account.UserId != userId)
                {
                    return false;
                }
            }
            return true;
        }

        public async Task<bool> IsBudgetIdsBelongToUser(int userId, IEnumerable<int> budgetIds, bool onlyActive = false)
        {
            var budgets = await _applicationRepository.FilterAsync<BudgetDto>(x => budgetIds.Contains(x.Id) && (!onlyActive || x.IsActive));
            foreach (var budget in budgets)
            {
                if (budget.UserId != userId)
                {
                    return false;
                }
            }
            return true;
        }

        public async Task<bool> IsBudgetPeriodIdsBelongToBudget(int budgetId, IEnumerable<int> budgetPeriodIds, bool onlyActive = false)
        {
            var budgetPeriods = await _applicationRepository.FilterAsync<BudgetPeriodDto>(x => x.BudgetId == budgetId && (!onlyActive || x.IsActive));
            var periodIds = budgetPeriods.Select(x => x.Id);
            foreach (var budgetPeriodId in budgetPeriodIds)
            {
                if (!periodIds.Contains(budgetPeriodId))
                {
                    return false;
                }
            }
            return true;
        }

        public async Task<bool> IsCategoryIdsBelongToBudget(int budgetId, IEnumerable<int> categoryIds, bool onlyActive = false)
        {
            var budgetCategories = await _applicationRepository.FilterAsync<BudgetCategoryDto>(x => x.BudgetId == budgetId && (!onlyActive || x.IsActive));
            var budgetCategoryIds = budgetCategories.Select(x => x.CategoryId);
            foreach (var categoryId in categoryIds)
            {
                if (!budgetCategoryIds.Contains(categoryId))
                {
                    return false;
                }
            }
            return true;
        }

        public async Task<bool> IsCategoryIdsBelongToUser(int userId, IEnumerable<int> categoryIds, bool onlyActive = false)
        {
            var categories = await _applicationRepository.FilterAsync<BudgetDto>(x => categoryIds.Contains(x.Id) && (!onlyActive || x.IsActive));
            foreach (var category in categories)
            {
                if (category.UserId != userId)
                {
                    return false;
                }
            }
            return true;
        }

        #region private

        private Dictionary<int, DateOnly> SetAxisX(DateTime startDate, DateTime endDate)
        {
            var result = new Dictionary<int, DateOnly>();
            int counter = 1;
            for (DateTime date = startDate.Date; date.Date <= endDate.Date; date = date.AddDays(1))
            {
                result.Add(counter++, DateOnly.FromDateTime(date));
            }
            return result;
        }

        #endregion
    }
}