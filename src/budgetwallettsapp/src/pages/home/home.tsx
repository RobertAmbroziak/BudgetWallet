import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useLanguage } from "../../contexts/languageContext";
import translations from "../../translations";

import bwIcon1 from "../../assets/bwIcon1.webp";
import bwIcon2 from "../../assets/bwIcon2.webp";
import bwIcon3 from "../../assets/bwIcon3.webp";
import bwIcon4 from "../../assets/bwIcon4.webp";
import bwIcon5 from "../../assets/bwIcon5.webp";

function Home() {
  const { language } = useLanguage();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="auto"
        mt={2}
      >
        <Box
          sx={{
            maxWidth: 300,
            width: "100%",
            margin: "auto",
            mt: 1,
          }}
        >
          <Slider {...settings}>
            <Card>
              <CardMedia
                component="img"
                sx={{
                  width: "100%",
                  margin: "auto",
                }}
                image={bwIcon1}
                alt="image 1"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {translations[language].st_image1Desc}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardMedia
                component="img"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  width: "100%",
                  margin: "auto",
                }}
                image={bwIcon2}
                alt="image 2"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {translations[language].st_image2Desc}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardMedia
                component="img"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  width: "100%",
                  margin: "auto",
                }}
                image={bwIcon3}
                alt="image 3"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {translations[language].st_image3Desc}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardMedia
                component="img"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  width: "100%",
                  margin: "auto",
                }}
                image={bwIcon4}
                alt="image 4"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {translations[language].st_image4Desc}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardMedia
                component="img"
                sx={{
                  maxWidth: "100%",
                  height: "auto",
                  width: "100%",
                  margin: "auto",
                }}
                image={bwIcon5}
                alt="image 5"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {translations[language].st_image5Desc}
                </Typography>
              </CardContent>
            </Card>
          </Slider>
        </Box>
      </Box>
      <Box
        sx={{
          width: { xs: "95%", md: "80%" },
          margin: "auto",
        }}
      >
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="login-content"
            id="login-header"
          >
            {translations[language].st_label_login}
          </AccordionSummary>
          <AccordionDetails>
            <p>
              Aby zalogować się do aplikacji, użyj przycisku ZALOGUJ, który
              znajduje się po prawej stronie nagłówka. Jeśli korzystasz z
              aplikacji mobilnej, znajdziesz go pod ikoną hamburgera jako
              ostatnią pozycję w menu.
            </p>

            <p>
              Możesz zalogować się za pomocą ikon Google lub Facebook. Nawet
              jeśli nie posiadasz jeszcze konta, zostanie ono automatycznie
              utworzone przy pierwszym logowaniu. Możesz także zalogować się za
              pomocą wcześniej utworzonego konta aplikacyjnego, podając email
              lub nazwę użytkownika oraz hasło.
            </p>

            <p>
              Jeśli chcesz założyć konto aplikacyjne, kliknij ZAREJESTRUJ SIĘ.
              Podaj nazwę użytkownika, poprawny email i dwukrotnie hasło
              spełniające określone warunki (duża i mała litera, cyfra, znak
              specjalny i minimum 8 znaków). W razie problemów (np. niepoprawny
              email lub hasło nie spełniające warunków), zostaniesz o tym
              poinformowany. Jeśli rejestracja się powiedzie, zobaczysz monit w
              prawym górnym rogu aplikacji. Teraz możesz zalogować się używając
              ustawionego loginu/mailem i hasła.
            </p>

            <p>
              Uwaga: Konto aplikacyjne (np. na adres user@google.com), logowanie
              za pomocą konta Google na użytkownika user@google.com oraz
              logowanie za pomocą konta Facebook skojarzonego z adresem
              user@google.com to trzy różne konta.
            </p>

            <p>
              Obecnie założenie konta aplikacyjnego nie wymaga żadnego
              potwierdzenia. Niestety, również nie można zresetować/przypomnieć
              zagubionego hasła ani go zmienić. Te funkcjonalności pojawią się w
              przyszłości.
            </p>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="configuration-content"
            id="configuration-header"
          >
            {translations[language].st_label_accountConfig}
          </AccordionSummary>
          <AccordionDetails>
            <p>
              Po pierwszym zalogowaniu przejdź za pomocą przycisku Konfiguracja
              do modułu ustawień.
            </p>

            <p>
              Moduły konfiguracji kont i kategorii działają bardzo podobnie,
              dlatego opis będzie dotyczył tylko kont.
            </p>

            <p>
              Konta to źródła twoich zasobów finansowych (karty, konta bankowe,
              gotówka itp.). Możesz ręcznie dodać tu nowe konta za pomocą
              przycisku DODAJ KONTO i uzupełnić dane. Możesz dodać wiele kont,
              klikając kilkakrotnie w ten przycisk i usuwając zbędne konta za
              pomocą ikony kosza.
            </p>

            <p>
              Nazwa jest obowiązkowa, opis nie. Wartość minimalna oznacza dolny
              poziom dla danego konta. W większości przypadków będzie to 0, ale
              np. karty kredytowe mogą mieć wartość ujemną jako limit karty.
              Cały proces finalizujesz przyciskiem ZAPISZ.
            </p>

            <p>
              Po zapisie, w każdej chwili możesz tu wrócić. Dodać kolejne konta,
              zmodyfikować istniejące lub zdezaktywować (jak i przywrócić
              zdezaktywowane). Pomocny będzie checkbox Pokaż nieaktywne, który
              wyświetli na liście również konta nieaktywne. Zmiany oczywiście
              należy zapisać przyciskiem ZAPISZ.
            </p>

            <p>
              Dodatkowym helperem jest przycisk POBIERZ DOMYŚLNE, który pobierze
              zdefiniowaną na stałe propozycję kont. Nie są one zapisywane
              automatycznie. Przed finalnym zapisem możemy taką propozycję
              wyedytować.
            </p>

            <p>
              Konfiguracja kategorii działa bardzo podobnie. Kategorie to grupy
              naszych wydatków, np. Spożywcze, Opłaty, Paliwo itp. Pobranie
              domyślnych na pewno rozjaśni bardziej ten byt.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="budgetConfiguration-content"
            id="budgetConfiguration-header"
          >
            {translations[language].st_label_budgetConfig}
          </AccordionSummary>
          <AccordionDetails>
            <p>
              Konfiguracja budżetów wymaga krótkiego wstępu. Jako budżet
              rozumiemy pewien okres czasu, np. miesiąc, na który mamy
              zadysponowaną pewną kwotę. Taką kwotę należy rozdzielić na
              poszczególne budżetowe kategorie. Np. mamy 5000 zł na maj i
              ustalamy sobie, że na zakupy spożywcze wydamy 1000 zł, na opłaty
              1500 zł, a na kategorię Inne 2500 zł.
            </p>

            <p>
              Dany budżet możemy dodatkowo rozdzielić na budżetowe okresy. Np.
              nasz miesięczny budżet podzielić na okresy tygodniowe, żeby
              jeszcze bardziej dokładnie monitorować nasze wydatki i reagować
              ich ograniczeniem, jeśli w danym okresie mocno wykraczamy poza
              zakładany budżet na daną kategorię. Każdy budżetowy okres powinien
              być podzielony na dokładnie te same kategorie, co nasz budżet.
            </p>

            <p>
              Ustawienie pierwszego budżetu może być bardzo trudne i
              skomplikowane, dlatego również tutaj mamy pewien pomocnik w
              postaci przycisku POBIERZ DOMYŚLNE, który ustawi nam przykładowy
              budżet. Mechanizm skorzysta już z twoich zdefiniowanych kategorii,
              ale domyślnie utworzy budżet miesięczny na bieżący miesiąc z
              podziałem na tygodnie. Każda kategoria w ramach budżetu dostanie
              do dyspozycji stałą kwotę 500 zł. To wszystko oczywiście możemy
              zmodyfikować przed finalnym zapisem.
            </p>

            <p>
              Po kliknięciu pojawi się nowy rekord budżetu. Za pomocą ikony
              ołówka możemy wejść w jego szczegóły. Możemy zmienić nazwę, opis
              oraz zakres dat. Zauważ, że domyślny zakres jest od pierwszego
              dnia bieżącego miesiąca do pierwszego dnia kolejnego. Traktuj to
              jako zakres domknięty z lewej i otwarty z prawej, czyli np. od
              01-05 00:00 do 31-05 23:59:59:999.
            </p>

            <p>
              Rozwijając listę budżetowych kategorii, zobaczysz wszystkie swoje
              aktywne kategorie z przypisaną domyślną kwotą 500 zł. Rozwijając
              listę budżetowych okresów, zobaczysz podzielony miesiąc na
              tygodniowe przedziały. Zwróć uwagę, że okres zamyka się dokładnie
              tym samym dniem, co otwiera kolejny. Idąc głębiej i za pomocą
              ikonki ołówka wchodząc w konkretny okres, zobaczysz listę swoich
              aktywnych kategorii, ale z kwotą przydzieloną na ten konkretny
              okres, czyli prawdopodobnie nie 500 zł, a 100 zł. Do poprzedniego
              widoku wracamy przyciskiem POWRÓT.
            </p>

            <p>
              Cały czas ten budżet ze wszystkimi swoimi zależnościami jest tylko
              propozycją. Dopiero kliknięcie w ZAPISZ go trwale zapisze w bazie
              danych. Oczywiście możesz dodawać, modyfikować i usuwać budżetowe
              kategorie, zmieniać ich wartości. Podobnie z okresami i dodatkowo
              modyfikować ich daty. To samo na poziomie budżetowych okresowych
              kategorii.
            </p>

            <p>
              Niestety, najprawdopodobniej na początku taka zabawa totalnie
              rozjedzie spójność danego budżetu. Zobaczysz to, próbując go
              zapisać. Złożony walidator poinformuje cię o problemach, np. suma
              wartości z okresów dla danej kategorii nie będzie równa wartości
              na budżetową kategorię. Jeśli stracisz kontrolę nad modyfikacjami
              kwot, z pomocą przychodzi przycisk WYRÓWNAJ, który powinien
              doprowadzić do zgodności budżetu na poziomie kwot, dat i listy kategorii.
            </p>

            <p>
              Po zapisie budżetu, jeśli się powiedzie, zawsze można tu wrócić i
              dokonać dowolnych zmian.
            </p>

            <p>
              Dodatkowo ostatnia kolumna w liście naszych budżetów to ikona
              klonowania. Możemy sklonować wybrany budżet i wszelkie jego
              ustawienia na kolejny tożsamy okres. Kliknięcie od razu zapisuje
              nowy budżet w bazie danych, ale możemy do niego wrócić,
              zmodyfikować lub zdezaktywować.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="accountState-content"
            id="accountState-header"
          >
            {translations[language].st_label_accountStatus}
          </AccordionSummary>
          <AccordionDetails>
            <p>
              Stan kont to również miejsce, które warto odwiedzić na samym
              początku. Znajduje się tam kilka funkcjonalności, ale po kolei.
            </p>

            <p>
              W pierwszej rozwijanej belce Nowy (Wewnętrzny/Depozyt) Transfer
              możemy dodawać transfery pieniężne inne niż wydatki. Chodzi tu o
              wprowadzanie wpływów na nasze konta ze źródeł zewnętrznych
              (wypłaty, przelewy od znajomych itp.) oraz transfery pomiędzy
              własnymi kontami (wypłata z bankomatu, przelewy z konta firmowego
              na prywatne, spłaty kart kredytowych).
            </p>

            <p>
              Na początku warto zasilić swoje zdefiniowane konta inicjującą
              kwotą ze źródła zewnętrznego, tak aby ustawić na nich stan
              początkowy. Oczywiście później w tym miejscu również będzie można
              dodawać takie operacje. Moduł wymaga wybrania konta źródłowego
              (lub źródła zewnętrznego) i konta docelowego, podania nazwy
              przelewu (opis jest opcjonalny), kwoty i daty.
            </p>

            <p>
              Wszystkie te transfery będą widoczne w tabelce znajdującej się w
              belce Transfery, która wymaga dopracowania (formatowanie,
              sortowanie, stronicowanie, możliwość edycji).
            </p>

            <p>
              Druga belka w tym module, Stan kont, prezentuje tabelę z naszymi
              kontami oraz ich aktualnym stanem, który jest obliczany na
              podstawie wszystkich wydatków, transferów przychodzących i
              transferów pomiędzy kontami.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="expenses-content"
            id="expenses-header"
          >
            {translations[language].st_label_expenses}
          </AccordionSummary>
          <AccordionDetails>
            <p>
              Obszar wydatków rozpoczynamy od wybrania wartości na filtrze i
              kliknięcia w SZUKAJ. Musimy wybrać jeden z istniejących budżetów,
              a dodatkowo opcjonalnie możemy zawęzić prezentację danych o
              konkretny period, kategorię lub konto. Możemy również zastosować
              kombinację kilku opcji.
            </p>

            <p>
              Wynik tej filtracji pokaże się w trzech belkach. Pierwsza,
              Podsumowanie, to suma wydatków w stosunku do zakładanego budżetu
              oraz procentowy stosunek tych wartości. Te wartości zależą od
              ustawionego filtra. Mogą dotyczyć całego budżetu lub tylko pewnego
              jego okresu lub konkretnej kategorii. Druga to prosta
              reprezentacja graficzna w formie wykresu. Widzimy tam dwie linie.
              Pierwsza (obecnie prosta) to linia budżetu od zera do ustalonej
              wartości, druga reprezentuje już wydatki i pokazuje, jak rosły z
              różnym kątem nachylenia.
            </p>

            <p>
              Te belki nie pojawią się, jeśli filtrujemy po konkretnym koncie.
              Budżety nie są oparte o konkretne konta i nie dałoby się wyliczyć
              wartości budżetowej przy takim układzie filtra.
            </p>

            <p>
              Trzecia belka to tabela wszystkich wydatków w ramach wybranego
              filtra. Są one posortowane według daty, dlatego możemy tu pokazać
              też w ostatniej kolumnie rosnąco procent konsumpcji danego budżetu
              wynikającego z filtra. Ta kolumna pokaże 0 w przypadku filtracji
              po koncie z wyżej wspomnianych powodów. Pojedynczy rekord w tej
              tabeli to nie transfer, a podział. Mamy tu więc nazwę podziału i
              transferu oraz nazwę kategorii i konta, z którego wyszedł. Dalej
              jest data, wartość i wspomniany procent. Najeżdżając na nazwy, w
              formie tooltipa zobaczymy również opisy (podziału, transferu,
              kategorii czy konta), o ile zostały podane. Najeżdżając na wartość
              w pojedynczym rekordzie, w tooltipie zobaczymy wartość całego
              transferu. Dodatkowo odcień szarości grupuje rekordy podziałów w
              jeden transfer.
            </p>

            <p>
              W pierwszej kolumnie mamy ikonę ołówka, który pozwoli nam
              zmodyfikować wybrany podział, a właściwie cały transfer, którego
              jest częścią. Cały transfer wraz z podziałami otworzy się w oknie
              modalnym, a jego zawartość jest praktycznie identyczna jak w
              module do dodawania nowego wydatku. Możemy tu wszystko
              zmodyfikować, a nawet dezaktywować cały transfer. Zasady walidacji
              muszą być jednak zachowane. Należy pamiętać, że suma z podziałów
              musi się równać wartości na transferze. Walidator sprawdzi
              poprawność modyfikacji i najwyżej nie pozwoli na ich zapis. Zmiany
              od razu zostaną odzwierciedlone w tabeli, podsumowaniu i na
              wykresie.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="addExpense-content"
            id="addExpense-header"
          >
            {translations[language].st_label_newExpense}
          </AccordionSummary>
          <AccordionDetails>
            <p>
              Pod przyciskiem NOWY WYDATEK kryje się mechanizm, który będzie
              używany jako główny moduł do wprowadzania bieżących informacji do
              systemu. Tutaj rejestrujemy wszystkie nasze codzienne wydatki.
            </p>

            <p>
              W górnej części definiujemy bardziej ogólne informacje dotyczące
              transferu. Wybieramy budżet, w ramach którego nastąpił ten
              wydatek, konto źródłowe oraz jego nazwę (np. Lidl Poznań, 22-05).
              Opis, jak wszędzie w całej aplikacji, jest opcjonalny. Może nam
              pomóc i dostarczyć dodatkowych informacji, ale nigdy nie jest
              obowiązkowy. Podajemy wartość naszego transferu (np. rachunku za
              zakupy) oraz wybieramy jego datę.
            </p>

            <p>
              W dolnej części znajdują się szczegóły takiego transferu. To tutaj
              wskazujemy jedną lub więcej kategorii budżetowych, na które chcemy
              rozbić dany transfer. Jeśli robimy przelew za czynsz, to nasz
              transfer będzie miał jeden podział i jedną kategorię (np. Opłaty).
              Ale rachunek z hipermarketu możemy chcieć rozdzielić już na kilka
              kategorii (Spożywcze, Chemia, Alkohol).
            </p>

            <p>
              Zawsze mamy jeden domyślny podział pusty, ale po wybraniu w nim
              kategorii, wartość i opis ustawią się na podstawie wartości z
              transferu i nazwy kategorii. To oczywiście możemy zmienić. Dodając
              kolejne podziały, musimy już ręcznie zadbać, aby suma wartości z
              podziałów równała się wartości na transferze. Uzupełniony transfer
              wraz z podziałami możemy zapisać za pomocą przycisku ZAPISZ.
              Ewentualne błędy zostaną wyświetlone nad modułem. Jeśli wszystko
              się powiedzie, dostaniemy klasyczną informację w prawym górnym
              rogu ekranu.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="todo-content"
            id="todo-header"
          >
            {translations[language].st_label_toDo}
          </AccordionSummary>
          <AccordionDetails>
            <p>
              1. Możliwość potwierdzenia rejestracji, resetu hasła przez mail i
              zmiany hasła
            </p>
            <p>
              2. Ułatwienie wprowadzania wydatków poprzez implementację
              mechanizmu DefaultExpenses (kliknięcie w ikonkę tworzącą domyślny
              transfer na typowe wydatki)
            </p>
          </AccordionDetails>
        </Accordion>
      </Box>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default Home;
