using Model.Tables;

namespace Tests.Helpers
{
    public static class BudgetHelper
    {
        public static BudgetDto CreateBudgetDto()
        {

            var budgetCategories = new List<BudgetCategoryDto>
            {
                new BudgetCategoryDto
                {
                    Id = 1,
                    IsActive = true,
                    BudgetId = 1,
                    CategoryId = 1,
                    MaxValue = 177.33M,
                    Category = new CategoryDto
                    {
                        Id = 1,
                        IsActive = true,
                        UserId = 1,
                        Name = "Groceries"
                    }
                },
                new BudgetCategoryDto
                {
                    Id = 2,
                    IsActive = true,
                    BudgetId = 1,
                    CategoryId = 2,
                    MaxValue = 7.13M,
                    Category = new CategoryDto
                    {
                        Id = 2,
                        IsActive = true,
                        UserId = 1,
                        Name = "Fees"
                    }
                },
                new BudgetCategoryDto
                {
                    Id = 3,
                    IsActive = true,
                    BudgetId = 1,
                    CategoryId = 3,
                    MaxValue = 3.31M,
                    Category = new CategoryDto
                    {
                        Id = 3,
                        IsActive = true,
                        UserId = 1,
                        Name = "Fuel"
                    }
                },
                new BudgetCategoryDto
                {
                    Id = 4,
                    IsActive = false,
                    BudgetId = 1,
                    CategoryId = 4,
                    MaxValue = 1.31M,
                    Category = new CategoryDto
                    {
                        Id = 4,
                        IsActive = true,
                        UserId = 1,
                        Name = "Other"
                    }
                }
            };

            var budgetPeriods = new List<BudgetPeriodDto>
            {
                new BudgetPeriodDto
                {
                    Id = 1,
                    IsActive= true,
                    BudgetId= 1,
                    ValidFrom = new DateTime(2023,1,1),
                    ValidTo = new DateTime(2023,1,15),
                    BudgetPeriodCategories = new List<BudgetPeriodCategoryDto>
                    {
                        new BudgetPeriodCategoryDto
                        {
                            Id = 1,
                            IsActive = true,
                            BudgetPeriodId = 1,
                            CategoryId = 1,
                            MaxValue = 120,
                            Category = new CategoryDto
                            {
                                Id = 1,
                                IsActive = true,
                                UserId = 1,
                                Name = "Groceries"
                            }
                        },
                        new BudgetPeriodCategoryDto
                        {
                            Id = 2,
                            IsActive = true,
                            BudgetPeriodId = 1,
                            CategoryId = 2,
                            MaxValue = 2.12M,
                            Category = new CategoryDto
                            {
                                Id = 2,
                                IsActive = true,
                                UserId = 1,
                                Name = "Fees"
                            }
                        },
                        new BudgetPeriodCategoryDto
                        {
                            Id = 3,
                            IsActive = true,
                            BudgetPeriodId = 1,
                            CategoryId = 3,
                            MaxValue = 1.10M,
                            Category = new CategoryDto
                            {
                                Id = 3,
                                IsActive = true,
                                UserId = 1,
                                Name = "Fuel"
                            }
                        },
                        new BudgetPeriodCategoryDto
                        {
                            Id = 4,
                            IsActive = false,
                            BudgetPeriodId = 1,
                            CategoryId = 1,
                            MaxValue = 999.11M,
                            Category = new CategoryDto
                            {
                                Id = 1,
                                IsActive = true,
                                UserId = 1,
                                Name = "Groceries"
                            }
                        },
                    }
                },
                new BudgetPeriodDto
                {
                    Id = 2,
                    IsActive= true,
                    BudgetId= 1,
                    ValidFrom = new DateTime(2023,1,15),
                    ValidTo = new DateTime(2023,1,29),
                    BudgetPeriodCategories = new List<BudgetPeriodCategoryDto>
                    {
                        new BudgetPeriodCategoryDto
                        {
                            Id = 5,
                            IsActive = true,
                            BudgetPeriodId = 2,
                            CategoryId = 1,
                            MaxValue = 50,
                            Category = new CategoryDto
                            {
                                Id = 1,
                                IsActive = true,
                                UserId = 1,
                                Name = "Groceries"
                            }
                        },
                        new BudgetPeriodCategoryDto
                        {
                            Id = 6,
                            IsActive = true,
                            BudgetPeriodId = 2,
                            CategoryId = 2,
                            MaxValue = 0.01M,
                            Category = new CategoryDto
                            {
                                Id = 2,
                                IsActive = true,
                                UserId = 1,
                                Name = "Fees"
                            }
                        },
                        new BudgetPeriodCategoryDto
                        {
                            Id = 7,
                            IsActive = true,
                            BudgetPeriodId = 2,
                            CategoryId = 3,
                            MaxValue = 1.21M,
                            Category = new CategoryDto
                            {
                                Id = 3,
                                IsActive = true,
                                UserId = 1,
                                Name = "Fuel"
                            }
                        },
                        new BudgetPeriodCategoryDto
                        {
                            Id = 8,
                            IsActive = false,
                            BudgetPeriodId = 2,
                            CategoryId = 4,
                            MaxValue = 555.11M,
                            Category = new CategoryDto
                            {
                                Id = 4,
                                IsActive = true,
                                UserId = 1,
                                Name = "Other"
                            }
                        },
                    }
                },
                new BudgetPeriodDto
                {
                    Id = 3,
                    IsActive= true,
                    BudgetId= 1,
                    ValidFrom = new DateTime(2023,1,29),
                    ValidTo = new DateTime(2023,2,1),
                    BudgetPeriodCategories = new List<BudgetPeriodCategoryDto>
                    {
                        new BudgetPeriodCategoryDto
                        {
                            Id = 9,
                            IsActive = true,
                            BudgetPeriodId = 3,
                            CategoryId = 1,
                            MaxValue = 7.33M,
                            Category = new CategoryDto
                            {
                                Id = 1,
                                IsActive = true,
                                UserId = 1,
                                Name = "Groceries"
                            }
                        },
                        new BudgetPeriodCategoryDto
                        {
                            Id = 10,
                            IsActive = true,
                            BudgetPeriodId = 3,
                            CategoryId = 2,
                            MaxValue = 5,
                            Category = new CategoryDto
                            {
                                Id = 2,
                                IsActive = true,
                                UserId = 1,
                                Name = "Fees"
                            }
                        },
                        new BudgetPeriodCategoryDto
                        {
                            Id = 11,
                            IsActive = true,
                            BudgetPeriodId = 3,
                            CategoryId = 3,
                            MaxValue = 1,
                            Category = new CategoryDto
                            {
                                Id = 3,
                                IsActive = true,
                                UserId = 1,
                                Name = "Fuel"
                            }
                        },
                    }
                },
                new BudgetPeriodDto
                {
                    Id = 4,
                    IsActive= false,
                    BudgetId= 1,
                    ValidFrom = new DateTime(2023,1,1),
                    ValidTo = new DateTime(2023,1,8),
                    BudgetPeriodCategories = new List<BudgetPeriodCategoryDto>()
                }
            };

            var budgetDto = new BudgetDto
            {
                Id = 1,
                UserId =1,
                IsActive = true,
                Name = "2023-01",
                ValidFrom = new DateTime(2023, 1, 1),
                ValidTo = new DateTime(2023,2,1),
                BudgetCategories = budgetCategories,
                BudgetPeriods = budgetPeriods
            };

            return budgetDto;
        }
    }
}
