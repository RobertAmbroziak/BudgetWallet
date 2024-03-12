using Model.Tables;

namespace Mocks.MockData
{
    public static class AccountMockCreator
    {
        public static IEnumerable<AccountDto> CreateAccounts(int userId)
        {
            return new List<AccountDto>
            {
                new AccountDto { UserId = userId, Name = "Konto prywattne", Description = "Konto z debetem w banku mBank", MinValue = -10000, IsActive = true },
                new AccountDto { UserId = userId, Name = "Konto firmowe", Description = "Konto firmowe PKOBP", MinValue = 0, IsActive = true },
                new AccountDto { UserId = userId, Name = "Karta mBank", Description = "Karta kredytowa mBank", MinValue = -6000, IsActive = true },
                new AccountDto { UserId = userId, Name = "Karta City", Description = "Karta kredytowa CityBank", MinValue = -10000, IsActive = true },
                new AccountDto { UserId = userId, Name = "Karta Revolut", Description = "Karta Revolut", MinValue = 0, IsActive = true },
                new AccountDto { UserId = userId, Name = "Konto oszczędnościowe", Description = "Konto oszczednościowe mBank", MinValue = 0, IsActive = true },
                new AccountDto { UserId = userId, Name = "Portfel", Description = "Gotówka w portfelu", MinValue = 0, IsActive = true },
                new AccountDto { UserId = userId, Name = "mPay", Description = "Zasilane konto na przejazdy komunikacyjne", MinValue = 0, IsActive = true }
            };
        }
    }
}
