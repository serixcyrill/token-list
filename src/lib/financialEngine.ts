export type Currency = 'CHF' | 'EUR' | 'USD' | string;

export interface PlanMeta {
  readonly version: string;
  readonly währung: Currency;
  readonly land: string;
}

export interface Planung {
  readonly startjahr: number;
  readonly planungsHorizontJahre: number;
  readonly standardRentenalter: number;
  readonly berechnungsIntervall: 'jahr';
  readonly inflationAllgemein: number;
  readonly inflationEinkommen: number;
  readonly inflationAusgaben: number;
  readonly renditeLiquideMittel: number;
  readonly renditeVorsorge: number;
  readonly renditeAnlagen: number;
}

export interface WeitereEinkommenQuelle {
  readonly id: string;
  readonly bezeichnung: string;
  readonly betragProJahr: number;
  readonly startjahr: number;
  readonly endjahr: number;
  readonly steuerbar: boolean;
}

export interface VermoegensZufluss {
  readonly id: string;
  readonly jahr: number;
  readonly betrag: number;
  readonly beschreibung: string;
}

export interface Einkommen {
  readonly nettoMonat: number;
  readonly monatsAusgaben: number;
  readonly liquidesVermoegenStart: number;
  readonly weitereEinkommenQuellen: readonly WeitereEinkommenQuelle[];
  readonly vermoegensZufluss: readonly VermoegensZufluss[];
}

export interface LiquideMittelKonto {
  readonly saldoStart: number;
  readonly rendite: number;
}

export interface Saeule3aBank {
  readonly aktiv: boolean;
  readonly saldoHeute: number;
  readonly jahresEinzahlung: number;
  readonly rendite: number;
  readonly auszahlungsJahr: number;
}

export interface Saeule3aVersicherung {
  readonly aktiv: boolean;
  readonly praemieJahr: number;
  readonly erlebensfallSumme: number;
  readonly renditeIntern: number;
  readonly auszahlungsJahr: number;
}

export interface Saeule3bLebensversicherung {
  readonly aktiv: boolean;
  readonly praemieJahr: number;
  readonly erlebensfallSumme: number;
  readonly renditeIntern: number;
  readonly auszahlungsJahr: number;
}

export interface Pensionskasse {
  readonly pkAusweisVorhanden: boolean;
  readonly koordinierterLohn: number;
  readonly jahresBeitragArbeitnehmer: number;
  readonly jahresBeitragArbeitgeber: number;
  readonly altersGuthabenHeute: number;
  readonly technischerZins: number;
  readonly umwandlungsSatz: number;
}

export interface VorsorgeKonten {
  readonly liquideMittel: LiquideMittelKonto;
  readonly saeule3aBank: Saeule3aBank;
  readonly saeule3aVersicherung: Saeule3aVersicherung;
  readonly saeule3bLebensversicherung: Saeule3bLebensversicherung;
  readonly pensionskasse: Pensionskasse;
}

export interface KrankheitLohnfortzahlung {
  readonly dauerWochen: number;
  readonly prozentVomLohn: number;
}

export interface Krankentaggeld {
  readonly wartefristTage: number;
  readonly prozentVomMassgebendenLohn: number;
  readonly maximaleDauerTage: number;
}

export interface PrivateTodesfallKapital {
  readonly id: string;
  readonly betrag: number;
  readonly beschreibung: string;
}

export interface TodesfallLeistungen {
  readonly pkPartnerrenteJahr: number;
  readonly pkWaisenrenteProKindJahr: number;
  readonly ahvHinterlassenenRenteJahr: number;
  readonly privateTodesfallKapitalien: readonly PrivateTodesfallKapital[];
}

export interface ErwerbsunfaehigkeitLeistungen {
  readonly pkInvalidenrenteJahr: number;
  readonly ahvIvRenteJahr: number;
  readonly privateInvalidenrenteJahr: number;
}

export interface RisikoParameter {
  readonly krankheitLohnfortzahlung: KrankheitLohnfortzahlung;
  readonly krankentaggeld: Krankentaggeld;
  readonly todesfallLeistungen: TodesfallLeistungen;
  readonly erwerbsunfaehigkeitLeistungen: ErwerbsunfaehigkeitLeistungen;
}

export interface AnlageProfil {
  readonly fragebogenPunkte: number;
  readonly anlageStrategieName: string;
  readonly risikoToleranz: 'mittel' | 'tief' | 'hoch' | string;
  readonly anlageHorizontJahre: number;
  readonly ausschlussProdukte: readonly string[];
  readonly ausschlussBranchen: readonly string[];
}

export interface Person {
  readonly id: string;
  readonly rolle: 'hauptperson' | 'partner' | string;
  readonly nameAnzeigename: string;
  readonly geburtsdatum: string;
  readonly geschlecht: string;
  readonly zivilstand: string;
  readonly anzahlKinder: number;
  readonly ahvFehljahre: number;
  readonly steuerGemeindePLZ: string;
  readonly einkommen: Einkommen;
  readonly vorsorgeKonten: VorsorgeKonten;
  readonly risikoParameter: RisikoParameter;
  readonly anlageProfil: AnlageProfil;
}

export interface Liegenschaft {
  readonly aktiv: boolean;
  readonly verkehrswert: number;
  readonly eigenmittel: number;
  readonly bruttoEinkommenHaushaltJahr: number;
  readonly imputierterZinsSatz: number;
  readonly amortisationSatz: number;
  readonly unterhaltSatz: number;
}

export interface EinstellungenAusgabe {
  readonly erstesAusgabeJahr: number;
  readonly widgetsLayout: string;
  readonly steuernBerechnen: boolean;
  readonly sozialversicherungenBerechnen: boolean;
}

export interface PlanInput {
  readonly meta: PlanMeta;
  readonly planung: Planung;
  readonly personen: readonly Person[];
  readonly liegenschaft: Liegenschaft;
  readonly einstellungenAusgabe: EinstellungenAusgabe;
}

export interface EinkommenResult {
  nettoEinkommenJahr: number;
  weitereEinkommenJahr: number;
  gesamtNettoEinkommenJahr: number;
}

export interface AusgabenResult {
  lebenshaltungJahr: number;
  steuernJahr: number;
  gesamtAusgabenJahr: number;
}

export interface CashflowResult {
  sparquoteJahr: number;
  sonderZahlungenJahr: number;
}

export interface VermoegenResult {
  liquideMittelAnfang: number;
  liquideMittelEnde: number;
  saeule3aBankAnfang: number;
  saeule3aBankEnde: number;
  saeule3aVersicherungWert: number;
  saeule3bWert: number;
  pensionskasseAltersguthaben: number;
}

export interface RenteLeistungenResult {
  ahvRenteJahr: number;
  pkAltersrenteJahr: number;
  sonstigeRentenJahr: number;
}

export interface BasisSzenarioResult {
  einkommenJahr: number;
  ausgabenJahr: number;
  steuernJahr: number;
  vermoegenEndeJahr: number;
}

export interface ErwerbsunfaehigkeitResult {
  einkommenJahr: number;
  rentenJahr: number;
  gesamtMittelJahr: number;
  deckungsgrad: number;
}

export interface TodesfallResult {
  rentenJahr: number;
  kapitalisiert: number;
  deckungsgrad: number;
}

export interface SzenarienResult {
  basis: BasisSzenarioResult;
  erwerbsunfaehigkeit: ErwerbsunfaehigkeitResult;
  todesfall: TodesfallResult;
}

export interface PersonenJahresResult {
  personId: string;
  alter: number;
  phase: 'erwerb' | 'rente';
  einkommen: EinkommenResult;
  ausgaben: AusgabenResult;
  cashflow: CashflowResult;
  vermoegen: VermoegenResult;
  renteLeistungen: RenteLeistungenResult;
  szenarien: SzenarienResult;
}

export interface HaushaltJahresResult {
  gesamtVermoegenEndeJahr: number;
  gesamtEinkommenNettoJahr: number;
  gesamtAusgabenJahr: number;
}

export interface JahresResult {
  jahrIndex: number;
  kalenderjahr: number;
  personen: PersonenJahresResult[];
  haushalt: HaushaltJahresResult;
}

export interface TragbarkeitResult {
  verkehrswert: number;
  eigenmittel: number;
  fremdkapital: number;
  jahresKostenWohnen: number;
  tragbarkeitsQuote: number;
  tragbarNachBankstandard: boolean;
}

export interface KennzahlenResult {
  vermoegenBeiPensionierung: number;
  vermoegenMit80: number;
  vermoegenMit90: number;
  jahrMitGeldAufgebraucht: number | null;
}

export interface PlanOutput {
  meta: {
    version: string;
    berechnungsIntervall: 'jahr';
  };
  jahre: JahresResult[];
  tragbarkeit: TragbarkeitResult;
  kennzahlen: KennzahlenResult;
}

export type SteuerFunktion = (
  einkommen: number,
  vermoegen: number,
  person: Person
) => number;

interface PersonState {
  liquideMittel: number;
  saeule3aBank: number;
  saeule3aVersicherung: number;
  saeule3b: number;
  pensionskasse: number;
  letztesErwerbseinkommen: number;
}

const defaultSteuerFunktion: SteuerFunktion = (einkommen: number) => {
  if (einkommen <= 0) {
    return 0;
  }
  const einkommensSteuerquote = 0.15;
  return einkommen * einkommensSteuerquote;
};

const calculateAge = (birthDate: string, calendarYear: number) => {
  const birthYear = new Date(birthDate).getUTCFullYear();
  return calendarYear - birthYear;
};

const determinePhase = (age: number, rentenAlter: number): 'erwerb' | 'rente' =>
  age >= rentenAlter ? 'rente' : 'erwerb';

const inflatedValue = (basis: number, rate: number, jahre: number) =>
  basis * Math.pow(1 + rate, jahre);

const sumWeitereEinkommen = (
  quellen: readonly WeitereEinkommenQuelle[],
  jahr: number
) =>
  quellen
    .filter((quelle) => quelle.startjahr <= jahr && jahr <= quelle.endjahr)
    .reduce((sum, quelle) => sum + quelle.betragProJahr, 0);

const sumVermoegensZufluss = (
  zufluss: readonly VermoegensZufluss[],
  jahr: number
) =>
  zufluss
    .filter((entry) => entry.jahr === jahr)
    .reduce((sum, e) => sum + e.betrag, 0);

const calcAhvRente = (letztesEinkommen: number, fehljahre: number) => {
  const basisQuote = 0.4;
  const fehljahreAbzug = Math.max(0, fehljahre) * 0.01;
  const faktor = Math.max(0, basisQuote - fehljahreAbzug);
  return Math.max(0, letztesEinkommen * faktor);
};

const projectSaeule3aBank = (
  state: PersonState,
  konto: Saeule3aBank,
  kalenderjahr: number
) => {
  const aktuellerWert = state.saeule3aBank;
  if (!konto.aktiv) {
    return aktuellerWert;
  }
  const nachRendite = aktuellerWert * (1 + konto.rendite);
  const saldoNachEinzahlung =
    kalenderjahr <= konto.auszahlungsJahr
      ? nachRendite + konto.jahresEinzahlung
      : nachRendite;
  return kalenderjahr > konto.auszahlungsJahr ? 0 : saldoNachEinzahlung;
};

const projectVersicherung = (wert: number, praemie: number, rendite: number) =>
  wert * (1 + rendite) + praemie;

const projectPensionskasse = (state: PersonState, konto: Pensionskasse) => {
  const beitrag =
    konto.jahresBeitragArbeitnehmer + konto.jahresBeitragArbeitgeber;
  return (state.pensionskasse + beitrag) * (1 + konto.technischerZins);
};

const calcSonderZahlungen = () => 0;

const calcErwerbsunfaehigkeit = (
  person: Person,
  lebenshaltungJahr: number,
  steuerFn: SteuerFunktion
): ErwerbsunfaehigkeitResult => {
  const leistungen = person.risikoParameter.erwerbsunfaehigkeitLeistungen;
  const rentenJahr =
    leistungen.pkInvalidenrenteJahr +
    leistungen.ahvIvRenteJahr +
    leistungen.privateInvalidenrenteJahr;
  const steuern = steuerFn(rentenJahr, 0, person);
  const deckungsgrad =
    lebenshaltungJahr > 0 ? (rentenJahr - steuern) / lebenshaltungJahr : 0;
  return {
    einkommenJahr: 0,
    rentenJahr,
    gesamtMittelJahr: Math.max(0, rentenJahr - steuern),
    deckungsgrad,
  };
};

const calcTodesfall = (
  person: Person,
  lebenshaltungJahr: number,
  steuerFn: SteuerFunktion,
  barwertFaktor = 20
): TodesfallResult => {
  const leistungen = person.risikoParameter.todesfallLeistungen;
  const rentenJahr =
    leistungen.pkPartnerrenteJahr +
    leistungen.pkWaisenrenteProKindJahr * person.anzahlKinder +
    leistungen.ahvHinterlassenenRenteJahr;
  const kapitalisiert =
    leistungen.privateTodesfallKapitalien.reduce(
      (sum, eintrag) => sum + eintrag.betrag,
      0
    ) / barwertFaktor;
  const steuern = steuerFn(rentenJahr + kapitalisiert, 0, person);
  const deckungsgrad =
    lebenshaltungJahr > 0
      ? (rentenJahr + kapitalisiert - steuern) / lebenshaltungJahr
      : 0;
  return { rentenJahr, kapitalisiert, deckungsgrad };
};

export class FinancialPlanningEngine {
  constructor(
    private readonly steuerFn: SteuerFunktion = defaultSteuerFunktion
  ) {}

  run(plan: PlanInput): PlanOutput {
    const { planung, personen } = plan;
    const personStates = new Map<string, PersonState>();
    const jahre: JahresResult[] = [];

    for (
      let jahrIndex = 0;
      jahrIndex < planung.planungsHorizontJahre;
      jahrIndex += 1
    ) {
      const kalenderjahr = planung.startjahr + jahrIndex;
      const personenErgebnisse = personen.map((person) => {
        const state = this.ensureState(personStates, person);
        const age = calculateAge(person.geburtsdatum, kalenderjahr);
        const phase = determinePhase(age, planung.standardRentenalter);

        const nettoEinkommenJahr =
          phase === 'erwerb'
            ? inflatedValue(
                person.einkommen.nettoMonat * 12,
                planung.inflationEinkommen,
                jahrIndex
              )
            : 0;

        const weitereEinkommenJahr = sumWeitereEinkommen(
          person.einkommen.weitereEinkommenQuellen,
          kalenderjahr
        );

        const ahvRenteJahr =
          phase === 'rente'
            ? calcAhvRente(
                state.letztesErwerbseinkommen || nettoEinkommenJahr,
                person.ahvFehljahre
              )
            : 0;
        const pkAltersrenteJahr =
          phase === 'rente'
            ? state.pensionskasse *
              person.vorsorgeKonten.pensionskasse.umwandlungsSatz
            : 0;

        const sonstigeRentenJahr = 0;

        const rentenSumme =
          ahvRenteJahr + pkAltersrenteJahr + sonstigeRentenJahr;

        const gesamtNettoEinkommenJahr =
          phase === 'erwerb'
            ? nettoEinkommenJahr + weitereEinkommenJahr
            : rentenSumme + weitereEinkommenJahr;

        const lebenshaltungJahr = inflatedValue(
          person.einkommen.monatsAusgaben * 12,
          planung.inflationAusgaben,
          jahrIndex
        );

        const vermoegenStart =
          state.liquideMittel +
          state.saeule3aBank +
          state.saeule3aVersicherung +
          state.saeule3b +
          state.pensionskasse;

        const steuernJahr = this.steuerFn(
          gesamtNettoEinkommenJahr,
          vermoegenStart,
          person
        );
        const gesamtAusgabenJahr = lebenshaltungJahr + steuernJahr;
        const sparquoteJahr = gesamtNettoEinkommenJahr - gesamtAusgabenJahr;
        const sonderZahlungenJahr = calcSonderZahlungen();
        const vermoegensZufluss = sumVermoegensZufluss(
          person.einkommen.vermoegensZufluss,
          kalenderjahr
        );

        const liquideMittelAnfang = state.liquideMittel;
        const liquideMittelEnde =
          liquideMittelAnfang * (1 + planung.renditeLiquideMittel) +
          sparquoteJahr +
          vermoegensZufluss -
          sonderZahlungenJahr;

        const saeule3aBankAnfang = state.saeule3aBank;
        const saeule3aBankEnde = projectSaeule3aBank(
          state,
          person.vorsorgeKonten.saeule3aBank,
          kalenderjahr
        );

        const saeule3aVersicherungWert = projectVersicherung(
          state.saeule3aVersicherung,
          person.vorsorgeKonten.saeule3aVersicherung.praemieJahr,
          person.vorsorgeKonten.saeule3aVersicherung.renditeIntern
        );

        const saeule3bWert = projectVersicherung(
          state.saeule3b,
          person.vorsorgeKonten.saeule3bLebensversicherung.praemieJahr,
          person.vorsorgeKonten.saeule3bLebensversicherung.renditeIntern
        );

        const pensionskasseAltersguthaben = projectPensionskasse(
          state,
          person.vorsorgeKonten.pensionskasse
        );

        state.liquideMittel = liquideMittelEnde;
        state.saeule3aBank = saeule3aBankEnde;
        state.saeule3aVersicherung = saeule3aVersicherungWert;
        state.saeule3b = saeule3bWert;
        state.pensionskasse = pensionskasseAltersguthaben;
        state.letztesErwerbseinkommen =
          phase === 'erwerb'
            ? gesamtNettoEinkommenJahr
            : state.letztesErwerbseinkommen || gesamtNettoEinkommenJahr;

        const basisSzenario: BasisSzenarioResult = {
          einkommenJahr: gesamtNettoEinkommenJahr,
          ausgabenJahr: lebenshaltungJahr,
          steuernJahr,
          vermoegenEndeJahr:
            liquideMittelEnde +
            saeule3aBankEnde +
            saeule3aVersicherungWert +
            saeule3bWert,
        };

        const erwerbsunfaehigkeit = calcErwerbsunfaehigkeit(
          person,
          lebenshaltungJahr,
          this.steuerFn
        );

        const todesfall = calcTodesfall(
          person,
          lebenshaltungJahr,
          this.steuerFn
        );

        const result: PersonenJahresResult = {
          personId: person.id,
          alter: age,
          phase,
          einkommen: {
            nettoEinkommenJahr,
            weitereEinkommenJahr,
            gesamtNettoEinkommenJahr,
          },
          ausgaben: {
            lebenshaltungJahr,
            steuernJahr,
            gesamtAusgabenJahr,
          },
          cashflow: {
            sparquoteJahr,
            sonderZahlungenJahr,
          },
          vermoegen: {
            liquideMittelAnfang,
            liquideMittelEnde,
            saeule3aBankAnfang,
            saeule3aBankEnde,
            saeule3aVersicherungWert,
            saeule3bWert,
            pensionskasseAltersguthaben,
          },
          renteLeistungen: {
            ahvRenteJahr,
            pkAltersrenteJahr,
            sonstigeRentenJahr,
          },
          szenarien: {
            basis: basisSzenario,
            erwerbsunfaehigkeit,
            todesfall,
          },
        };

        return result;
      });

      const haushalt: HaushaltJahresResult = {
        gesamtEinkommenNettoJahr: personenErgebnisse.reduce(
          (sum, person) => sum + person.einkommen.gesamtNettoEinkommenJahr,
          0
        ),
        gesamtAusgabenJahr: personenErgebnisse.reduce(
          (sum, person) => sum + person.ausgaben.gesamtAusgabenJahr,
          0
        ),
        gesamtVermoegenEndeJahr: personenErgebnisse.reduce(
          (sum, person) =>
            sum +
            person.vermoegen.liquideMittelEnde +
            person.vermoegen.saeule3aBankEnde +
            person.vermoegen.saeule3aVersicherungWert +
            person.vermoegen.saeule3bWert +
            person.vermoegen.pensionskasseAltersguthaben,
          0
        ),
      };

      jahre.push({
        jahrIndex,
        kalenderjahr,
        personen: personenErgebnisse,
        haushalt,
      });
    }

    const tragbarkeit = this.calculateTragbarkeit(plan.liegenschaft);
    const kennzahlen = this.calculateKennzahlen(
      jahre,
      planung.standardRentenalter
    );

    return {
      meta: {
        version: plan.meta.version,
        berechnungsIntervall: 'jahr',
      },
      jahre,
      tragbarkeit,
      kennzahlen,
    };
  }

  private ensureState(
    states: Map<string, PersonState>,
    person: Person
  ): PersonState {
    if (!states.has(person.id)) {
      states.set(person.id, {
        liquideMittel:
          person.vorsorgeKonten.liquideMittel.saldoStart ||
          person.einkommen.liquidesVermoegenStart ||
          0,
        saeule3aBank: person.vorsorgeKonten.saeule3aBank.saldoHeute,
        saeule3aVersicherung:
          person.vorsorgeKonten.saeule3aVersicherung.erlebensfallSumme,
        saeule3b:
          person.vorsorgeKonten.saeule3bLebensversicherung.erlebensfallSumme,
        pensionskasse: person.vorsorgeKonten.pensionskasse.altersGuthabenHeute,
        letztesErwerbseinkommen: 0,
      });
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return states.get(person.id)!;
  }

  private calculateTragbarkeit(liegenschaft: Liegenschaft): TragbarkeitResult {
    if (!liegenschaft.aktiv) {
      return {
        verkehrswert: liegenschaft.verkehrswert,
        eigenmittel: liegenschaft.eigenmittel,
        fremdkapital: 0,
        jahresKostenWohnen: 0,
        tragbarkeitsQuote: 0,
        tragbarNachBankstandard: false,
      };
    }

    const fremdkapital = Math.max(
      0,
      liegenschaft.verkehrswert - liegenschaft.eigenmittel
    );
    const jahresKostenWohnen =
      fremdkapital * liegenschaft.imputierterZinsSatz +
      fremdkapital * liegenschaft.amortisationSatz +
      liegenschaft.verkehrswert * liegenschaft.unterhaltSatz;
    const tragbarkeitsQuote =
      liegenschaft.bruttoEinkommenHaushaltJahr > 0
        ? jahresKostenWohnen / liegenschaft.bruttoEinkommenHaushaltJahr
        : 0;
    const tragbarNachBankstandard =
      tragbarkeitsQuote <= 0.33 &&
      liegenschaft.eigenmittel >= liegenschaft.verkehrswert * 0.2;

    return {
      verkehrswert: liegenschaft.verkehrswert,
      eigenmittel: liegenschaft.eigenmittel,
      fremdkapital,
      jahresKostenWohnen,
      tragbarkeitsQuote,
      tragbarNachBankstandard,
    };
  }

  private calculateKennzahlen(
    jahre: JahresResult[],
    rentenAlter: number
  ): KennzahlenResult {
    const vermoegenBeiPensionierung = this.findVermoegenBeiAlter(
      jahre,
      rentenAlter
    );
    const vermoegenMit80 = this.findVermoegenBeiAlter(jahre, 80);
    const vermoegenMit90 = this.findVermoegenBeiAlter(jahre, 90);

    const jahrMitGeldAufgebraucht =
      jahre.find((jahr) => jahr.haushalt.gesamtVermoegenEndeJahr <= 0)
        ?.kalenderjahr ?? null;

    return {
      vermoegenBeiPensionierung,
      vermoegenMit80,
      vermoegenMit90,
      jahrMitGeldAufgebraucht,
    };
  }

  private findVermoegenBeiAlter(
    jahre: JahresResult[],
    zielalter: number
  ): number {
    const jahr = jahre.find((eintrag) =>
      eintrag.personen.some((person) => person.alter >= zielalter)
    );
    return jahr ? jahr.haushalt.gesamtVermoegenEndeJahr : 0;
  }
}
