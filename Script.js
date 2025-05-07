const apiBase = "https://daten.sg.ch/api/explore/v2.1/catalog/datasets/vornamen-der-neugeborenen-kanton-stgallen-seit-1987/records?limit=-1&";

// DOM-Elemente
const yearRadios = document.querySelectorAll('input[name="year"]');
const geschlechtRadios = document.querySelectorAll('input[name="geschlecht"]');
const rankingList = document.getElementById("rankingList");
const nameFrequency = document.getElementById("nameFrequency");
const selectedYearText = document.getElementById("selectedYear");
const searchButton = document.getElementById("searchButton");
const nameInput = document.getElementById("nameInput");
const popularYearButton = document.getElementById("popularYearButton");
const popularYearOutput = document.getElementById("popularYearOutput");

// Initialer Wert
let selectedYear = "2023";
let selectedGeschlecht = "männlich";  // Standard: Jungen
selectedYearText.textContent = `Top 10 Namen ${selectedYear}`;
fetchTopNames(selectedYear, selectedGeschlecht);

// Reagiere auf Jahr-Änderung
yearRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    selectedYear = radio.value;
    selectedYearText.textContent = `Top 10 Namen ${selectedYear}`;
    fetchTopNames(selectedYear, selectedGeschlecht);
  });
});

// Reagiere auf Geschlecht-Änderung
geschlechtRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    selectedGeschlecht = radio.value;
    fetchTopNames(selectedYear, selectedGeschlecht);
  });
});

// Suche: Häufigkeit eines Namens im ausgewählten Jahr
searchButton.addEventListener("click", () => {
  const vorname = nameInput.value.trim();
  if (vorname && selectedYear) {
    fetchNameFrequency(vorname, selectedYear);
  }
});

// Suche: Jahr mit höchster Häufigkeit eines Namens
popularYearButton.addEventListener("click", () => {
  const vorname = nameInput.value.trim();
  if (vorname) {
    fetchMostPopularYear(vorname);
  }
});

// Top 10 Namen eines Jahres mit Geschlecht laden
async function fetchTopNames(year, geschlecht) {
  rankingList.innerHTML = "<li>Lade...</li>";
  try {
    const geschlechtFilter = geschlecht === "männlich" ? "geschlecht%3D%27männlich%27" : "geschlecht%3D%27weiblich%27";
    const res = await fetch(`${apiBase}&where=jahr%3D${year}%20AND%20${geschlechtFilter}&order_by=n%20desc`);
    const result = await res.json();

    rankingList.innerHTML = "";
    if (result.records && result.records.length > 0) {
      result.records.forEach((item, index) => {
        const vorname = item.fields.vorname;
        const haeufigkeit = item.fields.n;
        const geschlecht = item.fields.geschlecht;  // Hier annehmen, dass es ein geschlecht-Feld gibt
        const geschlechtText = geschlecht === "männlich" ? "Jungen" : "Mädchen"; // Ausgabe nach Geschlecht

        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${vorname} (${haeufigkeit} ${geschlechtText})`;
        rankingList.appendChild(li);
      });
    } else {
      rankingList.innerHTML = "<li>Keine Daten gefunden.</li>";
    }
  } catch (error) {
    rankingList.innerHTML = "<li>Fehler beim Laden der Daten.</li>";
    console.error(error);
  }
}

// Häufigkeit eines Namens im Jahr
async function fetchNameFrequency(vorname, year) {
  nameFrequency.textContent = "Suche...";
  try {
    const whereClause = `jahr=${year} AND vorname="${vorname}"`;
    const params = new URLSearchParams({
      where: whereClause,
      limit: "1"
    });

    const res = await fetch(`${apiBase}?${params.toString()}`);
    const result = await res.json();

    if (result.results && result.results.length > 0) {
      const eintrag = result.results[0];
      nameFrequency.textContent = `"${vorname}" wurde ${eintrag.n} Mal im Jahr ${year} vergeben.`;
    } else {
      nameFrequency.textContent = `"${vorname}" wurde im Jahr ${year} nicht vergeben.`;
    }
  } catch (error) {
    nameFrequency.textContent = "Fehler bei der Namenssuche.";
    console.error(error);
  }
}

// Jahr mit höchster Häufigkeit eines Namens
async function fetchMostPopularYear(vorname) {
  popularYearOutput.textContent = "Suche...";
  try {
    const whereClause = `vorname="${vorname}"`;
    const params = new URLSearchParams({
      where: whereClause,
      order_by: "n DESC",
      limit: "1"
    });

    const res = await fetch(`${apiBase}?${params.toString()}`);
    const result = await res.json();

    if (result.results && result.results.length > 0) {
      const eintrag = result.results[0];
      popularYearOutput.textContent = `"${vorname}" war im Jahr ${eintrag.jahr} am beliebtesten mit ${eintrag.n} Vergaben.`;
    } else {
      popularYearOutput.textContent = `"${vorname}" wurde in keinem Jahr vergeben.`;
    }
  } catch (error) {
    popularYearOutput.textContent = "Fehler bei der Abfrage.";
    console.error(error);
  }
}
