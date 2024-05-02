import { useState } from "react";

function Home() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <h1>Strona Główna - {count}</h1>
      <p>
        strona ogólnie dostępna. Na ten moment zostawiam tu najbardziej epicką i
        efektowną funkcjonalność REACT. Można klikać do woli
      </p>
      <button onClick={() => setCount(count + 1)}>Magiczny Przycisk</button>
    </div>
  );
}

export default Home;
