import React from "react";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";

function Categories({ jwtToken }) {
  const { language } = useLanguage();

  return (
    <>
      TODO: Categories Configuration Panel
      {/* 
        BARDZO PODOBNY MECHANIZM JAK W ACCOUNT
        lista kategorii  dla usera - początkowo pusta
        checkbox 1 pokaż nieaktywne
        - każdy rekord  ma textbox na Name i description do swobodnej zmiany
        aktywne można zdezaktywować, niekatywne jeśli są widoczne dzięki checkbox 1 można przywrócić
        przycisk DODAJ
        przycisk ZAPISZ
        przycisk Pobierz DEFAULT
        Zapis zwaliduje czy nowo dodany nie istnieje, również w nieaktywnych - rzuci błąd albo aktywuje nieaktywny
        jeśli name i desc jest identyczne
        
        Zapis rzuci toastr, odświeży listę kategorii usera
        
        AKTYWACJA ,DEZAKTYWACJA odbywa się bez konieczności kliku w ZAPISZ - odświeży rekord
      
      */}
    </>
  );
}

export default Categories;