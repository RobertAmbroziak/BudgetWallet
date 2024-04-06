using Model.Application;

namespace Mocks.DefaultData
{
    public static class DefaultCategories
    {
        private static readonly IEnumerable<Category> _defaultCategories = new List<Category>
        {
            new Category { Name = "Opłaty", Description = "rachunki cykliczne, mieszkanie, ubezpieczenia, raty", IsActive  = true },
            new Category { Name = "Spożywcze", Description = "produkty spożywcze do domu, jedzenie na mieście", IsActive  = true },
            new Category { Name = "Kosmetyki", Description = "środki higieny osobistej, perfumy", IsActive  = true },
            new Category { Name = "Chemia", Description = "środki czystości, np. proszek do prania, płyn do naczyń", IsActive  = true },
            new Category { Name = "Dom i ogród", Description = "sprzęt do domu, agd", IsActive  = true },
            new Category { Name = "Odzież", Description = "ubrania, obuwie", IsActive  = true },
            new Category { Name = "Imprezy", Description = "koncerty, restauracje, kino", IsActive  = true },
            new Category { Name = "Paliwo", Description = "paliwo", IsActive  = true },
            new Category { Name = "Gadżety", Description = "elektronika, gry", IsActive  = true },
            new Category { Name = "Prezenty", Description = "wydatki związane z prezentami, kwiaty, datki", IsActive  = true },
            new Category { Name = "Alkohol", Description = "wydatki związane z alkoholem do domu", IsActive  = true },
            new Category { Name = "Inne", Description = "wszystkie inne niezdefiniowane", IsActive  = true },
        };

        public static IEnumerable<Category> Get()
        {
            return _defaultCategories;
        }
    }
}
