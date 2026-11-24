# BioBox – Webplattform

Die BioBox-Webplattform ist Bestandteil der Diplomarbeit BioBox
an der HTL Peter Mahringer in Shkodra.

Die Anwendung dient zur Überwachung, Analyse und Steuerung
eines automatisierten Systems für den Pflanzenanbau.

## Technologien

| Technologie | Verwendung |
|---|---|
| SvelteKit | Frontend und Backend |
| Svelte 5 | Reaktive Benutzeroberfläche |
| JavaScript | Anwendungslogik |
| Tailwind CSS | Gestaltung der Benutzeroberfläche |
| MySQL | Speicherung der System- und Benutzerdaten |
| Paraglide JS | Internationalisierung |
| bcryptjs | Passwort-Hashing |
| REST API | Kommunikation und Datenaustausch |
| Node.js | Serverumgebung |

## Funktionen

- Registrierung und Anmeldung
- Sitzungsbasierte Authentifizierung
- Benutzer- und Rollenverwaltung
- Dashboard mit aktuellen Sensordaten
- Automatische Aktualisierung der Messwerte
- Historische Messwertanalyse und Diagramme
- Manuelle und automatische Systemsteuerung
- Bildbasierte Pflanzenanalyse
- Anzeige und Bestätigung von Warnmeldungen
- Mehrsprachige Benutzeroberfläche

## Installation und Ausführung

### Voraussetzungen

- Node.js und npm
- MySQL-Datenbank
- Konfigurierte Datenbankverbindung

### Abhängigkeiten installieren

```bash
npm install
```

### Entwicklungsserver starten

```bash
npm run dev
```

### Produktionsversion erstellen

```bash
npm run build
```

### Produktionsversion lokal anzeigen

```bash
npm run preview
```

## Projektstruktur

```text
BioBox-webplatform/
├── messages/
│   ├── de.json
│   ├── en.json
│   └── sq.json
├── project.inlang/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   ├── paraglide/
│   │   └── server/
│   └── routes/
│       ├── api/
│       ├── dashboard/
│       ├── live-daten/
│       ├── verlauf/
│       ├── steuerung/
│       ├── pflanzenanalyse/
│       ├── warnungen/
│       └── benutzer/
├── static/
├── package.json
└── README.md
```

## Internationalisierung (i18n)

Die Internationalisierung der Webplattform wird mit
Paraglide JS umgesetzt.

### Unterstützte Sprachen

| Sprachcode | Sprache |
|---|---|
| de | Deutsch |
| en | Englisch |
| sq | Albanisch |

Deutsch dient als Standardsprache.

### Übersetzungsdateien

Die Übersetzungen befinden sich im Verzeichnis `messages/`.

- `de.json` – Deutsche Übersetzungen
- `en.json` – Englische Übersetzungen
- `sq.json` – Albanische Übersetzungen

Alle Übersetzungsdateien verwenden dieselben Schlüssel.

Beispiel:

```json
{
    "dashboard_overview": "Systemübersicht"
}
```

Die generierten Übersetzungsfunktionen werden in den
Svelte-Komponenten und serverseitigen Dateien importiert.

```javascript
import * as m from '$lib/paraglide/messages.js';
```

Verwendung innerhalb einer Svelte-Komponente:

```svelte
<h1>{m.dashboard_overview()}</h1>
```

### Sprachwechsel

Die Komponente `LanguageSwitcher.svelte` ermöglicht
den Wechsel zwischen den unterstützten Sprachen.

Paraglide stellt dafür folgende Funktionen bereit:

```javascript
import {
    getLocale,
    setLocale
} from '$lib/paraglide/runtime.js';
```

- `getLocale()` ermittelt die aktuell ausgewählte Sprache.
- `setLocale()` ändert die Sprache der Anwendung.

### Übersetzungsumfang

Die Internationalisierung umfasst:

- Seitentitel und Navigation
- Beschriftungen und Schaltflächen
- Formularvalidierung
- Fehler- und Erfolgsmeldungen
- Diagrammbeschriftungen
- Systeminformationen
- Datenbankbasierte Warnmeldungen
- Datums-, Zeit- und Zahlenformate

### Regionale Formatierung

Datums- und Zahlenwerte werden abhängig von der
ausgewählten Sprache formatiert.

| Format | Deutsch | Englisch | Albanisch |
|---|---|---|---|
| Datum | 24.11.26 | 11/24/26 | 24.11.26 |
| Uhrzeit | 14:30 | 02:30 PM | 14:30 |
| Dezimalzahl | 26,5 | 26.5 | 26,5 |
| Tausendertrennzeichen | 1.500 | 1,500 | 1.500 |

Für Deutsch und Albanisch wird `de-DE` als
Formatierungslocale verwendet. Englisch verwendet `en-US`.

Die Formatierung erfolgt mithilfe der integrierten
JavaScript-Methoden `toLocaleString()`,
`toLocaleDateString()` und `toLocaleTimeString()`.

### Mehrsprachige Datenbankinhalte

Für dynamische Datenbankinhalte wird Variante 1 verwendet:
die Speicherung der Übersetzungen in separaten Spalten
innerhalb derselben Datenbanktabelle.

#### Tabelle: alerts

| Spalte | Beschreibung |
|---|---|
| message | Ursprüngliche Warnmeldung |
| message_de | Deutsche Warnmeldung |
| message_en | Englische Warnmeldung |
| message_sq | Albanische Warnmeldung |

#### Tabelle: health_assessments

| Spalte | Beschreibung |
|---|---|
| health_category | Ursprüngliche Gesundheitskategorie |
| health_category_de | Deutsche Gesundheitskategorie |
| health_category_en | Englische Gesundheitskategorie |
| health_category_sq | Albanische Gesundheitskategorie |
| health_warnings | Ursprüngliche Gesundheitswarnungen |
| health_warnings_de | Deutsche Gesundheitswarnungen |
| health_warnings_en | Englische Gesundheitswarnungen |
| health_warnings_sq | Albanische Gesundheitswarnungen |

Die passende Übersetzung wird serverseitig anhand
der aktuell ausgewählten Sprache geladen.

```javascript
const language = getLocale();

alert.message =
    alert['message_' + language] ?? alert.message;
```

Falls keine Übersetzung vorhanden ist, wird der
ursprüngliche Datenbankinhalt angezeigt.

Numerische Messwerte werden unabhängig von der Sprache
gespeichert und erst bei der Anzeige entsprechend
formatiert.

### Neue Übersetzungen hinzufügen

1. Einen neuen Übersetzungsschlüssel in `de.json` hinzufügen.
2. Den gleichen Schlüssel in `en.json` und `sq.json` ergänzen.
3. Die Übersetzungsfunktion in der entsprechenden
   Komponente oder serverseitigen Datei verwenden.

## Authentifizierung und Sicherheit

Die Benutzeranmeldung erfolgt über E-Mail-Adresse
und Passwort.

Passwörter werden mit bcrypt gehasht und nicht
im Klartext gespeichert.

Nach erfolgreicher Anmeldung wird ein zufälliges
Session-Token generiert. In der Datenbank wird
ausschließlich dessen SHA-256-Hash gespeichert.

Die Anwendung verwendet zwei Benutzerrollen:

- `viewer` – Standardbenutzer
- `admin` – Administrator

Die Benutzerverwaltung ist Administratoren vorbehalten.

## Datenverarbeitung

Die Webplattform bezieht aktuelle Sensordaten und
Systemzustände über REST-API-Endpunkte.

Zu den verarbeiteten Messwerten gehören:

- Lufttemperatur
- Luftfeuchtigkeit
- Bodenfeuchtigkeit
- Bodentemperatur
- Lichtstärke
- Daily Light Integral (DLI)

Historische Messwerte werden zur Berechnung von
Minimalwerten, Maximalwerten und Durchschnittswerten
sowie zur Erstellung von Diagrammen verwendet.

## Entwicklungsstand

Die mehrsprachige Benutzeroberfläche, die serverseitige
Übersetzung und die Datenbankstruktur für mehrsprachige
Inhalte wurden implementiert.

Die vollständige Bereitstellung mehrsprachiger
Pflanzengesundheitsdaten durch das externe Analysemodul
sowie die abschließende Funktionsprüfung stehen noch aus.

## Diplomarbeit

**Projekt:** BioBox  
**Schule:** HTL Peter Mahringer, Shkodra  
**Schuljahr:** 2026/2027