import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight,
  BookOpenText, Check, ChevronDown, ChevronRight, Command,
  Database, FileCode2, Filter, GitBranch, Landmark, Layers3, LockKeyhole,
  MoreHorizontal, Network, PanelRight, Search, ShieldCheck, Sparkles,
} from "lucide-react";

import meridianMark from "@/assets/meridian-mark.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  getSearchSummary, INITIAL_RESULT_COUNT, meridianResults, RESULTS_PER_PAGE,
  type MeridianResult,
} from "@/lib/meridian-data";

type Screen = "home" | "results" | "overview" | "graph";

function getInitialResult(): MeridianResult {
  const initialResult = meridianResults[0];
  if (!initialResult) throw new Error("Meridian evidence results are unavailable.");
  return initialResult;
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian Connected Intelligence | Banking Knowledge" },
      { name: "description", content: "Search Meridian trade and settlement banking evidence, inspect program overviews, and explore system relationships." },
      { property: "og:title", content: "Meridian Connected Intelligence" },
      { property: "og:description", content: "Search and explore Meridian banking system evidence and relationships." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MeridianApp,
});

function MeridianApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_RESULT_COUNT);
  const [selected, setSelected] = useState<MeridianResult>(getInitialResult);
  const [searchNotice, setSearchNotice] = useState("");
  const [persona, setPersona] = useState("Business Analyst");

  useEffect(() => {
    const handleBack = () => {
      if (screen === "overview" || screen === "graph") setScreen("results");
      else if (screen === "results") setScreen("home");
    };
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [screen]);

  const doSearch = (event?: FormEvent) => {
    event?.preventDefault();
    if (!query.trim()) {
      setSearchNotice("Enter a program, field, or question to search.");
      return;
    }
    window.history.pushState({ screen: "results" }, "", "#search");
    setSubmittedQuery(query.trim());
    setVisibleCount(INITIAL_RESULT_COUNT);
    setSelected(getInitialResult());
    setSearchNotice("");
    setScreen("results");
  };

  const goBack = () => {
    if (window.location.hash) window.history.back();
    setScreen("results");
  };

  const openOverview = (result: MeridianResult) => {
    setSelected(result);
    window.history.pushState({ screen: "overview", id: result.id }, "", `#overview-${result.id}`);
    setScreen("overview");
  };

  const openGraph = () => {
    window.history.pushState({ screen: "graph" }, "", "#graph");
    setScreen("graph");
  };

  return (
    <div className="app-shell min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-6 px-5 lg:px-9">
          <button aria-label="Meridian home" onClick={() => setScreen("home")} className="flex min-w-[210px] items-center gap-3 text-left">
            <img src={meridianMark} alt="" className="size-11 shrink-0 object-contain" />
            <span className="leading-tight"><span className="block text-[15px] font-bold tracking-[0.02em]">MERIDIAN</span><span className="block text-[10px] font-semibold tracking-[0.2em] text-muted-foreground">CONNECTED INTELLIGENCE</span></span>
          </button>
          <form onSubmit={doSearch} className="mx-auto hidden w-full max-w-[620px] items-center gap-2 rounded-lg border border-border bg-card px-3 shadow-sm md:flex">
            <Search size={17} className="shrink-0 text-muted-foreground" />
            <Input aria-label="Search the knowledge graph" className="h-10 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0" placeholder="Search programs, fields, or ask a question..." value={query} onChange={(event) => setQuery(event.target.value)} />
            <span className="flex shrink-0 items-center gap-1 rounded border border-border bg-muted px-1.5 py-1 text-[10px] font-medium text-muted-foreground"><Command size={11} /> K</span>
          </form>
          <div className="ml-auto flex items-center gap-3">
            <Select value={persona} onValueChange={setPersona}>
              <SelectTrigger aria-label="Select persona" className="h-9 w-[170px] border-border bg-card text-xs font-medium sm:w-[190px]">
                <SelectValue placeholder="Select persona" />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                <SelectItem value="Application Owner">Application Owner</SelectItem>
                <SelectItem value="Risk & Compliance">Risk &amp; Compliance</SelectItem>
                <SelectItem value="Engineer">Engineer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[1600px]">
        <aside className="hidden w-[232px] shrink-0 border-r border-border bg-background/75 px-4 py-6 lg:block">
          <div className="mb-8 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Workspace</div>
          <nav className="space-y-1" aria-label="Main navigation">
            <NavItem icon={<Search size={17} />} label="Search" active />
            <NavItem icon={<Activity size={17} />} label="Risk summary" />
            <NavItem icon={<GitBranch size={17} />} label="Dependencies" />
            <NavItem icon={<ShieldCheck size={17} />} label="Integrity" />
            <NavItem icon={<Layers3 size={17} />} label="Curation" />
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-7 lg:px-10 lg:py-9">
          <div className="mb-7 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><span>Portfolio</span><ChevronRight size={13} /><span>Trade & Settlement</span>{screen !== "home" && <><ChevronRight size={13} /><span className="font-semibold text-foreground">{screen === "results" ? "Search results" : screen === "overview" ? selected.name : "System graph"}</span></>}</div>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><LockKeyhole size={14} /> Internal · Read only <ChevronDown size={13} /></div>
          </div>

          {screen === "home" && <HomeScreen query={query} setQuery={setQuery} onSearch={doSearch} notice={searchNotice} />}
          {screen === "results" && <ResultsScreen query={query} setQuery={setQuery} onSearch={doSearch} submittedQuery={submittedQuery} visibleCount={visibleCount} setVisibleCount={setVisibleCount} selected={selected} setSelected={setSelected} onOverview={openOverview} onGraph={openGraph} />}
          {screen === "overview" && <OverviewScreen result={selected} onBack={goBack} onGraph={openGraph} />}
          {screen === "graph" && <GraphScreen onBack={goBack} />}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return <button className={`flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm transition-colors ${active ? "bg-secondary font-semibold text-secondary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>{icon}{label}</button>;
}

function HomeScreen({ query, setQuery, onSearch, notice }: { query: string; setQuery: (value: string) => void; onSearch: (event?: FormEvent) => void; notice: string }) {
  const suggestions = ["Which programs post settlement entries?", "Where is business date used?", "Show ledger dependencies"];
  return <div className="mx-auto max-w-[1240px]">
    <div className="mb-7 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><span className="size-2 rounded-full bg-primary" /> Meridian · Banking knowledge</div>
    <div className="grid items-end gap-8 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="max-w-[690px]">
        <p className="mb-3 text-sm font-medium text-muted-foreground">TRADE AND SETTLEMENT BANKING SYSTEM</p>
        <h1 className="serif-display max-w-[660px] text-4xl leading-[1.1] md:text-[52px]">Clarity across every <span className="text-primary">connection.</span></h1>
        <p className="mt-5 max-w-[560px] text-base leading-7 text-muted-foreground">Explore the systems, rules, and evidence behind Meridian’s trade and settlement operations.</p>
        <form onSubmit={onSearch} className="mt-8 rounded-xl border border-border bg-card p-2 shadow-sm">
          <div className="flex items-center gap-2 px-2"><Search className="shrink-0 text-primary" size={19} /><Input aria-label="Ask anything about the Meridian banking system" className="h-12 border-0 px-1 text-base shadow-none focus-visible:ring-0" placeholder="Ask anything about the Meridian banking system..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-2 pt-3">
            <div className="flex flex-wrap items-center gap-2"><span className="mr-1 text-xs text-muted-foreground">Try</span>{["GLPOST01", "tax settlement", "WS-BUS-DATE"].map((item) => <button type="button" key={item} onClick={() => setQuery(item)} className="rounded-md bg-secondary px-2.5 py-1.5 font-mono text-[11px] text-secondary-foreground transition-colors hover:bg-accent">{item}</button>)}</div>
            <Button type="submit" className="h-10 px-5"><Search size={15} /> Search</Button>
          </div>
          {notice && <p className="px-2 pt-2 text-xs text-destructive" role="alert">{notice}</p>}
        </form>
        <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck size={15} className="text-primary" /> Answers grounded in indexed evidence</div>
      </div>
      <div className="hidden items-center justify-end xl:flex"><div className="relative w-full max-w-[510px] overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-6 flex items-center justify-between"><div><p className="text-xs font-semibold">Portfolio overview</p><p className="mt-1 text-[11px] text-muted-foreground">System activity · 30 days</p></div><button className="rounded-md border border-border p-2 text-muted-foreground" aria-label="More portfolio options"><MoreHorizontal size={16} /></button></div>
        <div className="grid grid-cols-[1.3fr_0.7fr] gap-4">
          <div className="rounded-lg border border-border bg-background p-3"><div className="mb-3 flex items-center justify-between text-[10px] text-muted-foreground"><span>Daily transactions</span><span>+8.4%</span></div><MiniBarChart /></div>
          <div className="rounded-lg border border-border bg-background p-3"><div className="text-[10px] text-muted-foreground">By risk tier</div><div className="mt-4 flex items-center gap-3"><div className="risk-donut" /><div className="space-y-2 text-[9px] text-muted-foreground"><span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-primary" />Low 62%</span><span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-chart-2" />Med 26%</span><span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-chart-3" />High 12%</span></div></div></div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3"><Metric label="Indexed programs" value="142" trend="+6 this month" /><Metric label="Critical risk" value="08" trend="2 under review" /><Metric label="Source coverage" value="94%" trend="Validated" /></div>
        <div className="absolute -right-2 top-[108px] h-10 w-1 rounded-full bg-primary" />
      </div></div>
    </div>
    <div className="mt-9 grid gap-6 border-t border-border pt-7 md:grid-cols-[1fr_auto] md:items-center"><div><h2 className="text-sm font-semibold">Start with a question</h2><p className="mt-1 text-xs text-muted-foreground">Find programs, business rules, fields, and source evidence.</p></div><div className="flex flex-wrap gap-2">{suggestions.map((item) => <button key={item} onClick={() => setQuery(item)} className="rounded-full border border-border bg-card px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary">{item}<ArrowUpRight size={12} className="ml-2 inline" /></button>)}</div></div>
  </div>;
}

function MiniBarChart() {
  const heights = [38, 54, 44, 68, 52, 76, 63, 82, 62, 92, 70, 84, 58, 96];
  return <div className="flex h-[84px] items-end gap-1 border-b border-border px-1">{heights.map((height, index) => <div key={index} className={`flex-1 rounded-t-[2px] ${index > 9 ? "bg-primary" : "bg-primary/35"}`} style={{ height: `${height}%` }} />)}</div>;
}

function Metric({ label, value, trend }: { label: string; value: string; trend: string }) {
  return <div className="rounded-lg border border-border bg-background p-3"><div className="text-[9px] text-muted-foreground">{label}</div><div className="mt-1 font-mono text-lg font-semibold">{value}</div><div className="mt-1 text-[9px] text-primary">{trend}</div></div>;
}

function ResultsScreen({ query, setQuery, onSearch, submittedQuery, visibleCount, setVisibleCount, selected, setSelected, onOverview, onGraph }: {
  query: string; setQuery: (value: string) => void; onSearch: (event?: FormEvent) => void; submittedQuery: string;
  visibleCount: number; setVisibleCount: (value: number) => void; selected: MeridianResult; setSelected: (value: MeridianResult) => void;
  onOverview: (value: MeridianResult) => void; onGraph: () => void;
}) {
  const visibleResults = meridianResults.slice(0, visibleCount);
  return <div className="mx-auto max-w-[1320px]">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-primary"><Sparkles size={14} /> Evidence-first results</div><h1 className="serif-display mt-2 text-3xl">Search the knowledge graph</h1></div><div className="text-xs text-muted-foreground">6 supporting sources <span className="mx-2">·</span> Updated 06:10</div></div>
    <form onSubmit={onSearch} className="mb-6 flex gap-2 rounded-lg border border-border bg-card p-2 shadow-sm"><div className="flex min-w-0 flex-1 items-center gap-2 px-2"><Search size={17} className="shrink-0 text-muted-foreground" /><Input aria-label="Search the knowledge graph" className="h-10 border-0 px-1 shadow-none focus-visible:ring-0" value={query || submittedQuery} onChange={(event) => setQuery(event.target.value)} /></div><Button type="submit" className="h-10 px-5"><Search size={15} /> Search</Button></form>
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0">
        <div className="mb-4 rounded-lg border border-primary/35 bg-secondary/70 p-5"><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-accent-foreground"><Sparkles size={12} /> AI synthesis · inferred</div><p className="text-[15px] leading-7">{getSearchSummary(submittedQuery)}</p><div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground"><span>Confidence <strong className="text-foreground">92%</strong></span><span>6 supporting sources</span><span>Generated from retrieved evidence only</span></div></div>
        <div className="mb-3 flex items-center justify-between"><h2 className="text-xs font-bold uppercase tracking-[0.13em] text-muted-foreground">Matching evidence <span className="ml-1 font-normal">({visibleResults.length} shown)</span></h2><button className="flex items-center gap-1 text-xs text-muted-foreground"><Filter size={13} /> Filters <ChevronDown size={12} /></button></div>
        <div className="space-y-3">{visibleResults.map((result) => <ResultCard key={result.id} result={result} selected={selected.id === result.id} onSelect={() => setSelected(result)} onOverview={() => onOverview(result)} />)}</div>
        {visibleCount < meridianResults.length && <Button variant="outline" onClick={() => setVisibleCount(Math.min(visibleCount + RESULTS_PER_PAGE, meridianResults.length))} className="mt-4 h-10">Show {Math.min(RESULTS_PER_PAGE, meridianResults.length - visibleCount)} more results <ArrowRight size={14} /></Button>}
      </div>
      <aside className="min-w-0 xl:sticky xl:top-[96px]">
        <EvidenceDrawer result={selected} onOverview={() => onOverview(selected)} onGraph={onGraph} />
      </aside>
    </div>
  </div>;
}

function ResultCard({ result, selected, onSelect, onOverview }: { result: MeridianResult; selected: boolean; onSelect: () => void; onOverview: () => void }) {
  return <article className={`rounded-lg border bg-card p-4 transition-colors ${selected ? "border-primary/60 shadow-sm" : "border-border hover:border-primary/40"}`}>
    <div className="flex flex-wrap items-start justify-between gap-4"><button onClick={onSelect} className="min-w-0 flex-1 text-left"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-sm font-semibold">{result.name}</span><span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-bold tracking-[0.08em] text-muted-foreground">{result.type}</span><span className={`risk-pill risk-${result.risk.toLowerCase()}`}>{result.risk}</span></div><p className="mt-1.5 text-sm font-medium">{result.title}</p><p className="mt-1 text-xs text-muted-foreground">{result.description}</p><span className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] text-primary"><ArrowDownRight size={12} /> {result.source} · {result.sourceRange}</span></button><div className="flex items-center gap-2"><span className="hidden text-[10px] text-muted-foreground sm:inline">{result.business}</span><Button variant="outline" size="sm" onClick={onOverview}>Overview <ArrowUpRight size={13} /></Button></div></div>
  </article>;
}

function EvidenceDrawer({ result, onOverview, onGraph }: { result: MeridianResult; onOverview: () => void; onGraph: () => void }) {
  return <section className="mt-7 rounded-lg border border-border bg-card p-4 md:p-5" aria-label="Evidence drawer"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><PanelRight size={17} className="text-primary" /><h2 className="text-xs font-bold uppercase tracking-[0.14em]">Evidence drawer</h2></div><span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-secondary-foreground">Observed · validated</span></div>
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(200px,0.7fr)]"><div className="min-w-0"><div className="overflow-x-auto rounded-md bg-foreground p-4"><pre className="min-w-[390px] font-mono text-[11px] leading-6 text-secondary md:text-xs">{result.code.join("\n")}</pre></div><div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground"><span>Source file <strong className="ml-1 text-foreground">{result.file}</strong></span><span>Pipeline run <strong className="ml-1 text-foreground">Run 142 · today 06:10</strong></span><span>Version <strong className="ml-1 text-foreground">v3.2 unchanged</strong></span></div></div>
    <div className="flex flex-col justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">Selected evidence</p><p className="mt-2 font-mono text-sm font-semibold">{result.name}</p><p className="mt-1 text-xs text-muted-foreground">{result.title}</p><p className="mt-3 text-[11px] italic text-muted-foreground">Facts, observations, and AI synthesis stay visibly distinct.</p></div><div className="grid grid-cols-2 gap-2"><Button onClick={onOverview} className="h-9 text-xs">Overview</Button><Button onClick={onGraph} variant="outline" className="h-9 text-xs">Open in graph <Network size={13} /></Button></div></div></div>
  </section>;
}

function OverviewScreen({ result, onBack, onGraph }: { result: MeridianResult; onBack: () => void; onGraph: () => void }) {
  return <div className="mx-auto max-w-[1320px]">
    <Button variant="ghost" onClick={onBack} className="mb-5 -ml-3 h-9 text-muted-foreground"><ArrowLeft size={15} /> Back to search results</Button>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2 text-xs text-muted-foreground"><span>Portfolio</span><ChevronRight size={13} /><span>Settlement</span><ChevronRight size={13} /><span className="font-mono text-foreground">{result.name}</span></div><div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2"><h1 className="font-mono text-3xl font-bold">{result.name}</h1><p className="text-sm text-muted-foreground">{result.title}</p><span className={`risk-pill risk-${result.risk.toLowerCase()}`}>{result.risk}</span><span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-secondary-foreground">Observed · validated</span></div></div><div className="flex items-center gap-2"><Button variant="outline" onClick={onBack}><ArrowLeft size={14} /> Back</Button><Button onClick={onGraph}>Open in graph <Network size={14} /></Button></div></div>
    <div className="mb-5 flex flex-wrap gap-1 border-b border-border">{["Overview", "Business rules", "Dependencies", "Data & SQL", "Source", "History"].map((tab, index) => <button key={tab} className={`border-b-2 px-4 py-3 text-xs ${index === 0 ? "border-primary font-semibold text-primary" : "border-transparent text-muted-foreground"}`}>{tab}</button>)}</div>
    <div className="grid items-start gap-4 xl:grid-cols-[1fr_1fr_1fr]">
      <section className="rounded-lg border border-border bg-card p-4"><SectionHeading title="Paragraphs" detail="Click to open source" icon={<BookOpenText size={15} />} /><div className="mt-4 space-y-2">{result.paragraphs.map((paragraph, index) => <button key={paragraph} className={`flex w-full items-center justify-between rounded-md border px-3 py-3 text-left ${index === 1 ? "border-primary/55 bg-secondary/40" : "border-border bg-background"}`}><span className="font-mono text-xs font-semibold">{paragraph}</span><span className="text-[9px] uppercase text-muted-foreground">{paragraph.includes("WRITE") ? "Executes SQL" : "Performs"}</span></button>)}</div></section>
      <section className="rounded-lg border border-border bg-card p-4"><SectionHeading title="Relationships" detail="Linked system objects" icon={<GitBranch size={15} />} /><div className="mt-5 space-y-4">{result.relationships.map((relationship) => <div key={relationship.name} className="flex items-center gap-3"><span className="w-[150px] truncate font-mono text-[10px] text-muted-foreground">{relationship.name}</span><div className="h-2 flex-1 rounded-sm bg-muted"><div className="h-full rounded-sm bg-primary" style={{ width: `${Math.max(18, relationship.count * 14)}%` }} /></div><span className="w-5 text-right font-mono text-xs font-medium text-primary">{relationship.count}</span></div>)}</div></section>
      <section className="rounded-lg border border-border bg-card p-4"><SectionHeading title="Evidence" detail="Source-backed record" icon={<FileCode2 size={15} />} /><div className="mt-4 rounded-md bg-foreground p-4"><pre className="overflow-x-auto font-mono text-[10px] leading-6 text-secondary">{result.code.join("\n")}</pre></div><div className="mt-3 font-mono text-[10px] text-muted-foreground">{result.file} · {result.sourceRange} · v3.2 · Run 142</div><div className="mt-4 grid grid-cols-2 gap-2"><Button onClick={onGraph} className="text-xs">Open in graph</Button><Button variant="outline" className="text-xs">Impact analysis</Button><Button variant="outline" className="text-xs">Add to wave</Button><Button variant="outline" className="text-xs">Flag for review</Button></div></section>
    </div>
  </div>;
}

function SectionHeading({ title, detail, icon }: { title: string; detail: string; icon: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2 text-primary">{icon}<h2 className="text-xs font-bold uppercase tracking-[0.1em]">{title}</h2></div><span className="text-[9px] text-muted-foreground">{detail}</span></div>;
}

const graphNodes = [
  { id: "SETTLE01", x: 50, y: 15, color: "fill-chart-2" },
  { id: "RECON02", x: 83, y: 15, color: "fill-chart-2" },
  { id: "GLPOST01", x: 66, y: 48, color: "fill-chart-3" },
  { id: "CPYGL", x: 30, y: 52, color: "fill-chart-4" },
  { id: "GL_ENTRY", x: 101, y: 52, color: "fill-chart-4" },
  { id: "TRADEFL", x: 66, y: 81, color: "fill-chart-4" },
];

function GraphScreen({ onBack }: { onBack: () => void }) {
  const [activeFilters, setActiveFilters] = useState(["CALLS_PROGRAM", "COUPLED_VIA_COPYBOOK", "EXECUTES_SQL", "READS_FILE", "WRITES_FILE"]);
  const filters = ["ACCESSES", "CALLS_PROGRAM", "CONTAINS_PARAGRAPH", "COUPLED_VIA_COPYBOOK", "COUPLED_VIA_SQL", "EXECUTES_SQL", "HAS_CONDITION", "HAS_DATA_SECTION", "HAS_EVALUATE", "INCLUDES_COPYBOOK", "MOVED_TO", "PERFORMS_PARAGRAPH", "READS_FILE", "REFERENCES_TABLE", "SHARES_DATA_WITH", "WRITES_FILE"];
  const toggleFilter = (filter: string) => setActiveFilters((current) => current.includes(filter) ? current.filter((item) => item !== filter) : [...current, filter]);
  return <div className="mx-auto max-w-[1320px]">
    <Button variant="ghost" onClick={onBack} className="mb-5 -ml-3 h-9 text-muted-foreground"><ArrowLeft size={15} /> Back to previous page</Button>
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-primary"><Network size={15} /> System graph</div><h1 className="serif-display mt-2 text-3xl">GLPOST01 · relationship map</h1><p className="mt-1 text-sm text-muted-foreground">Connected programs, copybooks, data, and files</p></div><div className="flex gap-2"><Button variant="outline" onClick={onBack}><ArrowLeft size={14} /> Back</Button><Button variant="outline"><MoreHorizontal size={15} /></Button></div></div>
    <div className="grid items-stretch gap-4 xl:grid-cols-[285px_minmax(0,1fr)]">
      <aside className="rounded-lg border border-border bg-card p-4"><SectionHeading title="Relationship filters" detail={`${activeFilters.length} active`} icon={<Filter size={15} />} /><div className="mt-4 space-y-1">{filters.map((filter) => { const active = activeFilters.includes(filter); return <button key={filter} onClick={() => toggleFilter(filter)} className="flex w-full items-center gap-2.5 rounded px-1 py-1.5 text-left font-mono text-[10px] text-muted-foreground transition-colors hover:bg-muted"><span className={`flex size-4 items-center justify-center rounded-[3px] border ${active ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background"}`}>{active && <Check size={11} />}</span><span className={active ? "text-foreground" : ""}>{filter}</span></button>; })}</div></aside>
      <section className="min-w-0 rounded-lg border border-border bg-card p-4 md:p-6">
        <div className="relative min-h-[480px] overflow-hidden rounded-md bg-background">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-label="Relationship connections between banking system assets">
            <defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" className="fill-muted-foreground" /></marker></defs>
            <line x1="50%" y1="17%" x2="66%" y2="48%" className="stroke-border" strokeWidth="2" markerEnd="url(#arrow)" />
            <line x1="83%" y1="17%" x2="66%" y2="48%" className="stroke-border" strokeWidth="2" markerEnd="url(#arrow)" />
            <line x1="30%" y1="52%" x2="66%" y2="48%" className="stroke-border" strokeWidth="2" markerEnd="url(#arrow)" />
            <line x1="66%" y1="48%" x2="101%" y2="52%" className="stroke-border" strokeWidth="2" markerEnd="url(#arrow)" />
            <line x1="66%" y1="48%" x2="66%" y2="81%" className="stroke-border" strokeWidth="2" markerEnd="url(#arrow)" />
            <text x="51%" y="31%" className="fill-muted-foreground" fontSize="12">CALLS_PROGRAM</text><text x="70%" y="31%" className="fill-muted-foreground" fontSize="12">COUPLED_VIA_SQL</text><text x="35%" y="47%" className="fill-muted-foreground" fontSize="12">INCLUDES_COPYBOOK</text><text x="76%" y="47%" className="fill-muted-foreground" fontSize="12">REFERENCES_TABLE</text><text x="67%" y="70%" className="fill-muted-foreground" fontSize="12">READS_FILE</text>
          </svg>
          {graphNodes.map((node) => <div key={node.id} className="absolute z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2" style={{ left: `${node.x}%`, top: `${node.y}%` }}><span className="font-mono text-[10px] font-bold">{node.id}</span><button aria-label={`Select ${node.id}`} className={`flex size-[68px] items-center justify-center rounded-full text-[10px] font-bold text-primary-foreground shadow-sm ${node.color} ${node.id === "GLPOST01" ? "size-[92px]" : ""}`}>{node.id === "GLPOST01" ? "GLPOST01" : <span className="sr-only">{node.id}</span>}</button></div>)}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-md border border-border bg-card/90 px-2.5 py-2 text-[10px] text-muted-foreground"><span className="size-2 rounded-full bg-chart-3" /> Program <span className="ml-2 size-2 rounded-full bg-chart-4" /> Data object <span className="ml-2 size-2 rounded-full bg-chart-2" /> Related program</div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3"><GraphMetric value="14" label="programs impacted" icon={<Activity size={15} />} /><GraphMetric value="3" label="copybooks" icon={<Layers3 size={15} />} /><GraphMetric value="2" label="tables" icon={<Database size={15} />} /></div>
      </section>
    </div>
  </div>;
}

function GraphMetric({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return <div className="flex items-center gap-3 rounded-md bg-secondary/80 px-4 py-3"><span className="text-primary">{icon}</span><span className="font-mono text-2xl font-semibold text-primary">{value}</span><span className="text-xs text-secondary-foreground">{label}</span></div>;
}