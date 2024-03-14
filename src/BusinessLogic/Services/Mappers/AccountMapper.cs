using BusinessLogic.Abstractions;
using Model.Application;
using Model.Tables;

namespace BusinessLogic.Services.Mappers
{
    public class AccountMapper : IMapperService<AccountDto, Account>
    {
        public Account Map(AccountDto source)
        {
            return new Account
            {
                Id = source.Id,
                Name = source.Name,
                Description = source.Description,
                MinValue = source.MinValue,
                IsActive = source.IsActive
            };
        }
    }
}
