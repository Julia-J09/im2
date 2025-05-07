const apiBase = "https://data.sg.ch/api/explore/v2.1/catalog/datasets/vornamen-der-neugeborenen-kanton-stgallen-seit-1987/records";

// DOM-Elemente
const yearRadios = document.querySelectorAll('input[name="year"]');
const rankingList = document.getElementById("rankingList");
const nameFrequency = document.getElementById("nameFrequency");
const selectedYearText = document.getElementById("selectedYear");
const searchButton = document.getElementById("searchButton");
const nameInput = document.getElementById("nameInput");
const popularYearButton = document.getElementById("popularYearButton");
const popularYearOutput = document.getElementById("popularYearOutput");

// Initialer Wert
let selectedYear = "2023";
selectedYearText.textContent = `Top 10 Namen ${selectedYear}`;
fetchTopNames(selectedYear);

// Reagiere auf Jahr-Änderung
yearRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    selectedYear = radio.value;
    selectedYearText.textContent = `Top 10 Namen ${selectedYear}`;
    fetchTopNames(selectedYear);
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

// Top 10 Namen eines Jahres laden
async function fetchTopNames(year) {
  rankingList.innerHTML = "<li>Lade...</li>";
  try {
    const params = new URLSearchParams({
      where: `jahr=${year}`,
      order_by: "n desc",
      limit: "10",
      exclude: "vorname:andere Namen"
    });

    const res = await fetch(`${apiBase}?${params.toString()}`);
    const result = await res.json();

    rankingList.innerHTML = "";
    result.results.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${item.vorname} (${item.n})`;
      rankingList.appendChild(li);
    });
  } catch (error) {
    rankingList.innerHTML = "<li>Fehler beim Laden der Daten.</li>";
    console.error(error);
  }
}

// Häufigkeit eines Namens im Jahr
async function fetchNameFrequency(vorname, year) {
  nameFrequency.textContent = "Suche...";
  try {
    const params = new URLSearchParams({
      where: `jahr=${year} AND vorname="${vorname}"`,
      limit: "1"
    });

    const res = await fetch(`${apiBase}?${params.toString()}`);
    const result = await res.json();

    if (result.results.length > 0) {
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
    const params = new URLSearchParams({
      where: `vorname="${vorname}"`,
      order_by: "n desc",
      limit: "1"
    });

    const res = await fetch(`${apiBase}?${params.toString()}`);
    const result = await res.json();

    if (result.results.length > 0) {
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
