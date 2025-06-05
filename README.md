Kurzbeschreibung des Projekts mit folgenden Themen:

Kurzbeschreibung des Projekts (max. 500 Zeichen)
Die Webseite bietet eine Übersicht über die vergebenen Vornamen im Kanton St.Gallen von 2000 - 2023. Nutzer:innen können einen Namen eingeben und sehen, in welchem Jahr er besonders beliebt war und wie oft er vergeben wurde. Alternativ lässt sich ein Jahr und das Geschlecht auswählen, um die beliebtesten Namen anzuzeigen. Die Seite bietet so einen informativen Zugang zu regionalen Namensstatistiken.

Learnings und Schwierigkeiten (max. 200 Zeichen pro Person)

Learnings und Schwierigkeiten Julia:
Durch praktisches Arbeiten habe ich viel über HTML und CSS gelernt. JavaScript ist noch komplex, aber mit Übung und ChatGPT konnte ich die Grundlagen besser verstehen.

Leranings und Schwierigkeiten Kilian: 

Javascript ist auch für mich sehr komplex. Durch die Coachings und ChatGPT konnte ich es besser verstehen und ich habe Vor Allem gelernt KI effektiver einzusetzten und den Code danach auch besser zu verstehen. 

benutze Ressourcen und Promts:

zur Unterstützung haben wir ChatGPT sowie GitHub Copilot verwendet.

Promt 1:

ol li:nth-child(n+1):nth-child(-n+3) {
  font-family: "oooh baby", cursive;
  font-size: 50px;
}

Das ist unser CSS code. Wie können wir das anpassen, sodass wir eine Pyramieden rangierung erhalten und der 1,2 udn 3 Name wie auf einem Podest mit ersten, zweiten und dritten Rang dargestellt werden. die Namen 4 bis 10 sollen dann alle gleich aussehen und in einer Liste unterhalb angezeigt werden

Antwort von ChatGPT:

Super! Du möchtest eine Podest-Darstellung für die Plätze 1–3 (wie bei einer Siegerehrung) und die Plätze 4–10 als normale Liste darunter. Das geht mit etwas HTML-Struktur + CSS-Styling.
✅ Lösung: HTML + CSS für Pyramiden-Rangierung
🔧 HTML-Beispiel

<ol class="rangliste">
  <li class="rang rang-1">Max Mustermann</li>
  <li class="rang rang-2">Erika Musterfrau</li>
  <li class="rang rang-3">John Doe</li>

  <li class="normal">Platz 4: Julia</li>
  <li class="normal">Platz 5: Ben</li>
  <li class="normal">Platz 6: Sarah</li>
  <li class="normal">Platz 7: Tim</li>
  <li class="normal">Platz 8: Anna</li>
  <li class="normal">Platz 9: Paul</li>
  <li class="normal">Platz 10: Lea</li>
</ol>

🎨 CSS-Styling

.rangliste {
  list-style: none;
  padding: 0;
  text-align: center;
}

.rangliste li {
  margin: 10px 0;
}

/* Platz 1 – Zentrum, größer */
.rang-1 {
  font-family: "Oooh Baby", cursive;
  font-size: 60px;
  font-weight: bold;
  color: gold;
}

/* Platz 2 – links vom 1. Platz */
.rang-2 {
  font-family: "Oooh Baby", cursive;
  font-size: 50px;
  color: silver;
  transform: translateX(-100px);
  display: inline-block;
}

/* Platz 3 – rechts vom 1. Platz */
.rang-3 {
  font-family: "Oooh Baby", cursive;
  font-size: 45px;
  color: #cd7f32; /* Bronze */
  transform: translateX(100px);
  display: inline-block;
}

/* Plätze 4–10 */
.normal {
  font-family: sans-serif;
  font-size: 20px;
  color: #333;
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

💡 Erklärung

    Die ersten 3 <li>-Elemente haben eigene Klassen für Podeststil.

    Die transform: translateX(...) schiebt Platz 2 und 3 etwas nach links/rechts, um die typische Pyramiden-Anordnung zu simulieren.

    Plätze 4–10 sind schlicht und unterhalb gelistet.



Promt 2:

Ich möchte die Webseite responsove machen und eine Media query einbauen um das Design für Tablet und für mobile anzupassen. wie mache ich das am besten?

Antort von GitHub Copilot:

Um deine Webseite responsive zu machen, solltest du Media Queries in deiner CSS-Datei ergänzen. Damit kannst du gezielt das Layout, die Schriftgrößen und Abstände für Tablets und Smartphones anpassen.

Hier ein Vorschlag, wie du das für deine Seite machen kannst:

/* --- Desktop-Design: bleibt wie bisher --- */

/* --- Tablet (z.B. bis 900px) --- */
@media (max-width: 900px) {
  .container {
    flex-direction: column;
    padding: 20px;
  }
  .sidebar {
    width: 100%;
    padding-right: 0;
    margin-bottom: 30px;
  }
  .baby-icon {
    width: 200px;
  }
  main {
    padding: 0;
  }
  h1 {
    font-size: 48px;
  }
  .info-box {
    width: 95%;
    padding: 20px;
  }
  .podest {
    max-width: 100%;
    gap: 8px;
  }
  .podest li {
    width: 100px;
    font-size: 18px;
    padding: 10px 8px;
  }
}

/* --- Mobile (z.B. bis 600px) --- */
@media (max-width: 600px) {
  .container {
    flex-direction: column;
    padding: 8px;
  }
  .sidebar {
    width: 100%;
    padding-right: 0;
    margin-bottom: 20px;
  }
  .baby-icon {
    width: 120px;
  }
  h1 {
    font-size: 28px;
  }
  h2, h3 {
    font-size: 20px;
  }
  .info-box {
    width: 100%;
    padding: 10px;
    font-size: 16px;
  }
  .podest {
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .podest li {
    width: 90vw;
    font-size: 16px;
    padding: 8px 4px;
  }
  .search-box input[type="text"] {
    width: 95%;
    font-size: 14px;
    padding: 8px;
  }
}

So gehst du vor:

Füge diese Media Queries ans Ende deiner style.css ein.
Passe die Werte nach deinem Geschmack an.
Teste das Verhalten im Browser, indem du das Fenster verkleinerst oder die Entwicklertools nutzt.
Tipp:
Du kannst weitere Details (z.B. Button-Größe, Abstände, Schriftgrößen) innerhalb der Media Queries anpassen, um das Nutzererlebnis auf allen Geräten zu optimieren.

Fazit:
Mit diesen Media Queries wird deine Seite auf Tablets und Smartphones übersichtlich und benutzerfreundlich dargestellt!


Promt 3:

im dropdown für year werden nur drei Jahre angezeigt anstatt 20

Antwort von GitHub Copilot:

Das Problem ist, dass dein Dropdown für das Jahr (#yearDropdown) im HTML nur drei <option>-Elemente enthält.
Die Radiobuttons für das Jahr im Formular enthalten aber alle Jahre von 2023 bis 2000.

Lösung:
Erzeuge die Dropdown-Optionen dynamisch per JavaScript, damit sie immer mit den Radiobuttons übereinstimmen.

document.addEventListener("DOMContentLoaded", () => {
  // ...dein bisheriger Code...

  // Dropdown für Jahr dynamisch befüllen
  const yearDropdown = document.getElementById("yearDropdown");
  const yearRadios = document.querySelectorAll('input[name="year"]');
  if (yearDropdown && yearRadios.length > 0) {
    yearDropdown.innerHTML = ""; // Leeren
    yearRadios.forEach(radio => {
      const option = document.createElement("option");
      option.value = radio.value;
      option.textContent = radio.value;
      yearDropdown.appendChild(option);
    });
  }

  // ...restlicher Code...
});

Erklärung:

Der Code sucht alle Jahr-Radiobuttons und erzeugt für jeden eine <option> im Dropdown.
So sind immer alle Jahre im Dropdown sichtbar, egal wie viele es sind.
Tipp:
Entferne die festen <option>-Elemente für das Jahr aus deinem HTML, damit es keine doppelten gibt.

Fazit:
Jetzt werden im Dropdown alle Jahre angezeigt, die auch als Radiobuttons existieren!