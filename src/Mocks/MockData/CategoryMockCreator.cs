using Model.Tables;

namespace Mocks.MockData
{
    public static class CategoryMockCreator
    {
        public static IEnumerable<CategoryDto> CreateCategories(int userId)
        {
            var categories = new List<CategoryDto>
            {
                new CategoryDto {UserId = userId, Name = "Opłaty", Description = "rachunki cykliczne, mieszkanie, ubezpieczenia , raty", IsActive  = true },
                new CategoryDto {UserId = userId, Name = "Spożywcze", Description = "produkty spożywcze do domu, jedzenie na mieście", IsActive  = true },
                new CategoryDto {UserId = userId, Name = "Kosmetyki", Description = "środki higieny osobistej, perfumy", IsActive  = true },
                new CategoryDto {UserId = userId, Name = "Chemia", Description = "środki czystości, proszek do prania, płyn do naczyń", IsActive  = true },
                new CategoryDto {UserId = userId, Name = "Dom i ogród", Description = "sprzęt do domu, agd", IsActive  = true },
                new CategoryDto {UserId = userId, Name = "Ubrania", Description = "odzież, obuwie", IsActive  = true },
                new CategoryDto {UserId = userId, Name = "Imprezy", Description = "alkohol, koncerty, resteuracje, kino", IsActive  = true },
                new CategoryDto {UserId = userId, Name = "Paliwo", Description = "paliwo", IsActive  = true },
                new CategoryDto {UserId = userId, Name = "Gadżety", Description = "elektronika, gry", IsActive  = true },
                new CategoryDto {UserId = userId, Name = "Prezenty", Description = "wydatki związane z prezentami, kwiaty, datki", IsActive  = true },
                new CategoryDto {UserId = userId, Name = "Inne", Description = "wszystkie inne niezdefiniowane", IsActive  = true },
            };

            return categories;
        }
    }
}
