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
nameInput.addEventListener("input", async (e) => {
  e.preventDefault();
  
    const vorname = nameInput.value.trim();
    const vornameUpper = vorname.toUpperCase();
    console.log("Vorname:", vornameUpper);

    if (vorname === "") {
      showResults("<p>Bitte gib einen Namen ein.</p>");
      return;
    }

   let apiUrl = "https://daten.sg.ch/api/explore/v2.1/catalog/datasets/vornamen-der-neugeborenen-kanton-stgallen-seit-1987/records?order_by=n%20desc&limit=-1&exclude=vorname%3Aandere%20Namen";

    if (vornameUpper) {
      apiUrl += `&refine=vorname%3A${vornameUpper}`;
      console.log(apiUrl);
    } 

    try { 
      const response = await fetch(apiUrl);
      const data = await response.json();
      const records = data.results;
      console.log(records)

      // Standard-Filter: ohne Akzent-Normalisierung
      const filtered = records.filter(
        (record) => record.vorname.toUpperCase() === vornameUpper
      );

    

      console.log(filtered);

      if (filtered.length === 0) {
        showResults(`<p>Der Name <strong>${vornameUpper}</strong> wurde nicht gefunden.</p>`);
        return;
      }

      // Jahr mit höchster Anzahl Nennungen
      const best = filtered.reduce((max, current) =>
        current.n > max.n ? current : max
      );

      const html = `
        <h2>Namensanalyse für "${best.vorname.toUpperCase()}"</h2>
        <p>Am beliebtesten im Jahr <strong>${best.year}</strong> mit <strong>${best.n}</strong> Nennungen.</p>
      `;
      showResults(html);
    } catch (error) {
      console.error("Fehler bei der Namenssuche:", error);
      showResults("<p>Fehler bei der Namenssuche.</p>");
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
