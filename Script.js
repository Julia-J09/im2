document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("filterForm");
  const main = document.querySelector("main");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 3. API-URL bauen
    const apiUrl = "https://daten.sg.ch/api/explore/v2.1/catalog/datasets/vornamen-der-neugeborenen-kanton-stgallen-seit-1987/records?limit=-1&";

    // 1. Eingaben lesen
    const gender = form.gender.value;
    const year = form.year.value;

    // 2. Gender-Wert in API-Format übersetzen
    const genderMap = {
      boy: "1",
      girl: "2"
    };
    const params = "order_by=n%20desc&exclude=vorname%3Aandere%20Namen";

  

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const records = data.results;

      if (records.length === 0) {
        showResults(`<p>Keine Daten gefunden.</p>`);
        return;
      }

      // 4. Top 10 nach "n" sortieren
      const topNames = records
        .sort((a, b) => b.n - a.n)
        .slice(0, 10);

      // 5. HTML-Ergebnis aufbauen
      const html = `
        <h2>Top 10 ${gender === "boy" ? "Jungennamen" : "Mädchennamen"} im Jahr ${year}</h2>
        <ol>
          ${topNames.map(name => `<li>${name.vorname} – ${name.n} Mal</li>`).join("")}
        </ol>
      `;

      showResults(html);
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      showResults("<p>Fehler beim Laden der Daten. Bitte versuch's später erneut.</p>");
    }
  });

  function showResults(content) {
    // Falls ein vorheriges Ergebnis existiert, löschen
    let oldResults = document.querySelector(".results");
    if (oldResults) oldResults.remove();

    const resultBox = document.createElement("div");
    resultBox.className = "info-box results";
    resultBox.innerHTML = content;
    main.appendChild(resultBox);
  }
});
