using BusinessLogic.Abstractions;
using Model.Application;
using Model.Tables;
using Util.Enums;

namespace BusinessLogic.Services.Mappers
{
    public class PostTransferMapper : MapperServiceBase<PostTransfer, TransferDto>
    {
        public override TransferDto Map(PostTransfer source)
        {
            var splits = new List<SplitDto>();

            foreach (var split in source.Splits)
            {
                splits.Add(new SplitDto
                {
                    CategoryId = split.CategoryId,
                    Name = split.Name,
                    Description = split.Description,
                    Value = split.Value,
                    IsActive = split.IsActive
                });
            }

            return new TransferDto
            {
                Name = source.Name,
                Description = source.Description,
                BudgetId = source.BudgetId,
                TransferDate = source.TransferDate,
                Value = source.Value,
                TransferType = (TransferType)Enum.Parse(typeof(TransferType), source.TransferType),
                SourceAccountId = source.SourceAccountId,
                DestinationAccountId = source.DestinationAccountId,
                IsActive = source.IsActive,
                Splits = splits
            };
        }
    }
}
