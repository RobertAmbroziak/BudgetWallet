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

taki projekt mi wyszedł wstępnie:

<div style="text-align:center"><img src='./Description/Images/database_diagram.PNG' width='500'/></div>


## Makiety Front-end 

na razie pierwsza ogólna makieta, pokazująca listę splitów, czyli wydatków w ramach danego budżetu. 

<div style="text-align:center"><img src='./Description/Images/viewStats.PNG' width='400'/></div>

[Dziennik](/Description/DiaryReadme.md)


