[English](/Description/English/EnglishReadme.md)

# BudgetWallet
### webowa aplikacja do zarządzania budżetem domowym

<div style="text-align:center"><img src='./Description/Images/budget_wallet_icon_big.jpg' width='300'/></div>

## Pomysł / Idea

W ramach kontroli wydatków i zarządzania domowym budżetem próbowałem kilku z wielu dostępnych aplikacji, zarówno mobilnych, jak i webowych. Do tego również własnych i publicznych rozwiązań opartych na Excelu. Wszystkie one miały jednak jakieś wady: albo nie dostarczały oczekiwanych funkcjonalności, albo były zbyt rozdmuchane i skomplikowane. Rozwiązania oparte na arkuszach Excela, które najprościej i najszybciej można dostosować pod własne potrzeby, sprawdzają się raczej na dużych urządzeniach. Chcę spróbować stworzyć prostą, ale funkcjonalnością dopasowaną pod własną wizję tematu aplikację. Będzie to aplikacja webowa, ale mocno zorientowana na urządzenia mobilne. Ma być przede wszystkim prosta i przyjazna użytkownikowi.

## Wyzwania

* cały Front-End. Obecnie pracuję głównie z backendem. W swoim czasie sporo doświadczenia z MVC + jQuery, leciwym webforms, a ostatnio odrobinę z Blazor. W Reakcie raczkuję.
* kompleksowa autoryzacja. Jakoś nigdy nie musiałem się tym przejmować. Temat najczęściej z pudełka dostarczany w korporacyjnym nugecie lub innym rozwiązaniu architektów.

## Przewidywana technologia

* Web Api  - raczej w .Net 6 - chwilowo moje IDE nie bardzo jest gotowe na kolejną wersję LTS
* Entity Framework  - CodeFirst, Migracje
* czysta architektura (warstwowa) z wydzieleniem warstw do osobnych projektów
* aplikacja front raczej stworzona za pomocą create-react-app
* gotowe kontrolki od Material Design for Bootstrap 5 & React 18
* odrobinę react-router, ale głównie SPA oparte na prostych hookach useState/useEffect

## Encje

taki schemat bazy danych wyszedł mi po pierwszej analizie:

<div style="text-align:center"><img src='./Description/Images/database_diagram.PNG' width='500'/></div>

do tego 3 enumy:
```csharp
public enum Provider
{
	Application,
	Google
}

public enum TransferType
{
	Deposit,
	Withdrawal,
	InternalTransfer
}

public enum UserRole
{
	User,
	Admin
}
```

* Users - tabela userów z rolą
* RegisterConfirmations - pomocnicza tabela do procesu rejestracji i potwierdzeniu konta za pomocą maila
* Accounts - rozumiane jako np: konto prywatne, konto firmowe, konto oszczędnościowe, karta kretydota 1, portfel z gotówką, mPay, Revolut ...
* Categories - zdefiniowane kategorie wydatków np: opłaty, spożywcze, odzież, rozrywka, paliwo ...
* Transfers - głównie  wydatki ale również trasnfery z wpłatami na konto i transfery wewnętrzne pomiędzy kontami
* Splits - wyodrębniona część pojedynczego transferu np Biedronka-21-07 rozdzielona na kategorie : np spożywcze, chemia, alkohol
* Budgets - zdefiniowany pojedynczy okres budżetowy  np. miesiąc  Marzec -2024
* BudgetPeriods - ewentualne dodatkowe rozbicie budżetu na mniejsze okresy np tygodniowe, pomocny gdy pewne kategorie w ramach jednego budżetu Marrzec-2024 będą miały niesymetryczne obciążenie w tym okresie. np Opłaty to 90% pierwszy tydzień i 10% drugi, tydzień 3 i 4 nie zakłada wydatków.
* BudgetCategories - służy do definiowania limitów wydatków dla danej kategorii w ramach danego budżetu
* BudgetPeriodCategories - j.w. tylko można całomiesięczne wydatki na np. opłaty rozdzielić niesymetrycznie między periodami
* TransferTemplates - dodatkowy helper ułatwiający wprowadzanie wydatków przez usera
 


## Makiety Front-end 

1. Widok 1

<div style="text-align:center"><img src='./Description/Images/viewStats.PNG' width='400'/></div>

to podstawowy widok aplikacji. domyślnie ustawiony na Stats (2 pozostałe widoki w tym obszarze będą służyć do dodawania płatnośic i zarządzania ustawieniami)
Filtr Budget, Period, Account, Category zostanie wypełniony domyślnie ale można go zmieniać dropdownami
Pokazać ma się tu lista wydatków z uwzględnieniem ustawionego flitru, graficzna reprezentacja tych wydatków vs zakładany budżet oraz jakieś sumowanie tej tabeli
Monit filtrowanie po kontach dotyczy sytuacji kiedy w filtrze Account zamiast ALL wybierzemy jakieś konkretne konto. Wtedy to sumowanie nie do końca będzie miało sens. Trzeba to jakoś rozwiązać
Przyciski kolorowe obok CATEGORY to taki helper ułatwiający wybór jednej z 5 najbardziej popularnych kategorii bez dropDowna.




[Dziennik](/Description/DiaryReadme.md)


