# Semesterabgabe IKT SoSe 23 Freiheit
## Willkommen zu Inspira!!

Meine PWA **Inspira** soll jedem die Möglichkeit geben Momente festzuhalten die einen besonders beeindruckt haben und wurde Mithilfe von **Node.js** und **MongoDB** erstellt. Man kann dies sehr versatil nutzen, seien es Momente im Urlaub die man wie eine Art Fotowand festhalten will oder eine Art Inspirationsbuch wo man Momente aufnimmt die man in Kunst umsetzen will. Es gibt ausreichend Platz für Notizen. Sei es zum Lieder oder Gedichte schreiben, oder zum Malen eines Bildes.

## Wie die Seite aufgebaut ist 
Zuerst landest du auf der Homeseite, dort werden dir alle gespeicherten Momente angezeigt. Mit dem Klick auf **Capture** kannst du einen Moment aufnehmen. Dabei steht die frei ob du deine eigene **Kamera** nutzt oder ein Foto hochlädst (jpg, jpeg, png). 
Du kannst deinen Gedanken zu der Aufnahmen in **Notes** beschreiben und eien kurze Beschreibung in **Short Descripton** eintragen. Auch deine **Location** kannst du eintragen, entweder händisch oder du lässt sie ermitteln. Falls dir die Ortung zu genau ist, kannst du auch einzelne Infos wieder entfernen. *(Achte darauf das dein Browser die entsprechenden Berechtigungen für Kamera und Ortung hat)*.

## Das kann die Inspira-PWA
- Sie ist **installierbar**, das heißt du kannst sie auch als App auf deinem Endgerät haben  
- Sie läuft auch **offline**, du kannst also Post erstellen wenn du mal keine Internet hat, und deine Momente werden **synchronisiert** wenn du das nächste mal wieder online bist 


## Installation der Anwendung:
Das Repository sollte als lokale Kopie auf dem Computer gespeichert werden. Die kann man mit **Git Clone** machen. Dafür öffnet man die Git-Bash an dem Ort wo man das Repository speichern möchte und gibt dort folgenden Befehl an:
```cmd
git clone https://github.com/angeliallieu/SemesterabAllieu23
```
**Backend**: inspirabackend <br>
**Frontend**: meinProjekt <br>

Der **Backend**- und der **Frontend**-Ordner müssen dann jeweils im eigenen Terminals (am besten über GitBash) geöffnet werden. 
Für das **Frontend** erfolgt im Terminal die Eingabe: 
```cmd
npm start
```

Erfolgreich ist dies wenn folgende **Ausgabe** erfolgt:
```ts
"....
Available on:
  http://192.168.56.1:8080
  http://192.168.0.9:8080
  http://127.0.0.1:8080
Hit CTRL-C to stop the server
"
```

Für das **Backend** gilt die Eingabe:
```cmd
npm run watch
```
Hier sollte erfolgen:
```ts
console.log("Server started and listening on port 4000.... Connected to DB")
```

Das Backend sollte durch meine Implementation bereits mit der MongoDB-Datenbank verknüpft sein.
Wenn beide Terminals laufen, kann man die Seite über *http://localhost:8080/* erreichen.



## Screenshots der Anwendung
**Startseite**
<img src="/bilder/bildhome.png" alt="Startseite" title="Startseite">

**Capture**
<img src="/bilder/bildcreate.png" alt="Startseite2" title="Startseite2">


## Weiterführende Ideen
- Sprachaufnahmen zu den Momenten ermöglichen