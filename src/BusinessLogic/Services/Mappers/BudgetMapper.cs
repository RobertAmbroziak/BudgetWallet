using BusinessLogic.Abstractions;
using Model.Application;
using Model.Tables;

namespace BusinessLogic.Services.Mappers
{
    public class BudgetMapper : IMapperService<BudgetDto, Budget>
    {
        public Budget Map(BudgetDto source)
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
