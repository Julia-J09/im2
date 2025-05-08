document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("filterForm");
  const main = document.querySelector("main");
  const nameInput = document.getElementById("nameInput");
  let babyIcon = document.querySelector(".baby-icon")

  // --- Filter nach Jahr & Geschlecht auf Webseite ---
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
      console.log(records)

      if (records.length === 0) {
        showResults(`<p>Keine Daten gefunden.</p>`);
        return;
      }

      //Anzahl Ranking definiert und Name Mädchen oder Junge Anzeige
      const topNames = records
        .slice(0, 10);

      let boyorgirl = "Jungennamen" 
      if (gender=="girl"){
        boyorgirl="Mädchennamen"
      }
        
      const html = `
        <h2>Top 10 ${boyorgirl} im Jahr ${year}</h2>
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

  // Namenssuche
  nameInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const name = nameInput.value.trim();

      if (!name) {
        showResults("<p>Bitte gib einen Namen ein.</p>"); //Wenn kein Name eingegeben wurde, wird eine Fehlermeldung angezeigt 
        return;
      }

      
      const apiUrl = "https://daten.sg.ch/api/explore/v2.1/catalog/datasets/vornamen-der-neugeborenen-kanton-stgallen-seit-1987/records?order_by=n%20desc&limit=-1&exclude=vorname%3Aandere%20Namen";

      try {
        const response = await fetch(apiUrl);  //await= wartet auf Antort, mit fetch wird die API abgerufen, dann wird es in ein JavaScript-Objekt umgewandelt, und aus dem result werden die eigentlichen Daten geholt.
        const data = await response.json();
        const records = data.results;
        const filtered = records.filter((record) => record.vorname.toLowerCase() === name.toLowerCase()); //alle Einträge werden gefiltert, die dem eingegebenen Namen entsprechen. toLowerCase() sorgt dafür, dass die Suche nicht zwischen Gross- und Kleinschreibung unterscheidet.

        if (records.length === 0) {  //wenn keine Daten vorhanden sind, wird eine Fehlermeldung angezeigt
          showResults(<p>Der Name <strong>${name}</strong> wurde nicht gefunden.</p>);
          return;
        }
        // Jahr mit höchster Anzahl suchen
        const best = records.reduce((max, current) => (current.n > max.n ? current : max)); //aus allen Datensätzen wird der mit der höchsten Anzahl gesucht. reduce= vergleicht alle Einträge, max= ist immer der bisher beste Eintrag, current= ist der aktuell geprüfte wert, falls current.n grösser ist, wird current der neue best.

        const html = `
          <h2>Namensanalyse für "${best.vorname}"</h2>
          <p>Am beliebtesten im Jahr <strong>${best.jahr}</strong> mit <strong>${best.n}</strong> Nennungen.</p>
        `;
        showResults(html); //der vorbereitete html block wird angezeigt.
      } catch (error) { //Fehlerbehandlung, falls die API nicht erreichbar ist
        console.error("Fehler bei der Namenssuche:", error);
        showResults("<p>Fehler bei der Namenssuche.</p>");
      }
    }
  });

  // 
  function showResults(content) {
    const gender = form.gender.value;

    let infoBox = document.querySelector(".info-box");
    if (infoBox) infoBox.innerHTML="";

    let gender_class = "";
    let genderIcon = "babyiconneutral.gif"
    if (gender=="boy") {
      
      // Klasse des Elements ändern auf "boy"
      gender_class = "boy"
      genderIcon =  "babyboy.gif";

      //Klasse des Elements ändern auf "girl"
    } else if (gender=="girl"){
      gender_class = "girl"
      genderIcon = "babygirl.gif";

    } else {
    }

    babyIcon.src = genderIcon;
    infoBox.classList.remove("boy" , "girl")
    infoBox.classList.add(gender_class)
    infoBox.innerHTML = content;
    
    
  }
});
