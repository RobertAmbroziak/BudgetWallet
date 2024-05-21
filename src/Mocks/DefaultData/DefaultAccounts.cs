using Model.Application;

namespace Mocks.DefaultData
{
    public static class DefaultAccounts
    {
        private static readonly IEnumerable<Account> _defaultAccounts = new List<Account>
        {
            new Account { Name = "Konto prywatne", Description = "Konto z debetem w banku mBank", MinValue = -10000, IsActive = true },
            new Account { Name = "Konto firmowe", Description = "Konto firmowe PKOBP", MinValue = 0, IsActive = true },
            new Account { Name = "Karta mBank", Description = "Karta kredytowa mBank", MinValue = -10000, IsActive = true },
            new Account { Name = "Karta City", Description = "Karta kredytowa CityBank", MinValue = -10000, IsActive = true },
            new Account { Name = "Karta Revolut", Description = "Karta Revolut", MinValue = 0, IsActive = true },
            new Account { Name = "Konto oszczędnościowe", Description = "Konto oszczednościowe mBank", MinValue = 0, IsActive = true },
            new Account { Name = "Portfel", Description = "Gotówka w portfelu", MinValue = 0, IsActive = true },
            new Account { Name = "mPay", Description = "Zasilane konto na przejazdy komunikacyjne", MinValue = 0, IsActive = true },
            new Account { Name = "Karta Sodexo", Description = "Świąteczna karta podarunkowa", MinValue = 0, IsActive = true }
        };

        public static IEnumerable<Account> Get()
        {
            return _defaultAccounts;
        }
    }
}
