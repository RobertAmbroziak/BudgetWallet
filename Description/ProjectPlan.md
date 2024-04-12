# Obszary do zmian i rozbudowy

## Wydatki

Będąc na karcie Aplikacja widzimy 3 przyciski. Wstępna ich nazwy to wydatki, dodaj i konfiguracja. Temat dotyczy wszystkiego co jest pod przyciskiem WYDATKI.

Na dzień 17-03 mam pod tym przyciskiem filtr do wyszukiwania splitów oraz pokazania po tym filtrze rekordów w tabeli. Splity to składowa transferu/wydatku, który możemy rozdzielić na poszczególne kategorie budżetowe.

1. Zmiany w filtrze
Chyba lista kategorii i kont nie powinny być po brana tylko po UserId czy nawet po UserId + IsActive = true. Powinna być zależna od wybranego budżetu. Czyli bierzemy tylko te konta, które mają jakieś transfery w danym budżecie i tylko te kategorie, które mają BudgetCategory w danym budżecie. To się wiąże z tym, że zmiana budżetu w filtrze, powinna przeładowywać również listę kategorii i kont a nie jak obecnie tylko listę BudgetPeriods. Mimo że jakieś konto lub kategoria jest już nieaktywna i nie może zostać użyta do nowych transferów i splitów, mogą już istnieć transfery i splity, które ich używały.

2. Zmiany w tabeli splitów
Obecnie jest to bardzo statyczna tabela bez żadnych interakcji.
- dodać toolTipy, który wyświetli Description po najechaniu na nazwę transferu, splitu, konta lub kategorii
- dodać ikonkę EDIT, której kliknięcie w miejscu rekordu ze splitem pokaże mały jedno liniowy formularz edycji splitu.
  - w formularzu będą aktywne 2 pola tekstowe do zmiany nazwy i opisu oraz dropDown do zmiany kategorii z listy BudgetCategories danego budżetu. Będzie przycisk ZAPISZ do zapisu zmian. Kliknięcie zamknie formularz, zmiany zostaną wysłane do Api, a rekord zostanie zaktualizowany.
  - w tym formularzu będzie też przycisk EDYTUJ TRANSFER, który otworzy dodatkowy formularz, w którym pojawi się lista wszystkich splitów w ramach Transferu. Zarówno bieżący jak i pozostałe. Będzie można na nim zmienić wartość dowolnego splitu. Dodać nowy lub usunąć istniejący ( z warunkiem, że musi zostać minimum 1 ). Dodatkowo będzie pokazana wartość transferu i aktualna wartość splitów w tym transferze wraz z alertem/kolorem gdy nie są zgodne. Będzie również przycisk ZAPISZ do zapisu tych zmian. Będzie on jednak aktywny tylko wtedy gdy suma wartości splitów i wartość transferu są równe. Kliknięcie w ZAPISZ zamknie oba formularze, zapisze dane przez API i odświeży tabelkę na poziomie zarówno bieżącego splitu jak i innych w transferze.
  - można też tu będzie zmienić nazwę, opis i konto transferu. Konto jako DropDown aktywnych kont. Dodatkowo DatePicker z możliwością zmiany daty transferu ale z walidacją czy data nie wykracza poza zakres obecnego budżetu. Oczywiście również możliwa będzie zmiana wartości. Wspomniany przycisk ZAPISZ będzie jednak aktywny dopiero w momencie zgodności tej wartości z sumą wartości ze splitów na tym transferze.
 - dodatkowa kolumna Procent z wartością widoczną tylko jeśli nie użyliśmy filtra kont. - ZREALIZOWANE 27-03
	-  dynamicznie wyliczany procent w tej kolumnie będzie trochę skomplikowany. Chcę tu pokazywać przyrostowy procent wydatków vs założenia budżetowe. Przykład: mamy 5 rekordów spitów, posortowane po dacie transferu z nadanym kolejno numerem order. Załóżmy że mamy ustawiony filtr na Budget A, BudgetPeriod B i Category C. BudgetPeriodCategory wynosi 100 zł. wszystkie te splity mają wartość 10 zł. Chcę pokazać na tych 5 rekordach kolejno 10%, 20%, 30%, 40%, 50%. Dodać tooltip, który wyświetli info o tym co aktualnie ten procent oznacza, np. nazwę budżetu, okresu budżetowego i kategorii albo tylko budżetu i kategorii. Procent będzie miał też kolor (zielony jeśli jest daleko do granicy budżetu, pomarańczowy jeśli się zbliżamy i czerwony jeśli przekroczony) - ZREALIZOWANE NA BE 27-03
3. Podsumowanie wartości
	Nad tabelką powinna być wartość wynikająca z obecnie ustawionego filtra - ZREALIZOWANE NA BE 27-03
-  jeśli nie mamy filtra po koncie to suma wartości rekordów / wartość lub suma wartości BudgetCategory lub BudgetPeriodCategory i wyliczony w ten sposób procent np. 1520 / 2500   60,8% z kolorem (zielony, pomarańczowy lub czerwony) podkreślającym sytuację
- jeśli używamy filtrowania po konkretnym koncie to pokazywanie wartości nie ma sensu i wtedy jakiś zastępczy tekst z info

4. Wykres
	graficzna prezentacja aktualnej sytuacji wynikającej z filtra i tabeli splitów. Podobnie jak w wielu innych przypadkach, filtracja po koncie nie wygeneruje wykresu a zastępcze info lub grafikę. W innym wypadku będzie on budowany w następujący sposób:
 - bierzemy cały okres Budget lub pojedynczy BudgetPeriod jeśli został wybrany w filtrze i dzielimy go na ilość dni, które zostaną zaprezentowane na osi X (np. 31 dni lub 7)
 - oś Y reprezentuje wartość wydatków w ramach danego budżetu, okresu budżetowego, kategorii budżetowej lub kategorii okresu budżetowego. Np. jest to 600 zł. Rysujemy prostą linię od 0 do 600 wzdłuż osi X
 - bierzemy splity prezentowane w tabelce. Zakładamy że są posortowane po dacie i mają też przydzielony order. i ustalamy na każdy dzień przyrostową sumę wydatków. Powstanie wykres liniowy (zaokrąglony) i pokazujemy go jako drugą linię na wykresie. Widzimy jak rosną nasze wydatki kiedy przebijają linię zakładanego trendu.
 
## Dodaj
To drugi przycisk w górnej części karty Aplikacja. Służy do dodawania nowego transferu ( głównie wydatku ) wraz z ustawionymi splitami

1. Dodawanie nowego transferu
- Chyba nie ma sensu dawać tu możliwości edycji czy usuwania transferu. Te operacje odbywają się już na tabeli splitów i zostały opisane w poprzednim punkcie.
- Pojawi się formularz z polami tekstowymi pod nazwę , opis i wartość oraz DatePicer do wybrania daty.
- Będzie też DropDown z wyborem budżetu z listy, domyślnie ustawiony na bieżący Budżet (na podstawie aktualnej daty)
- Będą też pomocnicze przyciski (5 lub 7) wynikające ze zdefiniowanej tabeli TransferTemplate, które pozwolą automatycznie uzupełnić nazwę i opis transferu na podstawie takiego template np. klikając w L dostaniemy Lidl-15-03
- Datapicker zawsze domyślnie dostanie bieżącą datę, ale oczywiście z możliwością zmiany
- Poniżej będzie lista splitów. Domyślnie zawsze powstanie 1 a wyżej przycisk DODAJ NOWY SPLIT
  - każdy split będzie miał pole tekstowe na nazwę, opis, wartość i DropDown z kategorią
  - będzie też ikonka do usuwania splitu
  - będzie widoczny sumator wartości splitów i obok wartość transferu. Tylko jeśli są zgodne, będzie można kliknąć w przycisk ZAPISZ, który utworzy nowy transfer wraz ze splitami
  - w każdym momencie można wyjść z procesu tworzenia transferu. Jeśli jednak stworzymy  i zapiszemy nowy to formularz się wyczyści i będzie można dodać kolejny od nowa
  - zapis jak również błąd zapisu warto potwierdzić jakimś monitem

## Konfiguracja
To trzeci przycisk w górnej części karty Aplikacja. Służy do ustawiania swojej aplikacji. Tworzenia oraz modyfikowania budżetów, okresów, kont, kategorii, i templatów - ZROBIONE CZĘŚCIOWO (Konta, Kategorie)

1. Pomoc w pierwszym stworzeniu konfiguracji
   Zaraz po utworzeniu konta, użytkownik nie ma pustą aplikację. Żadnych zdefiniowanych kont, budżetów, kategorii itp. Mozolne byłoby tworzenie wszystkiego samemu i dodawanie rekord po rekordzie. Będzie możliwość skorzystania z jakiś zdefiniowanych propozycji.
  - osobno dla obszarów konta, kategorie, budżety można skorzystać z przycisków KLONUJ DOMYŚLNE, który wylistuje propozycję kategorii, kont lub budżetów. Oczywiście wszystko można samemu zmodyfikować, usunąć lub dodać własne. Dopiero ostatecznie zdefiniowaną listę przyciskiem ZAPISZ wyślemy do API. Więcej w temacie w kolejnym punkcie omawiającym edycję istniejących elementów oraz klonowanie poprzednich budżetów. Klonowanie domyślnych jest podobne do klonowania z poprzedniego budżetu - ZROBIONE CZĘŚCIOWO (default tak, klonowanie nie )
 
2. Dodawanie i Klonowanie elementów
- BUDŻET - możesz utworzyć nowy ręcznie. nie musi posiadać BudgetPeriods ani BudgetCategories ale wszystkie te elementy będą dostępne w ramach drzewiastego złożonego formularza.
  -  możesz uzupełnić taki formularz albo klikając w KLONUJ DOMYŚLNE,  albo KLONUJ OSTATNIE ( lub też klonuj wybrany, po wskazaniu w DropDown jakiegoś istniejącego budżetu )
  - walidator nie pozwoli na stworzenie budżetu o zakresie dat nachodzącym na inny budżet użytkownika ani na dodanie BudgetPeriods, których zakresy nie będą ciągłe lub wykroczą poza zakres budżetu
  - dodanie BudgetCategores i BudgetPeriodCategories nie jest konieczne, ale ich brak mocno zaburzy sens aplikacji, dlatego chyba dodać trzeba walidator, który sprawdzi czy budget ma wszystkie aktywne na dany moment kategorie w BudgetCategories. Podobnie odnośnie każdego BudgetPeriod czy ma wszystkie BudgetPeriodCategories. Co najwyżej mogą mieć zdefiniowaną wartość na 0.
  - proces kończymy przyciskiem ZAPISZ
- KATEGORIE - możesz zawsze dodać nową kategorię wypełniając tylko nazwę i opis, KLONUJ DOMYŚLNE zadziała tylko jeśli jeszcze nie masz żadnych kategorii, ewentualnie sklonuje tylko to o nazwach innych niż istniejące na danym użytkowniku - ZROBIONE
- KONTO - podobnie jak kategorie - ZROBIONE
- TEMPLATY TRANSFERÓW - podobnie jak kategorie, ale dodatkowy warunek jest taki że może być ich maksymalnie 5 lub 7, więc klon nigdy nie przekroczy tej liczby
- dodanie nowej kategorii w trakcie trwania budżetu powinno utworzyć automatycznie BudgetCategory i BudgetPeriodCategories z wartością 0. - POMINIĘTE

3. Edycja i Usuwanie (Dezaktywacja)
- BUDŻET - możesz zmienić jego nazwę i opis, a zakres dat tylko jeśli nie istnieje jeszcze żaden transfer w danym budżecie, który by miał inną datę niż nowy zakres. BudgetPeriods można zawsze swobodnie edytować wraz z datami, oczywiście z zachowaniem warunku ciągłości zakresów i tego aby nie przekraczały granic zakresu budżetu. W BudgetCategories i BudgetPeriodCategories można dowolnie zmieniać wartość. Dodawanie, usuwanie tych elementów ogranicza walidacja jak przy dodawaniu. Muszą istnieć te elementy dla wszystkich aktywnych kategorii. - ZROBIONE (trochę inaczej niż w pierwotnym założeniu)
- KATEGORIE - możesz zawsze zmienić nazwę i opis oraz dezaktywować kategorię - ZROBIONE
- KONTO - możesz zawsze zmienić nazwę , opis i minimalną wartość oraz dezaktywować konto - ZROBIONE
- TEMPLATY TRANSFERÓW - możesz zawsze dezaktywować lub edytować istniejący template

## Serwis Mailowy
Przede wszystkim jest potrzebny do potwierdzania kont zakładanych w aplikacji oraz potwierdzania zmiany hasła. Chce jednak dodać również dodatkowy projekt oparty o HangFire wysyłający raporty, podsumowania, pochwały, ostrzeżenia do użytkowników w oparciu o ich wydatki.

## Logowanie
Mechanizm logowania i rejestracji użytkownika. Generalnie jest  już działający ale brakuje jeszcze kilku funkcjonalności
 - logowanie za pomocą FaceBook, Microsoft, GitHub na wzór istniejącego logowanie Google
 - mechanizm potwierdzania nowego konta
 - zmiana hasła
 - checkbox ZAPAMIĘTAJ, który będzie trzymał token w Storage przeglądarki, a jeśli jest odznaczony to w sesji i zostanie usunięty przy zamknięciu okna
 
## Refaktoryzacja
 - testy jednostkowe i integracyjne, również dla warstwy DAL z użyciem bazy InMemory lub testowej wskazanej z konfiguracji
 - porządek w nazewnictwie klas i serwisów oraz strukturze katalogów, w której się znajdują. Dotyczy BE i FE
 - refaktoryzacja struktury plików FE - obecnie przeroścnięte komponenty robiące wszystko
 - refaktoryzacja struktury klas i folderów BE - rozdzielenie ApplicationController i ApplicationService na mniejsze składowe
 - refaktoryzacja konfiguracji, tak aby nie trzymać danych w appsetting.json tylko dedykowanym pliku mającym odpowiednik klasowy. Dodatkowo być może opcjonalna integracja z AZURE KeyVault
 - refaktoryzacja klasy Startup dla Web Api
 - dodanie IsActive do bazowej klasy każdej tabeli oraz zmiana logiki pod to   - ZROBIONE
 - ustalenie jednego templatu React. Obecnie używam React MUI , MDB i 2 dodatkowe rozwiązania pod Toast i responsywną tabelę
 - context Api dla jwtToken. Obecnie przekazuje go pomiędzy komponentami, aby nie pobieraż ze Storage przeglądarki - ZROBIONE (do szerszych testów)

## Panel administracyjny
Obecnie nie mam pomysłu co może się tu znaleźć. Jest na to osobna karta w React Router i rola Admin w Claims.  Na początek jedyna funkcjonalność to możliwość nadania userowi roli Admin.