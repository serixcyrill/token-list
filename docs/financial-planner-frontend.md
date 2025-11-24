# Finanzplaner Web-Frontend (Vemo Stil)

Konzeptuelle Spezifikation einer Single-Page-Anwendung, die die Eingabestruktur aus ANWEISUNG 1 nutzt und die Rechenergebnisse der Engine aus ANWEISUNG 2 visualisiert. Der Fokus liegt auf einem modernen Vemo-Design mit klarer Mehrschritt-Führung.

## Design Leitplanken
- **Primärfarbe:** Vemo-Grün `#76D062`; Highlights und Call-to-Actions (CTA).
- **Textfarbe:** Dunkel `#0F172A` für maximale Lesbarkeit.
- **Hintergrund:** Hell (`#F4F5F7` oder Weiß) mit großzügigem Weißraum.
- **Karten & Panels:** Abgerundete Ecken (8–12px), leichter Schatten, dezente Rahmenlinien.
- **Typografie:** Poppins (Fallback: systemnahe serifenlose Schriften); klare Hierarchien über Gewichtung und Größe.
- **Statusfarben:**
  - Grün: Pflichtfelder vollständig und valide.
  - Neutral/Blau-Grau: Noch offen oder optional.
  - Rot: Validierungsfehler inline hervorgehoben.

## Grundlayout
- **Linke vertikale Navigation (schmal):** Icons + Labels für Kontakte, Mandate, Tätigkeiten, Dokumente, Produkte, Analysen. Hover-Tooltips, aktiver Zustand in Primärfarbe.
- **Horizontaler Prozessbalken oben:** Vier Schritte mit Fortschrittsanzeige: Bedarf → Einkommen & Vermögen → Risikoprofil & Ziele → Vorsorgedaten & Simulation. Klickbar, aber mit Warnung bei ungelösten Validierungsfehlern.
- **Arbeitsbereich:** Zweispaltiges Card-Grid (responsive auf eine Spalte <1024px). Linke Spalte für Kerninputs, rechte Spalte für ergänzende Angaben.
- **Rechtes Info-/Assistenz-Panel:** Kontextuelle Hinweise, Validierungshinweise, Chat/Coaching, Live-Kennzahlen (Vermögenskurve, Deckungsgrade, Tragbarkeit).
- **Header-Actions:** Export (PDF Basis-/Vorsorgeanalyse, Risiko-Tabellen), Speichern & Schließen.

## Schrittweise Oberfläche
### Schritt 1: Bedarf
- **Karte 1:** Zivilstand, Geschlecht, Geburtsdatum, Konfession, AHV-Fehljahre. Statusindikator oben rechts.
- **Karte 2:** Adresse, Kontakt, Beratungsdatum, Planname.
- **Karte 3:** Einkommen (nettoMonat), Ausgaben (monatsAusgaben), liquidesVermögenStart.
- **Karte 4:** Weitere Einkommensquellen (Liste mit Zeitraum, steuerbar) und PLZ der Steuer-Gemeinde.

### Schritt 2: Einkommen und Vermögen
- **Karte 1:** Liegenschaften (Verkehrswert, Steuerwert, Eigenmietwert, imputierter Zins).
- **Karte 2:** Hypotheken/Schulden inkl. Amortisation.
- **Karte 3:** Säule 3a (Bank & Versicherung) mit Einzahlungen, Rendite, Auszahlungsjahr.
- **Karte 4:** Säule 3b Lebens-/Sparversicherungen.
- **Karte 5:** Kundenwünsche, künftiger Vermögenszufluss, Pensionskassenausweise (Upload/Status).

### Schritt 3: Risikoprofil, Anlageziele, Formalitäten, Finanzziele
- **Risiko-Fragebogen:** ~9 Fragen, Punkte-Slider; Summenbalken für Risikoaffinität.
- **Freitextbereiche:** Anlagezweck, Anlagehorizont, Ausschlüsse (Produkte/Branchen).
- **Formalitäten (Ja/Nein):** Bestätigung Risikoprofil, Broschüren erhalten.
- **Finanzziele:** Ja/Nein-Queries, Zielrentenalter-Eingabe; Hinweis auf StandardRentenalter.

### Schritt 4: Vorsorgedaten & Simulation
- **Karten:**
  - Lohnfortzahlung, Krankentaggeld, Todesfallleistungen, Erwerbsunfähigkeit, garantierte PK-Renten.
  - Neue Anlageempfehlungen (Anlageart, Zins, erwartete Entwicklung) optional.
  - Dokumente-Upload, Planungs-Horizont (planungsHorizontJahre) & Ausgabejahr (erstesAusgabeJahr), Zahlungsstatus.
  - Simulation Tragbarkeit Liegenschaft: Eingabefelder, sofortige Berechnung (tragbarkeitsQuote, Bankstandard).
- **Ergebnis-Tab:** Kennzahlen-Widgets für Vermögensverlauf, Deckungsgrade (Erwerbsunfähigkeit/Todesfall), Tragbarkeit. Live-Update nach relevanten Änderungen.

## Interaktion & UX
- **Schritt-Aktionen:** Fußzeile je Schritt mit „Speichern & weiter“, „Speichern & schließen“.
- **Inline-Validation:** Sofortige Fehlermarkierung (rot), Tooltip/Hinweis im Info-Panel. Kartenstatus oben farblich.
- **Autosave/Entwürfe:** Änderungen puffern; Hinweis bei Navigation, falls Validierungsfehler bestehen.
- **Simulation:** Hintergrund-Trigger nach Feldänderungen; Debounce, optimistic UI. Ergebnisgrafiken in separatem Tab oder rechtem Panel.
- **Keyboard & Barrierefreiheit:** Fokusreihenfolge logisch, ARIA-Labels, hohe Kontraste gemäß Designfarben.

## Datenflüsse & Architektur
- **Framework-Empfehlung:** React oder Vue als SPA; State-Management via Zustand/Redux/Pinia; Routing für Schritte.
- **Datenmodell:** Direkte Bindung an Eingabe-JSON (ANWEISUNG 1). Pro Schritt fokussierte Slices (personen, vorsorgeKonten, liegenschaft, risikoparameter etc.).
- **Engine-Integration:** Client sendet Eingabe-JSON an die Rechenengine (ANWEISUNG 2) per klar definierten JSON-Requests; erhält Jahresarray, Tragbarkeit, Kennzahlen.
- **Caching & Versionierung:** meta.version und meta.berechnungsIntervall prüfen; Warnung bei Schemaabweichung.
- **Validierungen:**
  - Pflichtfelder pro Karte definieren; Statusindikator basiert auf Validität.
  - Plausibilitäten (z.B. Auszahlungsjahr ≥ aktuelles Jahr, Renditen in erwarteten Bändern).
  - Numerische Felder mit Einheiten/Maskierung (CHF, %, Jahr).
- **Sicherheit:** Input-Sanitizing für Freitext, Upload-Handling mit Virenscan (Server-seitig angenommen), TLS für alle Calls.

## Komponenten-Skizze (React-Beispiel)
- `AppShell` (Layout, Navigation, Header mit Export-Action).
- `StepProgress` (Prozessbalken, Schrittwechsel mit Validierungswarnung).
- `CardGrid` / `Card` (zweispaltiges Layout, Statusbadge, Header-Icons).
- Schritt-Container: `NeedStep`, `IncomeWealthStep`, `RiskGoalsStep`, `PensionStep`.
- Form-Sektionen: z.B. `CivilStatusCard`, `ContactPlanCard`, `IncomeExpenseCard`, `AdditionalIncomeCard`, `PropertyCard`, `LiabilitiesCard`, `Pillar3aCard`, `Pillar3bCard`, `WishesInflowsCard`, `RiskQuestionnaire`, `ObjectivesForm`, `FormalityToggles`, `InsuranceCards`, `AffordabilitySimulator`.
- `InsightPanel` (Kennzahlen, Hinweise, Chat), `ResultTabs` (Vermögenskurve, Deckungsgrade, Tragbarkeit), `ExportMenu`.

## Zustands- & Berechnungslogik
- **Lokaler Schritt-State** mit Validation-Status pro Karte.
- **Globaler Planner-State** spiegelt das gesamte Eingabe-JSON; Änderungen pro Feld sofort synchronisieren.
- **Rechenengine-Trigger:**
  - On Change relevanter Felder (Debounce) → POST an Engine → Update Ergebnis-Slices (jahre, tragbarkeit, kennzahlen).
  - Fehlerhandling: Toast + Hinweis im Info-Panel.
- **Offline/Pending Anzeige:** Spinner im Ergebnis-Tab, diff-basierte Hervorhebung neuer Kennzahlen.

## Reporting
- **Export-Button (Header):** Menü für PDF-Reports (Basisanalyse, Vorsorgeanalyse, Risiko-Tabellen). Nutzung der Engine-Outputs + Eingabedaten.
- **Branding:** Primärfarbe und Typografie konsistent; Deckblatt mit Kundennamen/Planname; Tabellen mit Kartenstil (leichte Schatten, abgerundet).

## Responsives Verhalten
- Navigation einklappbar auf Mobile/Tablet (Icons-only). Prozessbalken als Scroll-Pills.
- Cards stapeln untereinander bei kleinen Breakpoints; Info-Panel als Bottom-Sheet.
- Form-Controls großflächig, Touch-optimiert.

## Erweiterbarkeit
- Mehrmandantenfähig über Context (Mandatsauswahl links).
- Mehrsprachigkeit via i18n (de/fr/it/en) mit Fallback; Währung/Steuerlogik ableitbar aus meta.land/meta.währung.
- Theming: Dark Mode optional; Primärfarbe variabel, aber Standard Vemo-Grün.
