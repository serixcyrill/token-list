import {
  FinancialPlanningEngine,
  PlanInput,
  PlanOutput,
} from './financialEngine';

export interface FrontendField {
  readonly label: string;
  readonly path: string;
  readonly type: 'text' | 'number' | 'date' | 'select' | 'currency' | 'boolean';
  readonly required?: boolean;
  readonly helper?: string;
}

export interface FrontendCard {
  readonly id: string;
  readonly title: string;
  readonly fields: readonly FrontendField[];
  readonly status?: 'valid' | 'open' | 'error';
}

export interface FrontendStep {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly cards: readonly FrontendCard[];
  readonly ctaLabel: string;
}

export const VEMO_STEPS: readonly FrontendStep[] = [
  {
    id: 'bedarf',
    title: 'Bedarf',
    description:
      'Stammdaten und Grundannahmen zum Haushalt für die Planberechnung erfassen.',
    ctaLabel: 'Speichern & weiter',
    cards: [
      {
        id: 'basis',
        title: 'Zivilstand & Personendaten',
        status: 'open',
        fields: [
          {
            label: 'Zivilstand',
            path: 'personen[].zivilstand',
            type: 'select',
            required: true,
          },
          {
            label: 'Geschlecht',
            path: 'personen[].geschlecht',
            type: 'select',
            required: true,
          },
          {
            label: 'Geburtsdatum',
            path: 'personen[].geburtsdatum',
            type: 'date',
            required: true,
          },
          {
            label: 'Konfession',
            path: 'personen[].steuerGemeindePLZ',
            type: 'text',
            helper: 'Wird mit Steuer-PLZ für Tarife genutzt.',
          },
          {
            label: 'AHV-Fehljahre',
            path: 'personen[].ahvFehljahre',
            type: 'number',
          },
        ],
      },
      {
        id: 'kontakt',
        title: 'Kontakt & Plan',
        status: 'open',
        fields: [
          { label: 'Adresse', path: 'personen[].adresse', type: 'text' },
          { label: 'E-Mail', path: 'personen[].email', type: 'text' },
          { label: 'Telefon', path: 'personen[].telefon', type: 'text' },
          {
            label: 'Beratungsdatum',
            path: 'planung.startjahr',
            type: 'number',
          },
          { label: 'Planname', path: 'meta.version', type: 'text' },
        ],
      },
      {
        id: 'budget',
        title: 'Einkommen & Ausgaben',
        status: 'open',
        fields: [
          {
            label: 'Netto-Monatseinkommen',
            path: 'personen[].einkommen.nettoMonat',
            type: 'currency',
            required: true,
          },
          {
            label: 'Monatsausgaben',
            path: 'personen[].einkommen.monatsAusgaben',
            type: 'currency',
            required: true,
          },
          {
            label: 'Liquides Vermögen (Start)',
            path: 'personen[].einkommen.liquidesVermoegenStart',
            type: 'currency',
          },
        ],
      },
      {
        id: 'weitere-einkommen',
        title: 'Weitere Einkünfte & Steuer-PLZ',
        status: 'open',
        fields: [
          {
            label: 'Weitere Einkommensquellen',
            path: 'personen[].einkommen.weitereEinkommenQuellen[]',
            type: 'currency',
          },
          {
            label: 'Steuer-PLZ',
            path: 'personen[].steuerGemeindePLZ',
            type: 'text',
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: 'einkommen-vermoegen',
    title: 'Einkommen & Vermögen',
    description: 'Sachwerte, Schulden und Vorsorgeguthaben erfassen.',
    ctaLabel: 'Speichern & weiter',
    cards: [
      {
        id: 'liegenschaften',
        title: 'Liegenschaften',
        status: 'open',
        fields: [
          {
            label: 'Verkehrswert',
            path: 'liegenschaft.verkehrswert',
            type: 'currency',
          },
          {
            label: 'Eigenmittel',
            path: 'liegenschaft.eigenmittel',
            type: 'currency',
          },
          {
            label: 'Eigenmietwert',
            path: 'liegenschaft.imputierterZinsSatz',
            type: 'number',
          },
        ],
      },
      {
        id: 'hypotheken',
        title: 'Hypotheken & Schulden',
        status: 'open',
        fields: [
          {
            label: 'Amortisationssatz',
            path: 'liegenschaft.amortisationSatz',
            type: 'number',
            helper: 'Bankstandard ca. 1% des Fremdkapitals.',
          },
        ],
      },
      {
        id: 'saeule3a',
        title: 'Säule 3a (Bank & Versicherung)',
        status: 'open',
        fields: [
          {
            label: 'Bank: Saldo heute',
            path: 'personen[].vorsorgeKonten.saeule3aBank.saldoHeute',
            type: 'currency',
          },
          {
            label: 'Bank: Jahres-Einzahlung',
            path: 'personen[].vorsorgeKonten.saeule3aBank.jahresEinzahlung',
            type: 'currency',
          },
          {
            label: 'Versicherung: Prämie/Jahr',
            path: 'personen[].vorsorgeKonten.saeule3aVersicherung.praemieJahr',
            type: 'currency',
          },
        ],
      },
      {
        id: 'saeule3b',
        title: 'Säule 3b Lebens-/Sparversicherungen',
        status: 'open',
        fields: [
          {
            label: 'Prämie/Jahr',
            path:
              'personen[].vorsorgeKonten.saeule3bLebensversicherung.praemieJahr',
            type: 'currency',
          },
          {
            label: 'Erlebensfall-Summe',
            path:
              'personen[].vorsorgeKonten.saeule3bLebensversicherung.erlebensfallSumme',
            type: 'currency',
          },
        ],
      },
      {
        id: 'wuensche',
        title: 'Wünsche & künftige Zuflüsse',
        status: 'open',
        fields: [
          {
            label: 'Geplanter Vermögenszufluss',
            path: 'personen[].einkommen.vermoegensZufluss[]',
            type: 'currency',
          },
          {
            label: 'PK-Ausweis vorhanden',
            path: 'personen[].vorsorgeKonten.pensionskasse.pkAusweisVorhanden',
            type: 'boolean',
          },
        ],
      },
    ],
  },
  {
    id: 'risiko-anlage',
    title: 'Risikoprofil & Ziele',
    description: 'Risikofragen, Anlageziele und Formalitäten festhalten.',
    ctaLabel: 'Speichern & weiter',
    cards: [
      {
        id: 'risikofragen',
        title: 'Risiko-Fragebogen',
        status: 'open',
        fields: [
          {
            label: 'Fragebogen Punkte',
            path: 'personen[].anlageProfil.fragebogenPunkte',
            type: 'number',
            required: true,
          },
          {
            label: 'Risikotoleranz',
            path: 'personen[].anlageProfil.risikoToleranz',
            type: 'select',
            required: true,
          },
          {
            label: 'Anlagehorizont (Jahre)',
            path: 'personen[].anlageProfil.anlageHorizontJahre',
            type: 'number',
          },
        ],
      },
      {
        id: 'anlageziele',
        title: 'Anlageziele & Ausschlüsse',
        status: 'open',
        fields: [
          {
            label: 'Anlagestrategie',
            path: 'personen[].anlageProfil.anlageStrategieName',
            type: 'text',
          },
          {
            label: 'Ausschluss Produkte',
            path: 'personen[].anlageProfil.ausschlussProdukte[]',
            type: 'text',
          },
          {
            label: 'Ausschluss Branchen',
            path: 'personen[].anlageProfil.ausschlussBranchen[]',
            type: 'text',
          },
        ],
      },
      {
        id: 'formalitaeten',
        title: 'Formalitäten & Finanzziele',
        status: 'open',
        fields: [
          {
            label: 'Zielrentenalter',
            path: 'planung.standardRentenalter',
            type: 'number',
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: 'vorsorgedaten',
    title: 'Vorsorgedaten & Simulation',
    description:
      'Leistungen bei Krankheit, Tod, Erwerbsunfähigkeit sowie Simulation der Tragbarkeit.',
    ctaLabel: 'Speichern & schließen',
    cards: [
      {
        id: 'lohnfortzahlung',
        title: 'Lohnfortzahlung & Krankentaggeld',
        status: 'open',
        fields: [
          {
            label: 'Lohnfortzahlung Wochen',
            path:
              'personen[].risikoParameter.krankheitLohnfortzahlung.dauerWochen',
            type: 'number',
          },
          {
            label: 'KTG Wartefrist (Tage)',
            path: 'personen[].risikoParameter.krankentaggeld.wartefristTage',
            type: 'number',
          },
        ],
      },
      {
        id: 'todesfall',
        title: 'Todesfallleistungen',
        status: 'open',
        fields: [
          {
            label: 'PK Partnerrente/Jahr',
            path:
              'personen[].risikoParameter.todesfallLeistungen.pkPartnerrenteJahr',
            type: 'currency',
          },
          {
            label: 'AHV Hinterlassenenrente/Jahr',
            path:
              'personen[].risikoParameter.todesfallLeistungen.ahvHinterlassenenRenteJahr',
            type: 'currency',
          },
          {
            label: 'Private Todesfallkapitalien',
            path:
              'personen[].risikoParameter.todesfallLeistungen.privateTodesfallKapitalien[]',
            type: 'currency',
          },
        ],
      },
      {
        id: 'erwerbsunfaehigkeit',
        title: 'Erwerbsunfähigkeit',
        status: 'open',
        fields: [
          {
            label: 'PK Invalidenrente/Jahr',
            path:
              'personen[].risikoParameter.erwerbsunfaehigkeitLeistungen.pkInvalidenrenteJahr',
            type: 'currency',
          },
          {
            label: 'AHV/IV Rente/Jahr',
            path:
              'personen[].risikoParameter.erwerbsunfaehigkeitLeistungen.ahvIvRenteJahr',
            type: 'currency',
          },
        ],
      },
      {
        id: 'simulation',
        title: 'Simulation & Einstellungen',
        status: 'open',
        fields: [
          {
            label: 'Planungs-Horizont (Jahre)',
            path: 'planung.planungsHorizontJahre',
            type: 'number',
          },
          {
            label: 'Erstes Ausgabejahr',
            path: 'einstellungenAusgabe.erstesAusgabeJahr',
            type: 'number',
          },
          {
            label: 'Tragbarkeit Verkehrswert',
            path: 'liegenschaft.verkehrswert',
            type: 'currency',
          },
        ],
      },
    ],
  },
];

export const SAMPLE_PLAN_INPUT: PlanInput = {
  meta: { version: '1.0', währung: 'CHF', land: 'CH' },
  planung: {
    startjahr: 2025,
    planungsHorizontJahre: 40,
    standardRentenalter: 65,
    berechnungsIntervall: 'jahr',
    inflationAllgemein: 0.008,
    inflationEinkommen: 0.008,
    inflationAusgaben: 0.008,
    renditeLiquideMittel: 0.01,
    renditeVorsorge: 0.02,
    renditeAnlagen: 0.03,
  },
  personen: [
    {
      id: 'person1',
      rolle: 'hauptperson',
      nameAnzeigename: 'Herr Muster',
      geburtsdatum: '1975-11-06',
      geschlecht: 'm',
      zivilstand: 'ledig',
      anzahlKinder: 1,
      ahvFehljahre: 0,
      steuerGemeindePLZ: '8000',
      einkommen: {
        nettoMonat: 6000,
        monatsAusgaben: 5000,
        liquidesVermoegenStart: 0,
        weitereEinkommenQuellen: [
          {
            id: 'nebenjob1',
            bezeichnung: 'Nebenerwerb',
            betragProJahr: 0,
            startjahr: 2025,
            endjahr: 9999,
            steuerbar: true,
          },
        ],
        vermoegensZufluss: [
          { id: 'erbschaft1', jahr: 2030, betrag: 0, beschreibung: 'Zufluss' },
        ],
      },
      vorsorgeKonten: {
        liquideMittel: { saldoStart: 0, rendite: 0.01 },
        saeule3aBank: {
          aktiv: true,
          saldoHeute: 0,
          jahresEinzahlung: 0,
          rendite: 0.015,
          auszahlungsJahr: 2040,
        },
        saeule3aVersicherung: {
          aktiv: false,
          praemieJahr: 0,
          erlebensfallSumme: 0,
          renditeIntern: 0.01,
          auszahlungsJahr: 2040,
        },
        saeule3bLebensversicherung: {
          aktiv: false,
          praemieJahr: 0,
          erlebensfallSumme: 0,
          renditeIntern: 0.01,
          auszahlungsJahr: 2040,
        },
        pensionskasse: {
          pkAusweisVorhanden: false,
          koordinierterLohn: 0,
          jahresBeitragArbeitnehmer: 0,
          jahresBeitragArbeitgeber: 0,
          altersGuthabenHeute: 0,
          technischerZins: 0.01,
          umwandlungsSatz: 0.065,
        },
      },
      risikoParameter: {
        krankheitLohnfortzahlung: { dauerWochen: 3, prozentVomLohn: 0.8 },
        krankentaggeld: {
          wartefristTage: 3,
          prozentVomMassgebendenLohn: 0.8,
          maximaleDauerTage: 720,
        },
        todesfallLeistungen: {
          pkPartnerrenteJahr: 0,
          pkWaisenrenteProKindJahr: 0,
          ahvHinterlassenenRenteJahr: 0,
          privateTodesfallKapitalien: [
            { id: 'todesfallPolice1', betrag: 0, beschreibung: 'Todesfall' },
          ],
        },
        erwerbsunfaehigkeitLeistungen: {
          pkInvalidenrenteJahr: 0,
          ahvIvRenteJahr: 0,
          privateInvalidenrenteJahr: 0,
        },
      },
      anlageProfil: {
        fragebogenPunkte: 0,
        anlageStrategieName: '',
        risikoToleranz: 'mittel',
        anlageHorizontJahre: 20,
        ausschlussProdukte: [],
        ausschlussBranchen: [],
      },
    },
  ],
  liegenschaft: {
    aktiv: false,
    verkehrswert: 0,
    eigenmittel: 0,
    bruttoEinkommenHaushaltJahr: 0,
    imputierterZinsSatz: 0.05,
    amortisationSatz: 0.01,
    unterhaltSatz: 0.01,
  },
  einstellungenAusgabe: {
    erstesAusgabeJahr: 2025,
    widgetsLayout: 'zweispaltig',
    steuernBerechnen: true,
    sozialversicherungenBerechnen: true,
  },
};

const defaultEngine = new FinancialPlanningEngine();

export const runFinancialPlan = (
  input: PlanInput = SAMPLE_PLAN_INPUT,
  engine: FinancialPlanningEngine = defaultEngine
): PlanOutput => engine.run(input);
