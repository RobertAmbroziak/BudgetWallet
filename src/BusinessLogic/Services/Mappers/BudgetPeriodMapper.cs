using BusinessLogic.Abstractions;
using Model.Application;
using Model.Tables;

namespace BusinessLogic.Services.Mappers
{
    public class BudgetPeriodMapper : MapperServiceBase<BudgetPeriodDto, BudgetPeriod>
    {
        public override BudgetPeriod Map(BudgetPeriodDto source)
        {
            return new BudgetPeriod
            {
                Id = source.Id,
                BudgetId = source.BudgetId,
                ValidFrom = source.ValidFrom,
                ValidTo = source.ValidTo,
                IsActive = source.IsActive
            };
        }
    }
}
