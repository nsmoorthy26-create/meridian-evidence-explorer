export type MeridianResult = {
  id: string;
  name: string;
  type: "PROGRAM" | "FIELD";
  title: string;
  description: string;
  business: string;
  risk: "CRITICAL" | "HIGH" | "MEDIUM";
  source: string;
  sourceRange: string;
  file: string;
  code: string[];
  paragraphs: string[];
  relationships: { name: string; count: number }[];
};

export const INITIAL_RESULT_COUNT = 3;
export const RESULTS_PER_PAGE = 3;

export const meridianResults: MeridianResult[] = [
  {
    id: "glpost01",
    name: "GLPOST01",
    type: "PROGRAM",
    title: "General Ledger posting program",
    description: "Posts settlement entries to the general ledger after tax calculation.",
    business: "General",
    risk: "CRITICAL",
    source: "GLPOST01.cbl",
    sourceRange: "L212–248",
    file: "GLPOST01.cbl",
    code: [
      "PERFORM 2100-CALC-TAX",
      "MOVE WS-BUS-DATE TO GL-POST-DATE",
      "EXEC SQL INSERT INTO GL_ENTRY",
    ],
    paragraphs: ["1000-INIT", "2100-CALC-TAX", "3000-POST-ENTRY", "3100-WRITE-GL", "9000-CLOSE"],
    relationships: [
      { name: "CALLS_PROGRAM", count: 5 },
      { name: "INCLUDES_COPYBOOK", count: 3 },
      { name: "EXECUTES_SQL", count: 4 },
      { name: "REFERENCES_TABLE", count: 2 },
      { name: "READS_FILE", count: 2 },
      { name: "WRITES_FILE", count: 1 },
      { name: "SHARES_DATA_WITH", count: 6 },
    ],
  },
  {
    id: "ws-bus-date",
    name: "WS-BUS-DATE",
    type: "FIELD",
    title: "Business processing date",
    description: "The business date used to stamp settlement ledger entries.",
    business: "Business",
    risk: "MEDIUM",
    source: "SETTLE01.cbl",
    sourceRange: "L58–61",
    file: "SETTLE01.cbl",
    code: ["MOVE WS-BUS-DATE TO GL-POST-DATE", "IF WS-BUS-DATE > ZERO", "PERFORM 3000-POST-ENTRY"],
    paragraphs: ["0000-SETUP", "1000-READ-DATE", "2000-VALIDATE-DATE", "3000-POST-ENTRY"],
    relationships: [
      { name: "REFERENCES_TABLE", count: 2 },
      { name: "SHARES_DATA_WITH", count: 4 },
      { name: "CALLS_PROGRAM", count: 3 },
      { name: "READS_FILE", count: 2 },
    ],
  },
  {
    id: "settle01",
    name: "SETTLE01",
    type: "PROGRAM",
    title: "Trade settlement finalisation",
    description: "Finalises settlement and calls GLPOST01 to post ledger entries.",
    business: "Trade",
    risk: "HIGH",
    source: "SETTLE01.cbl",
    sourceRange: "L140–196",
    file: "SETTLE01.cbl",
    code: ["PERFORM 1400-MATCH-TRADE", "CALL 'GLPOST01' USING SETTLE-RECORD", "MOVE 'COMPLETE' TO SETTLE-STATUS"],
    paragraphs: ["1000-INIT", "1400-MATCH-TRADE", "1600-SETTLE-TRADE", "1900-CLOSE"],
    relationships: [
      { name: "CALLS_PROGRAM", count: 5 },
      { name: "READS_FILE", count: 3 },
      { name: "WRITES_FILE", count: 2 },
      { name: "SHARES_DATA_WITH", count: 6 },
    ],
  },
  {
    id: "recon02",
    name: "RECON02",
    type: "PROGRAM",
    title: "Settlement reconciliation",
    description: "Compares posted entries with trade settlement records.",
    business: "Reconciliation",
    risk: "HIGH",
    source: "RECON02.cbl",
    sourceRange: "L88–132",
    file: "RECON02.cbl",
    code: ["READ SETTLEMENT-FILE", "EXEC SQL SELECT FROM GL_ENTRY", "PERFORM 9000-REPORT-EXCEPTIONS"],
    paragraphs: ["1000-INIT", "2000-READ-SETTLEMENT", "3000-COMPARE-ENTRIES", "9000-REPORT-EXCEPTIONS"],
    relationships: [
      { name: "COUPLED_VIA_SQL", count: 4 },
      { name: "REFERENCES_TABLE", count: 3 },
      { name: "READS_FILE", count: 3 },
    ],
  },
  {
    id: "cpygl",
    name: "CPYGL",
    type: "FIELD",
    title: "General ledger copybook",
    description: "Shared ledger record layout included by posting programs.",
    business: "General",
    risk: "MEDIUM",
    source: "CPYGL.cpy",
    sourceRange: "L1–42",
    file: "CPYGL.cpy",
    code: ["01 GL-ENTRY-RECORD.", "05 GL-POST-DATE PIC X(08).", "05 GL-AMOUNT PIC S9(11)V99."],
    paragraphs: ["GL-ENTRY-RECORD", "GL-POST-DATE", "GL-AMOUNT"],
    relationships: [
      { name: "INCLUDES_COPYBOOK", count: 3 },
      { name: "SHARES_DATA_WITH", count: 5 },
    ],
  },
  {
    id: "gl-entry",
    name: "GL_ENTRY",
    type: "FIELD",
    title: "General ledger entry table",
    description: "Ledger table receiving validated settlement entries.",
    business: "General",
    risk: "MEDIUM",
    source: "GLPOST01.cbl",
    sourceRange: "L238–248",
    file: "GLPOST01.cbl",
    code: ["EXEC SQL INSERT INTO GL_ENTRY", "(GL_POST_DATE, GL_AMOUNT)", "VALUES (:GL-POST-DATE, :GL-AMOUNT)"],
    paragraphs: ["GL-ENTRY", "GL-POST-DATE", "GL-AMOUNT"],
    relationships: [
      { name: "EXECUTES_SQL", count: 4 },
      { name: "REFERENCES_TABLE", count: 2 },
      { name: "WRITES_FILE", count: 1 },
    ],
  },
];

export function getSearchSummary(query: string) {
  const normalized = query.trim().toLowerCase();
  if (normalized.includes("tax") || normalized.includes("settle") || normalized.includes("ledger")) {
    return "Settlement is finalised in SETTLE01, which calls GLPOST01 to post ledger entries. Tax is calculated before posting, using the business date in WS-BUS-DATE.";
  }
  if (normalized.includes("recon")) {
    return "RECON02 compares settlement records with GL_ENTRY to identify ledger differences and report exceptions.";
  }
  return "GLPOST01 posts validated entries to the ledger, using the business processing date carried through settlement.";
}
