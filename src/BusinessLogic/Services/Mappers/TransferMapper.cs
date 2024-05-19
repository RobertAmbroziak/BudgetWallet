using BusinessLogic.Abstractions;
using Model.Application;
using Model.Tables;
using Util.Enums;

namespace BusinessLogic.Services.Mappers
{
    public class TransferMapper : MapperServiceBase<TransferDto, Transfer>
    {
        public override Transfer Map(TransferDto source)
        {
            return new Transfer
            {
                Name = source.Name,
                Description = source.Description,
                BudgetId = source.BudgetId,
                TransferDate = source.TransferDate,
                Value = source.Value,
                TransferType = source.TransferType.ToString(),
                SourceAccountId = source.SourceAccountId,
                DestinationAccountId = source.DestinationAccountId,
                IsActive = source.IsActive,
            };
        }
    }
}
