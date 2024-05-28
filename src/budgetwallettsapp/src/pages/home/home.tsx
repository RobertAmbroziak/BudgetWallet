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
            Rejestracja i logowanie
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
            Konfiguracja kont i kategorii
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
            Konfiguracja budżetów
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
              doprowadzić do zgodności budżetu na poziomie kwot. Prawdopodobnie
              nie poradzi sobie obecnie z rozjechanymi datami czy różnicami w
              listach kategorii budżet vs. okres. To zostanie poprawione w
              przyszłości.
            </p>

            <p>
              Po zapisie budżetu, jeśli się powiedzie, zawsze można tu wrócić i
              dokonać dowolnych zmian.
            </p>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="accountState-content"
            id="accountState-header"
          >
            Stan kont i wewnętrzne transfery
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="expenses-content"
            id="expenses-header"
          >
            Wydatki
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="addExpense-content"
            id="addExpense-header"
          >
            Nowy wydatek
          </AccordionSummary>
          <AccordionDetails>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            malesuada lacus ex, sit amet blandit leo lobortis eget.
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
