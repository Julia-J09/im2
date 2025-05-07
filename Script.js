const apiBase = "https://www.freepublicapis.com/neugeborenen-vornamen-kanton-stgallen";

const yearRadios = document.querySelectorAll('input[name="year"]');
const rankingList = document.getElementById("rankingList");
const nameFrequency = document.getElementById("nameFrequency");
const selectedYearText = document.getElementById("selectedYear");
const searchButton = document.getElementById("searchButton");
const nameInput = document.getElementById("nameInput");

// Initial load
let selectedYear = "2023";
fetchTopNames(selectedYear);

yearRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    selectedYear = radio.value;
    selectedYearText.textContent = `Top 10 Namen ${selectedYear}`;
    fetchTopNames(selectedYear);
  });
});

searchButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (name && selectedYear) {
    fetchNameFrequency(name, selectedYear);
  }
});

async function fetchTopNames(year) {
  rankingList.innerHTML = "<li>Lade...</li>";
  try {
    const res = await fetch(`${apiBase}?year=${year}`);
    const data = await res.json();
    rankingList.innerHTML = "";
    data.slice(0, 10).forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${index + 1}. ${item.name} (${item.count})`;
      rankingList.appendChild(li);
    });
  } catch (error) {
    rankingList.innerHTML = "<li>Fehler beim Laden der Daten.</li>";
    console.error(error);
  }
}

async function fetchNameFrequency(name, year) {
  nameFrequency.textContent = "Suche...";
  try {
    const res = await fetch(`${apiBase}?year=${year}&name=${encodeURIComponent(name)}`);
    const data = await res.json();
    if (data.length > 0) {
      nameFrequency.textContent = `"${name}" wurde ${data[0].count} Mal im Jahr ${year} vergeben.`;
    } else {
      nameFrequency.textContent = `"${name}" wurde im Jahr ${year} nicht vergeben.`;
    }
  } catch (error) {
    nameFrequency.textContent = "Fehler bei der Namenssuche.";
    console.error(error);
  }
}
