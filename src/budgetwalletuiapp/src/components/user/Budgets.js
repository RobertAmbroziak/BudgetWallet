import React from "react";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";

function Budgets({ jwtToken }) {
  const { language } = useLanguage();

  return (
    <>
      TODO: Budgets Configuration Panel
      {/* 
       W przeciwieństwie do Accounts i Categories - bardzo złożony mechanizm

        lista budżetów dla usera - początkowo pusta
        checkbox 1 pokaż nieaktywne
        - każdy rekord  ma textbox na Name i description do swobodnej zmiany
        aktywne można zdezaktywować , niekatywne jesli są widoczne dzięki checkbox 1 można przywrócić
        przycisk DODAJ
        przycisk ZAPISZ
        przycisk Pobierz DEFAULT
        
         Budget ma periody - aby zapisać musi mieć minimum 1, okresy periodów muszą pokrywać cały okres budżetu
         można im zmieniać name i desc
         
         każdy budżet musi mieć min 1 budget-Category z wartością > 0 , ale nie jest konieczne aby były wszystkie kategorie użyte
         zarówno tylko aktywne jak i wszystkie na danym userze

         jeśli budget ma dany rekord Budget-Category i istnieją budgetPeriods to każdy budgetPeriods też musi mieć budgetPeriodCategory
         tu wartość może być 0 ale ich suma musi być równa budgetCategory
         
         generalnie można swobodnie dodawać , dezaktywować zmieniać elementy Budget,Period Budget-Category i Period-Category
         ale zapis będzie możliwy jeśli przejdzie walidacje.

        AKTYWACJA ,DEZAKTYWACJA Budgetu czy innych elemntów będzie trzymana w stanie to i tak finalnie ZAPIS Validator na to pozwoli lub nie
      */}
    </>
  );
}

export default Budgets;