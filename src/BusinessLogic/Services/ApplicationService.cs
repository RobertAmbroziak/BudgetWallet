using BusinessLogic.Abstractions;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using DataAccessLayer;
using Model.Application;
using Model.Tables;

namespace BusinessLogic.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IApplicationRepository _applicationRepository;
        private readonly IIdentityService _identityService;

        public ApplicationService(IHttpContextAccessor httpContextAccessor, IConfiguration config, IApplicationRepository applicationRepository, IIdentityService identityService)
        {
            _httpContextAccessor = httpContextAccessor;
            _config = config;
            _applicationRepository = applicationRepository;
            _identityService = identityService;
        }

        public async Task<SplitsResponse> GetSplitsResponse(SplitsRequest splitsRequest)
        {
            /* 
               TODO:  nawet jeśli user jest uwierzytelniony to nie mamy pewności że pyta o swoje dane
               BudgetID to parametr który musi być podany, więc chyba wystarczy sprawdzić czy to ID należy do tego Usera
               reszta parametrów nie ma znaczenia, najwyżej nie zwrócimy danych jeśli konto, period czy kategoria będą nienależały do niego 
             */

            //var budget = await _applicationRepository.GetByIdAsync<BudgetDto>(splitsRequest.BudgetId);
            //var user = await _identityService.GetCurrentUser();

            //if (budget.UserId != user.Id)
            //{
            //    new BadHttpRequestException("Selected budget does not belong to the user.");
            //}

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
    }
}