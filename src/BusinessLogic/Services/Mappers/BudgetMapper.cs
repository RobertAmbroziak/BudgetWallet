using BusinessLogic.Abstractions;
using Model.Application;
using Model.Tables;

namespace BusinessLogic.Services.Mappers
{
    public class BudgetMapper : MapperServiceBase<BudgetDto, Budget>
    {
        public override Budget Map(BudgetDto source)
        {
            return new Budget
            {
                Id = source.Id,
                Name = source.Name,
                Description = source.Description,
                ValidFrom = source.ValidFrom,
                ValidTo = source.ValidTo
            };
        }
    }
}
