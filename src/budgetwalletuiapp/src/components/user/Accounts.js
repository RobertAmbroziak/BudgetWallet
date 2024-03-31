import React from "react";
import { useLanguage } from "../../LanguageContext";
import translations from "../../translations";

function Accounts({ jwtToken }) {
  const { language } = useLanguage();

  return (
    <>
      TODO: Accounts Configuration Panel
      {/* 
        lista kont  dla usera - początkowo pusta
        checkbox 1 pokaż nieaktywne
        - każdy rekord  ma textbox na Name i description do swobodnej zmiany
        aktywne można zdezaktywować, niekatywne jesli są widoczne dzięki checkbox 1 można przywrócić
        przycisk DODAJ
        przycisk ZAPISZ
        przycisk Pobierz DEFAULT
        Zapis zwaliduje czy nowo dodany nie istnieje, również w nieaktywnych - rzuci błąd albo aktywuje nieaktywny
        jeśli name i desc jest identyczne
        
        Zapis rzuci toastr, odświeży listę kont usera 
        
        AKTYWACJA ,DEZAKTYWACJA odbywa się bez konieczności kliku w ZAPISZ - odświeży rekord
      */}
    </>
  );
}

export default Accounts;
