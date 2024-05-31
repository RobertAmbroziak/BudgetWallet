using BusinessLogic.Abstractions;
using Microsoft.AspNetCore.Http;
using DataAccessLayer;
using Model.Application;
using Model.Tables;
using Mocks.MockData;
using Microsoft.Extensions.Localization;
using Util.Resources;
using Mocks.DefaultData;
using Util.Helpers;


namespace BusinessLogic.Services
{
    public class BudgetService : IBudgetService
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IIdentityService _identityService;
        private readonly IStringLocalizer<AppResource> _localizer;
        private readonly IMapperService<BudgetDto, Budget> _budgetMapper;
        private readonly IMapperService<BudgetPeriodDto, BudgetPeriod> _budgetPeriodMapper;
        private readonly IMapperService<CategoryDto, Category> _categoryMapper;
        private readonly IMapperService<AccountDto, Account> _accountMapper;
        private readonly IMapperService<PostTransfer, TransferDto> _postTransferMapper;
        private readonly IMapperService<TransferDto, Transfer> _transferMapper;
        private readonly IDateTimeProvider _dateTimeProvider;

        public BudgetService
        (
            IApplicationRepository applicationRepository,
            IIdentityService identityService,
            IStringLocalizer<AppResource> localizer,
            IMapperService<BudgetDto, Budget> budgetMapper,
            IMapperService<BudgetPeriodDto, BudgetPeriod> budgetPeriodMapper,
            IMapperService<CategoryDto, Category> categoryMapper,
            IMapperService<AccountDto, Account> accountMapper,
            IMapperService<PostTransfer, TransferDto> postTransferMapper,
            IMapperService<TransferDto, Transfer> transferMapper,
            IDateTimeProvider dateTimeProvider
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
            _transferMapper = transferMapper;
            _dateTimeProvider = dateTimeProvider;
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

            var budgetPeriods = await _applicationRepository.FilterAsync<BudgetPeriodDto>(x => x.BudgetId == budgetId && x.IsActive);
            return _budgetPeriodMapper.Map(budgetPeriods);
        }

        public async Task<UserBudgetsInfo> GetUserBudgetsInfo()
        {
            var user = await _identityService.GetCurrentUser();

            var budgets = await _applicationRepository.FilterAsync<BudgetDto>(x => x.UserId == user.Id);
            var currentBudget = budgets.FirstOrDefault(x => x.ValidFrom <= _dateTimeProvider.Now && x.ValidTo > _dateTimeProvider.Now);
            if (currentBudget == null)
            {
                currentBudget = budgets.FirstOrDefault();
            }

            IEnumerable<CategoryDto> categories = new List<CategoryDto>();
            if (currentBudget != null)
            {
                categories = await _applicationRepository.GetCategoriesByBudgetId(currentBudget.Id);
            }
            else
            {
                categories = await _applicationRepository.FilterAsync<CategoryDto>(x => x.UserId == user.Id);
            }

            var accounts = await _applicationRepository.FilterAsync<AccountDto>(x => x.UserId == user.Id && x.IsActive);

            var userBudgetsInfo = new UserBudgetsInfo
            {
                Budgets = _budgetMapper.Map(budgets),
                CurrentBudgetAccounts = _accountMapper.Map(accounts),
                CurrentBudgetCategories = _categoryMapper.Map(categories),
                CurrentBudgetId = currentBudget?.Id ?? 0
            };

            return userBudgetsInfo;
        }

        public async Task<Budget> GetBudget(int budgetId)
        {
            var user = await _identityService.GetCurrentUser();
            var budget = await _applicationRepository.GetBudget(budgetId);

            if (budget.UserId != user.Id)
            {
                throw new BadHttpRequestException(_localizer["rule_budgetIdBelongsToUser"].Value);
            }

            return _budgetMapper.Map(budget);
        }

        public async Task UpdateBudget(Budget budget)
        {
            var user = await _identityService.GetCurrentUser();

            if (budget.Id > 0)
            {
                var budgetDto = await _applicationRepository.GetBudget(budget.Id);

                budgetDto.Name = budget.Name;
                budgetDto.Description = budget.Description;
                budgetDto.ValidFrom = budget.ValidFrom;
                budgetDto.ValidTo = budget.ValidTo;
                budgetDto.IsActive = budget.IsActive;

                foreach (var budgetCategory in budget.BudgetCategories)
                {
                    if (budgetCategory.Id > 0)
                    {
                        var budgetCategoryDto = budgetDto.BudgetCategories.FirstOrDefault(x => x.Id == budgetCategory.Id);
                        if (budgetCategoryDto != null)
                        {
                            budgetCategoryDto.CategoryId = budgetCategory.CategoryId;
                            budgetCategoryDto.MaxValue = budgetCategory.MaxValue;
                            budgetCategoryDto.IsActive = budgetCategory.IsActive;
                        }
                    }
                    else
                    {
                        await _applicationRepository.InsertAsync(new BudgetCategoryDto
                        {
                            BudgetId = budgetDto.Id,
                            CategoryId = budgetCategory.CategoryId,
                            MaxValue = budgetCategory.MaxValue,
                            IsActive = budgetCategory.IsActive
                        });
                    }
                }

                foreach (var budgetPeriod in  budget.BudgetPeriods)
                {
                    if (budgetPeriod.Id > 0)
                    {
                        var budgetPeriodDto = budgetDto.BudgetPeriods.FirstOrDefault(x => x.Id == budgetPeriod.Id);
                        if (budgetPeriodDto != null)
                        {
                            budgetPeriodDto.ValidFrom = budgetPeriod.ValidFrom;
                            budgetPeriodDto.ValidTo = budgetPeriod.ValidTo;
                            budgetPeriodDto.IsActive = budgetPeriod.IsActive;
                            await UpdateBudgetPeriodCategories(budgetPeriodDto, budgetPeriod);
                        }
                    }
                    else
                    {
                        var budgetPeriodCategories = GetBudgetPeriodCategories(budgetPeriod.BudgetPeriodCategories).ToList();
                        await _applicationRepository.InsertAsync(new BudgetPeriodDto
                        {
                            BudgetId = budgetDto.Id,
                            ValidFrom = budgetPeriod.ValidFrom,
                            ValidTo = budgetPeriod.ValidTo,
                            IsActive = budgetPeriod.IsActive,
                            BudgetPeriodCategories = budgetPeriodCategories
                        }); ;
                    }
                }
            }
            else
            {
                var budgetDto = new BudgetDto
                {
                    UserId = user.Id,
                    Name = budget.Name,
                    Description = budget.Description,
                    ValidFrom = budget.ValidFrom,
                    ValidTo = budget.ValidTo,
                    IsActive = budget.IsActive,
                    BudgetCategories = GetBudgetCategoryDtoListByBudgetCategories(budget.BudgetCategories).ToList(),
                    BudgetPeriods = GetBudgetPeriodDtoListByBudgetPeriods(budget.BudgetPeriods).ToList()
                };

                await _applicationRepository.InsertAsync(budgetDto);
            }
            
            await _applicationRepository.SaveChangesAsync();
        }
        public async Task<Budget> CloneBudget(int budgetId)
        {
            var user = await _identityService.GetCurrentUser();
            var budget = await _applicationRepository.GetBudget(budgetId);

            if (budget.UserId != user.Id)
            {
                throw new BadHttpRequestException(_localizer["rule_budgetIdBelongsToUser"].Value);
            }

            var budgetRangeInfo = GetBudgetRangeInfo(budget.ValidFrom, budget.ValidTo, budget.BudgetPeriods.Where(x => x.IsActive)).Result;

            DateTime? budgetValidFrom = null;
            DateTime? budgetValidTo = null;
            List<Tuple<DateTime, DateTime>> periodDatePairs = null;

            if (budgetRangeInfo.IsMonthlyRange)
            {
                budgetValidFrom = budget.ValidTo;
                budgetValidTo = budget.ValidTo.AddMonths(1);
            }

            if (budgetRangeInfo.IsWeeklyRange)
            {
                budgetValidFrom = budget.ValidTo;
                budgetValidTo = budget.ValidTo.AddDays(7);
            }

            if (budgetRangeInfo.BudgetDays.HasValue)
            {
                budgetValidFrom = budget.ValidTo;
                budgetValidTo = budget.ValidTo.AddDays(budgetRangeInfo.BudgetDays.Value);
            }

            if (budgetRangeInfo.IsPeriodWeeklyRange)
            {
                periodDatePairs = new List<Tuple<DateTime, DateTime>>();

                DateTime currentStartDate = budgetValidFrom.Value;
                while (currentStartDate < budgetValidTo)
                {
                    DateTime currentEndDate = currentStartDate.AddDays(7);
                    if (currentEndDate > budgetValidTo)
                    {
                        currentEndDate = budgetValidTo.Value;
                    }

                    periodDatePairs.Add(new Tuple<DateTime, DateTime>(currentStartDate, currentEndDate));
                    currentStartDate = currentEndDate;
                }
            }

            if(budgetRangeInfo.PeriodDays != null)
            {
                periodDatePairs = new List<Tuple<DateTime, DateTime>>();

                DateTime currentStartDate = budgetValidFrom.Value;

                foreach (int period in budgetRangeInfo.PeriodDays)
                {
                    DateTime currentEndDate = currentStartDate.AddDays(period);

                    if (currentEndDate > budgetValidTo)
                    {
                        currentEndDate = budgetValidTo.Value;
                    }


                    periodDatePairs.Add(new Tuple<DateTime, DateTime>(currentStartDate, currentEndDate));

                    currentStartDate = currentEndDate;

                    if (currentStartDate >= budgetValidTo)
                    {
                        break;
                    }
                }

                if (currentStartDate < budgetValidTo)
                {
                    periodDatePairs.Add(new Tuple<DateTime, DateTime>(currentStartDate, budgetValidTo.Value));
                }
            }

            var userBudgetsInfo = await GetUserBudgetsInfo();
            var budgetName = GetUniqueBudgetName(budgetValidFrom.Value, userBudgetsInfo);
            var budgetCategories = GetClonedBudgetCategories(budget.BudgetCategories.Where(x => x.IsActive)).ToList();
            var budgetPeriods = GetClonedBudgetPeriods(periodDatePairs, budgetCategories, budget.BudgetPeriods.Where(x => x.IsActive)).ToList();
            var newBudget = new BudgetDto
            {
                UserId = user.Id,
                Name = budgetName,
                Description = budgetName,
                ValidFrom = budgetValidFrom.Value,
                ValidTo = budgetValidTo.Value,
                IsActive = true,
                BudgetCategories = budgetCategories,
                BudgetPeriods = budgetPeriods,
            };

            await _applicationRepository.InsertAsync<BudgetDto>(newBudget);
            await _applicationRepository.SaveChangesAsync();

            return _budgetMapper.Map(newBudget);

            throw new NotImplementedException();
        }

        public async Task<Budget> GetDefaultBudget()
        {
            const decimal valuePerBudgetCategory = 500;
            var user = await _identityService.GetCurrentUser();
            var budgetInfo = await GetUserBudgetsInfo();
            var userCategories = budgetInfo.CurrentBudgetCategories.Where(x => x.IsActive);

            if (!userCategories.Any())
            {
                throw new BadHttpRequestException(_localizer["rule_userDoesNotHaveAnyAvtiveCategories"].Value);
            }

            var currentDate = DateTime.UtcNow;

            var validFrom = new DateTime(currentDate.Year, currentDate.Month, 1, 0, 0, 0);
            var validTo = currentDate.Month == 12 ? new DateTime(currentDate.Year + 1,1,1, 0, 0, 0) : new DateTime(currentDate.Year, currentDate.Month + 1, 1, 0, 0, 0);

            var budgetName = GetUniqueBudgetName(validFrom, budgetInfo);

            var budgetCategories = new List<BudgetCategory>();
            
            foreach (var category in userCategories)
            {
                budgetCategories.Add(new BudgetCategory
                {
                    CategoryId = category.Id,
                    MaxValue = valuePerBudgetCategory,
                    IsActive = true
                });
            }

            var budgetPeriods = new List<BudgetPeriod>();

            DateTime periodStart = validFrom;
            DateTime periodEnd = periodStart.AddDays(7);

            while (periodStart < validTo)
            {
                if (periodEnd > validTo)
                    periodEnd = validTo;

                budgetPeriods.Add(new BudgetPeriod
                {
                    ValidFrom = periodStart,
                    ValidTo = periodEnd,
                    IsActive = true
                });

                periodStart = periodEnd;
                periodEnd = periodStart.AddDays(7);
            }

            foreach (var budgetPeriod in budgetPeriods)
            {
                var budgetPeriodCategories = new List<BudgetPeriodCategory>();

                foreach (var budgetCategory in budgetCategories)
                {
                    var maxValuePerPeriod = Math.Round(budgetCategory.MaxValue / budgetPeriods.Count, 2);

                    var budgetPeriodCategory = new BudgetPeriodCategory
                    {
                        CategoryId = budgetCategory.CategoryId,
                        MaxValue = maxValuePerPeriod,
                        IsActive = true
                    };

                    budgetPeriodCategories.Add(budgetPeriodCategory);
                }

                budgetPeriod.BudgetPeriodCategories = budgetPeriodCategories;
            };

            /* recalculate firstPeriod */
            foreach (var budgetCategory in budgetCategories)
            {
                var periodsCategorySumValue = budgetPeriods
                    .SelectMany(bp => bp.BudgetPeriodCategories)
                    .Where(bpc => bpc.CategoryId == budgetCategory.CategoryId)
                    .Sum(bpc => bpc.MaxValue);

                var difference = budgetCategory.MaxValue - periodsCategorySumValue;
                if (difference != 0)
                {
                    var firstBudgetPeriod = budgetPeriods.First();
                    var firstBudgetPeriodCurrentBudgetPeriodCategory = firstBudgetPeriod.BudgetPeriodCategories.Single(x =>x.CategoryId == budgetCategory.CategoryId);

                    firstBudgetPeriodCurrentBudgetPeriodCategory.MaxValue += difference;
                }
            }

            var budget = new Budget
            {
                Name = budgetName,
                Description = budgetName,
                ValidFrom = validFrom,
                ValidTo = validTo,
                IsActive = true,
                BudgetCategories = budgetCategories,
                BudgetPeriods = budgetPeriods
            };

            return budget;
        }

        #region private

        private IEnumerable<BudgetPeriodCategoryDto> GetBudgetPeriodCategories(IEnumerable<BudgetPeriodCategory> budgetPeriodCategories)
        {
            var result = new List<BudgetPeriodCategoryDto>();

            foreach (var budgetPeriodCategory in budgetPeriodCategories)
            {
                result.Add(new BudgetPeriodCategoryDto
                {
                    CategoryId = budgetPeriodCategory.Id,
                    MaxValue = budgetPeriodCategory.MaxValue
                });
            }

            return result;
        }

        private async Task UpdateBudgetPeriodCategories(BudgetPeriodDto budgetPeriodDto, BudgetPeriod budgetPeriod)
        {
            foreach (var budgetPeriodCategory in budgetPeriod.BudgetPeriodCategories)
            {
                if (budgetPeriodCategory.Id > 0)
                {
                    var budgetPeriodCategoryDto = budgetPeriodDto.BudgetPeriodCategories.FirstOrDefault(x => x.Id == budgetPeriodCategory.Id);
                    if (budgetPeriodCategoryDto != null)
                    {
                        budgetPeriodCategoryDto.CategoryId = budgetPeriodCategory.CategoryId;
                        budgetPeriodCategoryDto.MaxValue = budgetPeriodCategory.MaxValue;
                        budgetPeriodCategoryDto.IsActive = budgetPeriodCategory.IsActive;
                    }
                }
                else
                {
                    await _applicationRepository.InsertAsync(new BudgetPeriodCategoryDto
                    {
                        BudgetPeriodId = budgetPeriodDto.Id,
                        CategoryId = budgetPeriodCategory.CategoryId,
                        MaxValue = budgetPeriodCategory.MaxValue,
                        IsActive = budgetPeriodCategory.IsActive
                    });
                }
            }
        }

        private IEnumerable<BudgetCategoryDto> GetBudgetCategoryDtoListByBudgetCategories(IEnumerable<BudgetCategory> budgetCategories)
        {
            var result = new List<BudgetCategoryDto>();

            foreach (var budgetCategory in budgetCategories)
            {
                result.Add(new BudgetCategoryDto
                {
                    CategoryId = budgetCategory.CategoryId,
                    MaxValue = budgetCategory.MaxValue,
                    IsActive = budgetCategory.IsActive
                });
            }

            return result;
        }

        private IEnumerable<BudgetPeriodDto> GetBudgetPeriodDtoListByBudgetPeriods(IEnumerable<BudgetPeriod> budgetPeriods)
        {
            var result = new List<BudgetPeriodDto>();

            foreach (var budgetPeriod in budgetPeriods)
            {
                result.Add(new BudgetPeriodDto
                {
                    ValidFrom = budgetPeriod.ValidFrom,
                    ValidTo = budgetPeriod.ValidTo,
                    IsActive = budgetPeriod.IsActive,
                    BudgetPeriodCategories = GetBudgetPeriodCategoryDtoListByBudgetPeriodCategories(budgetPeriod.BudgetPeriodCategories).ToList()
                });
            }

            return result;
        }

        private IEnumerable<BudgetPeriodCategoryDto> GetBudgetPeriodCategoryDtoListByBudgetPeriodCategories(IEnumerable<BudgetPeriodCategory> budgetPeriodCategories)
        {
            var result = new List<BudgetPeriodCategoryDto>();

            foreach (var budgetPeriodCategory in budgetPeriodCategories)
            {
                result.Add(new BudgetPeriodCategoryDto
                {
                    CategoryId = budgetPeriodCategory.CategoryId,
                    MaxValue = budgetPeriodCategory.MaxValue,
                    IsActive = budgetPeriodCategory.IsActive
                });
            }

            return result;
        }

        private Task<BudgetRangeInfo> GetBudgetRangeInfo(DateTime budgetValidFrom, DateTime budgetValidTo, IEnumerable<BudgetPeriodDto> periods)
        {
            var isMonthlyRange = false;
            var isWeeklyRange = false;
            var isPeriodWeeklyRange = false;
            int? budgetDays = null;
            IEnumerable<int> periodDays = null;

            if (budgetValidFrom >= budgetValidTo)
            {
                throw new ArgumentException("budgetValidFrom should be earlier than budgetValidUntil");
            }

            int yearDifference = budgetValidTo.Year - budgetValidFrom.Year;
            int monthDifference = budgetValidTo.Month - budgetValidFrom.Month;

            if (yearDifference == 1 && budgetValidFrom.Month == 12 && budgetValidTo.Month == 1 && budgetValidFrom.Day == budgetValidTo.Day)
            {
                isMonthlyRange = true;
            }

            if (yearDifference == 0 && monthDifference == 1 && budgetValidFrom.Day == budgetValidTo.Day)
            {
                isMonthlyRange = true;
            }

            if (!isMonthlyRange)
            {
                TimeSpan difference = budgetValidTo - budgetValidFrom;

                if (difference.TotalDays == 7)
                {
                    isWeeklyRange = true;
                }
            }

            if (!isMonthlyRange && !isWeeklyRange)
            {
                TimeSpan difference = budgetValidTo.Date - budgetValidFrom.Date;
                budgetDays = (int)difference.TotalDays;
            }

            if (isMonthlyRange || isWeeklyRange)
            {
                if (periods.Count() == 1)
                {
                    TimeSpan difference = periods.Single().ValidTo - periods.Single().ValidFrom;
                    isPeriodWeeklyRange = difference.TotalDays == 7;
                }
                else
                {
                    var somePeriodIsNotWeekley = false;
                    foreach(var period in periods.Take(periods.Count() - 1))
                    {
                        TimeSpan difference = period.ValidTo - period.ValidFrom;
                        if (difference.TotalDays != 7)
                        {
                            somePeriodIsNotWeekley = true;
                        }
                    }
                    isPeriodWeeklyRange = !somePeriodIsNotWeekley;
                }
            }

            if (!isPeriodWeeklyRange)
            {
                if (periods.Count() > 1)
                {
                    var periodDaysList = new List<int>();
                    foreach (var period in periods.Take(periods.Count() - 1))
                    {
                        TimeSpan difference = period.ValidTo - period.ValidFrom;
                        periodDaysList.Add((int)difference.TotalDays);
                    }
                    periodDays = periodDaysList.AsEnumerable();
                }
            }

            var budgetRangeInfo = new BudgetRangeInfo
            {
                IsMonthlyRange = isMonthlyRange,
                IsWeeklyRange = isWeeklyRange,
                BudgetDays = budgetDays,
                IsPeriodWeeklyRange = isPeriodWeeklyRange,
                PeriodDays = periodDays
            };

            return Task.FromResult(budgetRangeInfo);
        }

        private string GetUniqueBudgetName(DateTime validFrom, UserBudgetsInfo budgetInfo)
        {
            int version = 2;
            string budgetName = $"{validFrom.Year}-{validFrom.Month.ToString().PadLeft(2, '0')}";

            while (budgetInfo.Budgets.Any(budget => budget.Name == budgetName))
            {
                budgetName = $"{budgetName}v{version}";
                version++;
            }

            return budgetName;
        }

        private IEnumerable<BudgetCategoryDto> GetClonedBudgetCategories(IEnumerable<BudgetCategoryDto> budgetCategories)
        {
            var clonedBudgetCategories = new List<BudgetCategoryDto>();

            foreach (var budgetCategory in budgetCategories)
            {
                var clonedBudgetCategory = new BudgetCategoryDto
                {
                    CategoryId = budgetCategory.CategoryId,
                    MaxValue = budgetCategory.MaxValue,
                    IsActive = budgetCategory.IsActive
                };

                clonedBudgetCategories.Add(clonedBudgetCategory);
            }

            return clonedBudgetCategories;
        }

        private IEnumerable<BudgetPeriodDto> GetClonedBudgetPeriods(IEnumerable<Tuple<DateTime, DateTime>> periodDatePairs, IEnumerable<BudgetCategoryDto> budgetCategories, IEnumerable<BudgetPeriodDto> rootBudgetPeriods)
        {
            if (rootBudgetPeriods.Count() == periodDatePairs.Count())
            {
                var budgetPeriods = new List<BudgetPeriodDto>();

                for (int i = 0; i < rootBudgetPeriods.Count(); i++)
                {
                    var rootBudgetPeriod = rootBudgetPeriods.ElementAt(i);
                    var periodDatePair = periodDatePairs.ElementAt(i);

                    var budgetPeriod = new BudgetPeriodDto
                    {
                        IsActive = true,
                        ValidFrom = periodDatePair.Item1,
                        ValidTo = periodDatePair.Item2,
                        BudgetPeriodCategories = rootBudgetPeriod.BudgetPeriodCategories.ToList().Select(x => new BudgetPeriodCategoryDto { IsActive = true, CategoryId = x.CategoryId, MaxValue = x.MaxValue } ).ToList()
                    };

                    budgetPeriods.Add(budgetPeriod);
                }
                
                return budgetPeriods;
            }

            if (rootBudgetPeriods.Count() > periodDatePairs.Count())
            {
                var budgetPeriods = new List<BudgetPeriodDto>();

                for (int i = 0; i < periodDatePairs.Count(); i++)
                {
                    var rootBudgetPeriod = rootBudgetPeriods.ElementAt(i);
                    var periodDatePair = periodDatePairs.ElementAt(i);

                    var budgetPeriod = new BudgetPeriodDto
                    {
                        IsActive = true,
                        ValidFrom = periodDatePair.Item1,
                        ValidTo = periodDatePair.Item2,
                        BudgetPeriodCategories = rootBudgetPeriod.BudgetPeriodCategories.ToList().Select(x => new BudgetPeriodCategoryDto { IsActive = true, CategoryId = x.CategoryId, MaxValue = x.MaxValue }).ToList()
                    };

                    budgetPeriods.Add(budgetPeriod);
                }

                var excessRootBudgetPeriods = rootBudgetPeriods.Skip(periodDatePairs.Count());
                var categorySums = excessRootBudgetPeriods
                    .SelectMany(period => period.BudgetPeriodCategories)
                    .GroupBy(category => category.CategoryId)
                    .ToDictionary(
                        group => group.Key,
                        group => group.Sum(category => category.MaxValue)
                    );

                foreach (var categorySum in categorySums)
                {
                    var extraCategoryValue = Math.Round(categorySum.Value / periodDatePairs.Count(), 2);
                    foreach (var period in budgetPeriods)
                    {
                        var budgetPeriodCategory = period.BudgetPeriodCategories.Single(x => x.CategoryId == categorySum.Key);
                        budgetPeriodCategory.MaxValue += extraCategoryValue;
                    }
                }

                AdjustCategoryValues(budgetPeriods, budgetCategories);

                return budgetPeriods;
            }

            if (rootBudgetPeriods.Count() < periodDatePairs.Count())
            {
                var budgetPeriods = new List<BudgetPeriodDto>();

                for (int i = 0; i < rootBudgetPeriods.Count(); i++)
                {
                    var rootBudgetPeriod = rootBudgetPeriods.ElementAt(i);
                    var periodDatePair = periodDatePairs.ElementAt(i);

                    var budgetPeriod = new BudgetPeriodDto
                    {
                        IsActive = true,
                        ValidFrom = periodDatePair.Item1,
                        ValidTo = periodDatePair.Item2,
                        BudgetPeriodCategories = rootBudgetPeriod.BudgetPeriodCategories.ToList().Select(x => new BudgetPeriodCategoryDto { IsActive = true, CategoryId = x.CategoryId, MaxValue = x.MaxValue }).ToList()
                    };

                    budgetPeriods.Add(budgetPeriod);
                }

                var excessPeriodDatePairs = periodDatePairs.Skip(rootBudgetPeriods.Count());
                var averagedPeriodCategoryValues = budgetCategories.Select(x => new Dictionary<int, decimal>
                    {
                        { x.CategoryId, Math.Round(x.MaxValue / periodDatePairs.Count(), 2) }
                    })
                    .ToList();

                foreach (var excessPeriodDatePair in excessPeriodDatePairs)
                {
                    var rootBudgetPeriod = rootBudgetPeriods.First();
                    var budgetPeriod = new BudgetPeriodDto
                    {
                        IsActive = true,
                        ValidFrom = excessPeriodDatePair.Item1,
                        ValidTo = excessPeriodDatePair.Item2,
                        BudgetPeriodCategories = rootBudgetPeriod.BudgetPeriodCategories
                            .Select(x =>
                                new BudgetPeriodCategoryDto
                                {
                                    IsActive = true,
                                    CategoryId = x.CategoryId,
                                    MaxValue = averagedPeriodCategoryValues.Single(dic => dic.ContainsKey(x.CategoryId))[x.CategoryId]
                                })
                            .ToList()
                    };
                    budgetPeriods.Add(budgetPeriod);
                }

                ProportionallyAdjustCategoryValues(budgetPeriods, budgetCategories);

                AdjustCategoryValues(budgetPeriods, budgetCategories);

                return budgetPeriods;
            }

            throw new Exception($"Can not return data from {nameof(GetClonedBudgetPeriods)}");
        }

        private void AdjustCategoryValues(IEnumerable<BudgetPeriodDto> budgetPeriods, IEnumerable<BudgetCategoryDto> budgetCategories)
        {
            var categorySums = budgetPeriods
                    .SelectMany(period => period.BudgetPeriodCategories)
                    .GroupBy(category => category.CategoryId)
                    .ToDictionary(
                        group => group.Key,
                        group => group.Sum(category => category.MaxValue)
                    );

            foreach (var categorySum in categorySums)
            {
                var budgetCategory = budgetCategories.Single(x => x.CategoryId == categorySum.Key);
                var difference = budgetCategory.MaxValue - categorySum.Value;
                if (difference > 0)
                {
                    var firstBudgetPeriod = budgetPeriods.First();
                    var firstBudgetPeriodCurrentCategory = firstBudgetPeriod.BudgetPeriodCategories.Single(x => x.CategoryId == categorySum.Key);
                    firstBudgetPeriodCurrentCategory.MaxValue += difference;
                }
                else if (difference < 0)
                {
                    difference = Math.Abs(difference);
                    foreach (var budgetPeriod in budgetPeriods)
                    {
                        var currentCategory = budgetPeriod.BudgetPeriodCategories.Single(x => x.CategoryId == categorySum.Key);
                        var maxValueToDeduct = Math.Min(currentCategory.MaxValue, difference);
                        currentCategory.MaxValue -= maxValueToDeduct;
                        difference -= maxValueToDeduct;

                        if (difference == 0)
                        {
                            break;
                        }
                    }
                }
            }
        }

        private void ProportionallyAdjustCategoryValues(IEnumerable<BudgetPeriodDto> budgetPeriods, IEnumerable<BudgetCategoryDto> budgetCategories)
        {
            var categorySums = budgetPeriods
                    .SelectMany(period => period.BudgetPeriodCategories)
                    .GroupBy(category => category.CategoryId)
                    .ToDictionary(
                        group => group.Key,
                        group => group.Sum(category => category.MaxValue)
                    );

            foreach (var categorySum in categorySums)
            {
                var budgetCategory = budgetCategories.Single(x => x.CategoryId == categorySum.Key);
                var difference = budgetCategory.MaxValue - categorySum.Value;

                if (difference < 0)
                {
                    var diffPerPeriod = Math.Round(difference / budgetPeriods.Count(), 2);
                    foreach (var budgetPeriod in budgetPeriods)
                    {
                        var currentBudgetPeriodCategory = budgetPeriod.BudgetPeriodCategories.Single(x => x.CategoryId == categorySum.Key);
                        currentBudgetPeriodCategory.MaxValue += diffPerPeriod;
                    }
                }
            }

            bool anyNegativeMaxValue = budgetPeriods
                .SelectMany(period => period.BudgetPeriodCategories)
                .Any(category => category.MaxValue < 0);

            if (anyNegativeMaxValue)
            {
                var negativeCategories = budgetPeriods
                    .SelectMany(period => period.BudgetPeriodCategories)
                    .Where(category => category.MaxValue < 0)
                    .ToList();

                var positiveCategories = budgetPeriods
                    .SelectMany(period => period.BudgetPeriodCategories)
                    .Where(category => category.MaxValue >= 0)
                    .ToList();

                negativeCategories.Sort((x, y) => Math.Abs(x.MaxValue).CompareTo(Math.Abs(y.MaxValue)));

                foreach (var negativeCategory in negativeCategories)
                {
                    while (negativeCategory.MaxValue < 0)
                    {
                        var positiveCategory = positiveCategories.LastOrDefault();

                        if (positiveCategory == null)
                            break;

                        var decreaseAmount = Math.Min(Math.Abs(negativeCategory.MaxValue), positiveCategory.MaxValue);
                        negativeCategory.MaxValue += decreaseAmount;
                        positiveCategory.MaxValue -= decreaseAmount;

                        if (positiveCategory.MaxValue == 0)
                            positiveCategories.Remove(positiveCategory);
                    }
                }
            }
        }

        #endregion
    }
}