# E-Scooter – Quellcode

Vollständige Webanwendung mit HTML, CSS, JavaScript, Scooter-Bild und lokalen Berliner Kartendaten.

## Lokal starten

1. ZIP-Datei entpacken.
2. Ein Terminal im entpackten Ordner `E-Scooter` öffnen.
3. Mit installiertem Python 3 ausführen:

   python -m http.server 8000 --directory dist

   Unter macOS/Linux bei Bedarf `python3` statt `python` verwenden.
4. Im Browser http://localhost:8000 öffnen.

Alternativ den Ordner `dist` über einen lokalen Webserver wie VS Code Live Server öffnen. Es gibt keinen Build-Schritt und keine npm-Installation.

## Code bearbeiten

- `dist/index.html`: Struktur und Inhalte
- `dist/styles.css`: Gestaltung und responsive Ansichten
- `dist/app.js`: Suche, Filter, Karte, Reservierungen und Fahrten
- `dist/assets/`: Bilder, Kartendaten und Leaflet
- `qa/flows.cjs`: Funktionsprüfungen; mit `node qa/flows.cjs` ausführen

## Grenzen

Die Anwendung ist eine Demo. Es gibt keine echte Fahrzeugentsperrung, Zahlung oder Anbieter-Anbindung. Reservierungen und Fahrten werden ausschließlich im Browser gespeichert. Die Gehzeiten und Scooter-Daten sind Beispieldaten, die Kartenverbindung ist keine Fußgängerroute.


---

# E-Scooter Berlin

Responsive German E-Scooter rental demo, closely following the supplied reference mockup. Static HTML/CSS/JavaScript with a vendored Leaflet 1.9.4 map and locally bundled Berlin basemap tiles.

## Functionality
- Eight example scooters; case-insensitive search, proximity ordering, battery filter.
- Interactive, keyboard-accessible Berlin map, selectable markers, zoom and pan.
- Ten-minute free demo reservations, cancellation and expiry.
- Simulated rides with elapsed time and rounded-up per-minute example pricing.
- Browser-local ride history, profile reset, help and mobile list/map switching.
- Feature-detected WebMCP search action with input validation.

No real vehicle API, account system, payment processing, geolocation or road routing is connected. Scooter data and walking times are examples. The dotted map connection is an orientation line. All reservation/history state stays in the current browser's localStorage. Use the same device/browser to continue a demo ride.

## Validation
`node --check dist/app.js`
`node qa/flows.cjs`
The DOM-harness checks search, filters, no results, reservation, one active session, timer pricing, completion, local state, cancellation, expiry and WebMCP registration/valid and invalid inputs. HTML asset paths and all 49 map PNGs were validated. Full browser/rendering QA and native WebMCP validation were unavailable for the static-site execution profile.

## Asset credits
- Map data: © OpenStreetMap contributors, https://www.openstreetmap.org/copyright
- Basemap: © CARTO, https://carto.com/attributions (light_all, zoom 14 Berlin excerpt; attribution in map)
- Leaflet 1.9.4: https://leafletjs.com (BSD-2-Clause; license included)
- Scooter product image: generated for this site.
- DM Sans: Google Fonts (with local system-font fallbacks).

