document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("filterForm");
  const main = document.querySelector("main");
  const nameInput = document.getElementById("nameInput");

  // --- Teil 1: Filter nach Jahr & Geschlecht ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const gender = form.gender.value;
    const year = form.year.value;

    

    const genderMap = {
      boy: "1",
      girl: "2"
    };
    const genderAPI = genderMap[gender];
    console.log("Jahr:", year, "Geschlecht:", genderAPI);

    let apiUrl = `https://daten.sg.ch/api/explore/v2.1/catalog/datasets/vornamen-der-neugeborenen-kanton-stgallen-seit-1987/records?order_by=n%20desc&limit=-1&exclude=vorname%3Aandere%20Namen`;

    if (year) {
      apiUrl += `&refine=year%3A%22${year}%22 `;
      console.log(apiUrl);
    } 

    if (genderAPI) {
      apiUrl += `&refine=geschlecht%3A%22${genderAPI}%22`;
      console.log(apiUrl);
    }

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const records = data.results;

      if (records.length === 0) {
        showResults(`<p>Keine Daten gefunden.</p>`);
        return;
      }

      const topNames = records
        .sort((a, b) => b.n - a.n)
        .slice(0, 10);

      const html = `
        <h2>Top 10 ${gender === "boy" ? "Jungennamen" : "Mädchennamen"} im Jahr ${year}</h2>
        <ol>
          ${topNames.map(name => `<li>${name.vorname} – ${name.n} Mal</li>`).join("")}
        </ol>
      `;
      showResults(html);
    } catch (error) {
      console.error("Fehler beim Abrufen der Daten:", error);
      showResults("<p>Fehler beim Laden der Daten.</p>");
    }
  });

  // --- Teil 2: Namenssuche ---
  nameInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const name = nameInput.value.trim();

      if (!name) {
        showResults("<p>Bitte gib einen Namen ein.</p>");
        return;
      }

      const nameEncoded = encodeURIComponent(name);
      const apiUrl = `https://daten.sg.ch/api/explore/v2.1/catalog/datasets/vornamen-der-neugeborenen-kanton-stgallen-seit-1987/records?limit=10000&where=lower(vorname)%3D%22${name.toLowerCase()}%22`;

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const records = data.results;

        if (records.length === 0) {
          showResults(`<p>Der Name <strong>${name}</strong> wurde nicht gefunden.</p>`);
          return;
        }

        // Jahr mit höchster Anzahl suchen
        const best = records.reduce((max, current) => (current.n > max.n ? current : max));

        const html = `
          <h2>Namensanalyse für "${best.vorname}"</h2>
          <p>Am beliebtesten im Jahr <strong>${best.jahr}</strong> mit <strong>${best.n}</strong> Nennungen.</p>
        `;
        showResults(html);
      } catch (error) {
        console.error("Fehler bei der Namenssuche:", error);
        showResults("<p>Fehler bei der Namenssuche.</p>");
      }
    }
  });

  // --- Ausgabe-Box neu schreiben ---
  function showResults(content) {
    let oldResults = document.querySelector(".results");
    if (oldResults) oldResults.remove();

    const resultBox = document.createElement("div");
    resultBox.className = "info-box results";
    resultBox.innerHTML = content;
    main.appendChild(resultBox);
  }
});
