import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { compile } from '@inlang/paraglide-js';

// Each row contains: key | German | English | Albanian
const text = `
home_title|BioBox – Intelligente Pflanzenüberwachung|BioBox – Smart plant monitoring|BioBox – Monitorimi inteligjent i bimëve
home_description|Überwache Temperatur, Feuchtigkeit und den Zustand deiner BioBox in Echtzeit.|Monitor the temperature, humidity and condition of your BioBox in real time.|Ndiq temperaturën, lagështinë dhe gjendjen e BioBox-it në kohë reale.
home_navigation|Hauptnavigation|Main navigation|Menuja kryesore
home_menu|Menü öffnen|Open menu|Hap menunë
home_start|Start|Home|Kreu
home_features|Funktionen|Features|Funksionet
home_dashboard|Dashboard|Dashboard|Paneli
home_about|Über uns|About us|Rreth nesh
home_login|Anmelden|Sign in|Hyr
home_register|Konto erstellen|Create an account|Krijo llogari
language|Sprache|Language|Gjuha
home_live_tag|Deine BioBox, live|Your BioBox, live|BioBox-i yt në kohë reale
home_hero|Alles über deine BioBox. Auf einen Blick.|Your BioBox at a glance.|BioBox-i yt me një shikim.
home_intro|Sieh Temperatur, Feuchtigkeit und Zustand deiner BioBox in Echtzeit, ganz ohne die Seite neu zu laden.|Check the temperature, humidity and condition of your BioBox in real time without refreshing the page.|Shiko temperaturën, lagështinë dhe gjendjen e BioBox-it në kohë reale pa rifreskuar faqen.
home_open_dashboard|Dashboard öffnen|Open dashboard|Hap panelin
home_how|So funktioniert's|How it works|Si funksionon
home_readings|Messwerte|Readings|Matjet
home_live|Live|Live|Në kohë reale
home_history|Verlauf|History|Historiku
home_day|24 Stunden|24 hours|24 orë
home_sensors|Sensoren|Sensors|Sensorët
home_access|Zugriff|Access|Qasja
home_sign_in_required|Mit Anmeldung|Sign-in required|Me llogari
home_platform_label|DIE PLATTFORM|THE PLATFORM|PLATFORMA
home_overview|Alles im Blick.|Everything at a glance.|Gjithçka me një shikim.
home_features_intro|Die wichtigsten Funktionen der BioBox-Plattform, übersichtlich an einem Ort.|Explore the main features of the BioBox platform in one place.|Njihu me funksionet kryesore të platformës BioBox në një vend.
home_live_readings|Live-Messwerte|Live readings|Matjet në kohë reale
home_live_detail|Temperatur, Luftfeuchtigkeit, Bodenfeuchte und Licht werden automatisch aktualisiert.|Temperature, air humidity, soil moisture and light readings update automatically.|Të dhënat për temperaturën, lagështinë e ajrit, lagështinë e tokës dhe dritën përditësohen automatikisht.
home_charts|Datenvisualisierung|Data visualization|Paraqitja grafike e të dhënave
home_charts_detail|Diagramme machen Veränderungen und Entwicklungen über längere Zeiträume sichtbar.|Charts show how conditions change over time.|Grafikët tregojnë si ndryshojnë kushtet me kalimin e kohës.
home_status|Systemstatus & Warnungen|System status & alerts|Gjendja e sistemit dhe njoftimet
home_status_detail|Der Zustand deiner BioBox und wichtige Veränderungen werden übersichtlich dargestellt.|See the current condition of your BioBox and any important changes.|Shiko gjendjen aktuale të BioBox-it dhe çdo ndryshim të rëndësishëm.
home_secure|Sicherer Zugriff|Secure access|Qasje e sigurt
home_secure_detail|Benutzerkonten und Zugriffsrechte ermöglichen eine kontrollierte Nutzung der Plattform.|User accounts and permissions control access to the platform.|Llogaritë dhe të drejtat e përdoruesve përcaktojnë kush mund ta përdorë platformën.
home_discover|Plattform entdecken|Explore the platform|Zbulo platformën
home_technology|TECHNOLOGIE|TECHNOLOGY|TEKNOLOGJIA
home_tech_title|Von der Pflanze bis auf deinen Bildschirm.|From the plant to your screen.|Nga bima te ekrani yt.
home_tech_intro|Ein System, das Sensorik, Datenverarbeitung und Webplattform miteinander verbindet.|One system connects the sensors, data processing and web platform.|Një sistem lidh sensorët, përpunimin e të dhënave dhe platformën web.
home_measure|Messen|Measure|Matja
home_measure_detail|Die Sensoren erfassen laufend die wichtigsten Umgebungsbedingungen innerhalb der BioBox.|Sensors continuously monitor conditions inside the BioBox.|Sensorët matin vazhdimisht kushtet brenda BioBox-it.
home_process|Verarbeiten|Process|Përpunimi
home_process_detail|Die Messwerte werden an das Backend übertragen und in der Datenbank gespeichert.|The readings are sent to the server and stored in the database.|Vlerat e matura dërgohen në server dhe ruhen në bazën e të dhënave.
home_visualize|Visualisieren|Visualize|Vizualizimi
home_visualize_detail|Die Webplattform stellt aktuelle Werte, historische Entwicklungen und Systemzustände übersichtlich dar.|The platform displays current readings, trends over time and system status.|Platforma shfaq matjet aktuale, ndryshimet me kalimin e kohës dhe gjendjen e sistemit.
home_about_label|ÜBER BIOBOX|ABOUT BIOBOX|RRETH BIOBOX-IT
home_about_title|Technologie trifft Pflanzenwelt.|Where technology meets plant life.|Aty ku teknologjia takon botën e bimëve.
home_about_intro|BioBox verbindet intelligente Sensorik, automatisierte Steuerung und moderne Webtechnologie, um das Wachstum von Pflanzen nachvollziehbar und kontrollierbar zu machen.|BioBox combines smart sensors, automated controls and web technology so you can track plant growth and manage growing conditions.|BioBox bashkon sensorët inteligjentë, kontrollin automatik dhe teknologjinë web që të ndjekësh rritjen e bimëve dhe të kontrollosh kushtet e tyre.
home_about_project|Das Projekt wird im Rahmen einer Diplomarbeit entwickelt. Hardware, Datenbank und Webplattform arbeiten dabei als zusammenhängendes System.|BioBox is a diploma project. Its hardware, database and web platform work together as one system.|BioBox po zhvillohet si projekt diplome. Pajisjet, baza e të dhënave dhe platforma web punojnë së bashku si një sistem.
home_hardware|Hardware & Sensorik|Hardware & sensors|Pajisjet dhe sensorët
home_hardware_detail|Erfassung und Übertragung relevanter Messwerte.|Collecting and transmitting sensor readings.|Mbledhja dhe transmetimi i vlerave të matura.
home_software|Software & Daten|Software & data|Softueri dhe të dhënat
home_software_detail|Verarbeitung, Speicherung und Visualisierung der Informationen.|Processing, storing and displaying data.|Përpunimi, ruajtja dhe paraqitja e të dhënave.
home_faq|FAQ|FAQ|Pyetje të shpeshta
home_faq_title|Gut zu wissen.|Good to know.|Çfarë duhet të dish.
home_faq_intro|Antworten auf die wichtigsten Fragen rund um BioBox.|Answers to common questions about BioBox.|Përgjigje për pyetjet më të shpeshta rreth BioBox-it.
home_refresh_q|Muss ich die Seite neu laden, um neue Werte zu sehen?|Do I need to refresh the page to see new readings?|A duhet ta rifreskoj faqen për të parë matjet e reja?
home_refresh_a|Nein. Neue Messwerte erscheinen automatisch im Dashboard, sobald sie gespeichert wurden.|No. New readings appear on the dashboard automatically once they are saved.|Jo. Matjet e reja shfaqen automatikisht në panel sapo ruhen.
home_values_q|Welche Werte zeigt die Plattform an?|Which readings does the platform show?|Cilat matje shfaq platforma?
home_values_a|Temperatur, Luftfeuchtigkeit, Bodenfeuchtigkeit und Licht sowie historische Messwerte.|Temperature, air humidity, soil moisture and light levels, along with past readings.|Temperaturën, lagështinë e ajrit dhe të tokës, nivelin e dritës dhe matjet e mëparshme.
home_status_q|Was bedeuten die Statusanzeigen?|What do the status indicators mean?|Çfarë tregojnë treguesit e gjendjes?
home_status_a|Sie zeigen, ob Komponenten aktiv, inaktiv oder auffällig sind.|They show whether components are active, inactive or need attention.|Tregojnë nëse pjesët e sistemit janë aktive, joaktive ose kërkojnë vëmendje.
home_privacy_q|Wer kann meine Daten sehen?|Who can see my data?|Kush mund t’i shohë të dhënat e mia?
home_privacy_a|Angemeldete Personen mit den entsprechenden Zugriffsrechten.|Signed-in users with the appropriate permissions.|Përdoruesit që kanë hyrë në llogari dhe kanë të drejtat përkatëse.
home_cta|Behalte deine Pflanzen im Blick.|Keep an eye on your plants.|Ndiq gjendjen e bimëve të tua.
home_cta_detail|Melde dich an und entdecke die Möglichkeiten der BioBox-Plattform.|Sign in to explore what you can do with BioBox.|Hyr në llogari për të zbuluar çfarë mund të bësh me BioBox.
home_footer_detail|Intelligente Pflanzenüberwachung durch vernetzte Sensorik und moderne Webtechnologie.|Smart plant monitoring with connected sensors and web technology.|Monitorim inteligjent i bimëve me sensorë të lidhur dhe teknologji web.
home_platform|Plattform|Platform|Platforma
home_account|Konto|Account|Llogaria
home_legal|Impressum|Legal notice|Informacion ligjor
home_privacy|Datenschutz|Privacy|Privatësia
home_diploma|Ein Diplomarbeitsprojekt|A diploma project|Projekt diplome
`;

const locales = ['de', 'en', 'sq'];
const rows = text.trim().split('\n').map((line) => line.trim().split('|'));

function saveJson(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// Create one language file per language, keeping keys from other pages.
mkdirSync('messages', { recursive: true });

for (const [index, locale] of locales.entries()) {
  const path = `messages/${locale}.json`;
  const messages = existsSync(path)
    ? JSON.parse(readFileSync(path, 'utf8'))
    : {};

  for (const [key, ...translations] of rows) {
    messages[key] = translations[index];
  }

  saveJson(path, messages);
}

// Tell Paraglide where to find the three language files.
mkdirSync('project.inlang', { recursive: true });

saveJson('project.inlang/settings.json', {
  baseLocale: 'de',
  locales,
  modules: ['./node_modules/@inlang/plugin-message-format/dist/index.js'],
  'plugin.inlang.messageFormat': {
    pathPattern: './messages/{locale}.json'
  }
});

// Generate the JavaScript functions used by src/routes/+page.svelte.
await compile({
  project: './project.inlang',
  outdir: './src/lib/paraglide',
  strategy: ['cookie', 'baseLocale']
});

// Check the exact function that caused your 500 error.
const messages = await import('./src/lib/paraglide/messages.js');

for (const locale of locales) {
  console.log(`${locale}: ${messages.home_title({}, { locale })}`);
}