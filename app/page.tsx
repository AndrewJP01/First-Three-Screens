"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, ExternalLink, MapPin, Search, ShieldCheck, Sparkles, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Screen = "home" | "results" | "details";
type WebMcpContext = { registerTool: (tool: { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => object }, options: { signal: AbortSignal }) => void | Promise<void> };
const categories = ["Burgers", "Pizza", "Tacos", "Chicken", "Sandwiches"];
const deals = [
  { id:"whopper", restaurant:"Burger King", monogram:"BK", color:"bg-[#e5482d]", title:"$5 Whopper Meal", summary:"Whopper, small fries, and a small drink", type:"Digital offer", price:"$5", note:"App required", distance:"0.8 mi", badge:"Best value" },
  { id:"mcdonalds", restaurant:"McDonald’s", monogram:"M", color:"bg-[#ffbc0d] text-[#5b3713]", title:"20% off $12+", summary:"Save on any qualifying mobile order", type:"App coupon", price:"20% off", note:"$12 minimum", distance:"1.2 mi" },
  { id:"wendys", restaurant:"Wendy’s", monogram:"W", color:"bg-[#1673b8]", title:"Free fries with purchase", summary:"Any size fries with a qualifying mobile order", type:"Digital offer", price:"Free", note:"Mobile order", distance:"1.5 mi" },
  { id:"sonic", restaurant:"Sonic", monogram:"S", color:"bg-[#e8292f]", title:"Half-price cheeseburger", summary:"A classic cheeseburger for 50% less", type:"Limited-time offer", price:"½ price", note:"After 5 p.m.", distance:"2.1 mi" },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All deals");
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => { headingRef.current?.focus(); window.scrollTo({ top: 0, behavior: "smooth" }); }, [screen]);
  useEffect(() => {
    const context = (document as Document & { modelContext?: WebMcpContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const register = async () => {
      await context.registerTool({
        name: "search_food_deals", title: "Search food deals",
        description: "Show comparison results for a requested food craving in the prototype.",
        inputSchema: { type: "object", properties: { food: { type: "string", description: "Food category to search for; the prototype supports burgers." } }, required: ["food"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input) => {
          const food = typeof input === "object" && input !== null && "food" in input ? String((input as { food: unknown }).food) : "";
          if (!food.trim()) throw new Error("A food category is required.");
          setQuery(food); setScreen("results");
          return { food, resultCount: deals.length, screen: "results" };
        },
      }, { signal: lifecycle.signal });
      await context.registerTool({
        name: "view_burger_deal", title: "View burger deal",
        description: "Open the prototype detail view for the selected burger deal.",
        inputSchema: { type: "object", properties: { dealId: { type: "string", enum: deals.map((deal) => deal.id) } }, required: ["dealId"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input) => {
          const dealId = typeof input === "object" && input !== null && "dealId" in input ? String((input as { dealId: unknown }).dealId) : "";
          if (!deals.some((deal) => deal.id === dealId)) throw new Error("Unknown deal ID.");
          setScreen("details");
          return { dealId, screen: "details" };
        },
      }, { signal: lifecycle.signal });
    };
    void register().catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
  const goHome = () => { setQuery(""); setScreen("home"); };
  const searchBurgers = (event?: FormEvent) => { event?.preventDefault(); if (query.trim() || !event) setScreen("results"); };
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header onHome={goHome} screen={screen} />
      {screen === "home" && <Landing headingRef={headingRef} query={query} setQuery={setQuery} onSearch={searchBurgers} />}
      {screen === "results" && <Results headingRef={headingRef} filter={activeFilter} setFilter={setActiveFilter} onBack={goHome} onDeal={() => setScreen("details")} />}
      {screen === "details" && <Details headingRef={headingRef} onBack={() => setScreen("results")} />}
    </main>
  );
}

function Header({ onHome, screen }: { onHome: () => void; screen: Screen }) {
  return <header className="sticky top-0 z-30 border-b border-[#dce3ea] bg-white/95 backdrop-blur-md">
    <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-5 sm:px-8">
      <button onClick={onHome} className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#92b6ff]" aria-label="CraveSave home">
        <span className="grid size-9 place-items-center rounded-[11px] bg-[#0d2e62] text-[#ffd84d] shadow-sm transition-transform group-hover:-rotate-3"><Utensils className="size-[19px]" strokeWidth={2.5} /></span>
        <span className="text-[1.12rem] font-black tracking-[-0.035em] text-[#10243f]">Crave<span className="text-[#1761d1]">Save</span></span>
      </button>
      <div className="flex items-center gap-2 text-sm font-semibold text-[#607087]"><ShieldCheck className="size-[18px] text-[#1761d1]" /><span className="hidden sm:inline">Compare first. Choose confidently.</span><span className="sm:hidden">Compare & save</span></div>
    </div>
    {screen !== "home" && <div className="h-1 bg-gradient-to-r from-[#1761d1] via-[#4d8df3] to-[#ffd84d]" />}
  </header>;
}

function Landing({ headingRef, query, setQuery, onSearch }: { headingRef: React.RefObject<HTMLHeadingElement | null>; query: string; setQuery: (value: string) => void; onSearch: (event?: FormEvent) => void; }) {
  return <section className="relative overflow-hidden">
    <div className="absolute inset-x-0 top-0 h-[580px] bg-[#f3f7fd]" />
    <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-6xl items-center gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:py-16">
      <div className="z-10 max-w-2xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cbdcf8] bg-white px-3.5 py-2 text-sm font-bold text-[#1853a6] shadow-sm"><Sparkles className="size-4 fill-[#ffd84d] text-[#d09d00]" />Today’s options, compared in one place</div>
        <h1 ref={headingRef} tabIndex={-1} className="max-w-xl text-[clamp(3rem,7vw,5.6rem)] font-black leading-[.91] tracking-[-0.065em] text-[#10243f] outline-none">What are you <span className="text-[#1761d1]">craving?</span></h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-[#55657b]">Tell us the food. We’ll line up the deals—so you can spend less and choose without second-guessing.</p>
        <form onSubmit={onSearch} className="mt-8 max-w-xl">
          <label htmlFor="food-search" className="mb-2 block text-sm font-bold text-[#263d5b]">Search by food</label>
          <div className="flex rounded-2xl border-2 border-[#aec7ea] bg-white p-1.5 shadow-[0_18px_48px_rgba(20,63,125,.14)] focus-within:border-[#1761d1] focus-within:ring-4 focus-within:ring-[#1761d1]/10">
            <Search className="ml-3 mt-3 size-5 shrink-0 text-[#64758c]" />
            <Input id="food-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try “burgers”" className="h-11 border-0 bg-transparent text-base shadow-none focus-visible:ring-0 md:text-base" autoComplete="off" />
            <Button type="submit" size="lg" className="h-11 rounded-xl bg-[#1761d1] px-5 font-bold hover:bg-[#0f50b4]">Find deals <ArrowRight className="size-4" /></Button>
          </div>
        </form>
        <div className="mt-5 flex flex-wrap items-center gap-2"><span className="mr-1 text-sm font-semibold text-[#607087]">Popular:</span>{categories.map((category) => <Button key={category} variant="outline" size="sm" onClick={() => { setQuery(category); if (category === "Burgers") onSearch(); }} className={`rounded-full border-[#cbd7e5] bg-white px-4 hover:border-[#1761d1] hover:bg-[#eaf2ff] hover:text-[#174f9d] ${category === "Burgers" ? "border-[#1761d1] text-[#174f9d]" : "text-[#4f6075]"}`}>{category}</Button>)}</div>
      </div>
      <div className="relative min-h-[380px] overflow-hidden rounded-[2.1rem] bg-[#0d2e62] shadow-[0_28px_70px_rgba(11,38,78,.22)] lg:min-h-[590px]">
        <img src="/burger-hero.png" alt="Cheeseburger and fries" className="absolute inset-0 h-full w-full object-cover object-center lg:object-[59%_center]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071d3f]/80 via-transparent to-transparent" />
        <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/20 bg-[#071a38]/82 p-5 text-white shadow-xl backdrop-blur-md sm:inset-x-7 sm:bottom-7"><div className="flex items-end justify-between gap-5"><div><p className="text-sm font-semibold text-[#c8daf8]">Burger deals near you</p><p className="mt-1 text-2xl font-black tracking-tight">4 offers to compare</p></div><span className="rounded-full bg-[#ffd84d] px-3 py-1.5 text-sm font-black text-[#10243f]">From $5</span></div></div>
      </div>
    </div>
  </section>;
}

function Results({ headingRef, filter, setFilter, onBack, onDeal }: { headingRef: React.RefObject<HTMLHeadingElement | null>; filter: string; setFilter: (value: string) => void; onBack: () => void; onDeal: () => void; }) {
  return <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
    <Button variant="ghost" onClick={onBack} className="-ml-3 mb-5 text-[#53657b] hover:bg-[#edf3fb]"><ArrowLeft /> New search</Button>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-extrabold uppercase tracking-[.13em] text-[#1761d1]">4 nearby offers</p><h1 ref={headingRef} tabIndex={-1} className="mt-1 text-4xl font-black tracking-[-0.045em] text-[#10243f] outline-none sm:text-5xl">Burger deals</h1><p className="mt-3 text-base text-[#5d6e84]">Compare the full cost and fine print before you choose.</p></div>
      <div className="flex items-center gap-2" aria-label="Sort deals">{["All deals", "Best deal", "Closest"].map((item) => <Button key={item} size="sm" variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)} className={filter === item ? "rounded-full bg-[#102f60] px-4 hover:bg-[#102f60]" : "rounded-full border-[#cad6e5] bg-white px-4 text-[#52657b]"}>{item}</Button>)}</div>
    </div>
    <div className="mt-8 grid gap-4">{deals.map((deal) => <article key={deal.id} className="group relative grid gap-5 rounded-2xl border border-[#d9e2ec] bg-white p-5 shadow-[0_8px_28px_rgba(16,47,96,.06)] transition-all hover:-translate-y-0.5 hover:border-[#9dbce8] hover:shadow-[0_16px_38px_rgba(16,47,96,.11)] sm:grid-cols-[minmax(190px,.8fr)_minmax(260px,1.45fr)_150px_126px] sm:items-center sm:p-6">
      {deal.badge && <span className="absolute -top-3 right-5 rounded-full bg-[#ffd84d] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#10243f] shadow-sm">{deal.badge}</span>}
      <div className="flex items-center gap-3.5"><span className={`grid size-12 shrink-0 place-items-center rounded-xl text-base font-black text-white shadow-sm ${deal.color}`}>{deal.monogram}</span><div><p className="font-extrabold text-[#172b47]">{deal.restaurant}</p><p className="mt-1 flex items-center gap-1.5 text-sm text-[#66778c]"><MapPin className="size-3.5" /> {deal.distance}</p></div></div>
      <div className="border-y border-[#e5ebf2] py-4 sm:border-x sm:border-y-0 sm:px-6 sm:py-1"><p className="text-lg font-black tracking-[-.015em] text-[#10243f]">{deal.title}</p><p className="mt-1 text-sm leading-6 text-[#64758a]">{deal.summary}</p><div className="mt-2 flex flex-wrap gap-2 text-xs font-bold"><span className="rounded-md bg-[#eaf2ff] px-2 py-1 text-[#1853a6]">{deal.type}</span><span className="rounded-md bg-[#f1f3f6] px-2 py-1 text-[#5c6a7c]">{deal.note}</span></div></div>
      <div><p className="text-xs font-bold uppercase tracking-wide text-[#748399]">Deal value</p><p className="mt-1 text-2xl font-black tracking-tight text-[#1761d1]">{deal.price}</p></div>
      <Button onClick={onDeal} variant="outline" className="h-11 rounded-xl border-[#1761d1] font-bold text-[#1755aa] hover:bg-[#1761d1] hover:text-white" aria-label={`View ${deal.title} from ${deal.restaurant}`}>View deal <ChevronRight /></Button>
    </article>)}</div>
    <p className="mt-6 text-center text-sm text-[#718095]">Prototype offers for demonstration only. Confirm terms in the restaurant app.</p>
  </section>;
}

function Details({ headingRef, onBack }: { headingRef: React.RefObject<HTMLHeadingElement | null>; onBack: () => void; }) {
  return <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
    <Button variant="ghost" onClick={onBack} className="-ml-3 mb-5 text-[#53657b] hover:bg-[#edf3fb]"><ArrowLeft /> Back to burger deals</Button>
    <div className="overflow-hidden rounded-[1.75rem] border border-[#d7e1ed] bg-white shadow-[0_22px_60px_rgba(14,47,97,.11)]"><div className="grid lg:grid-cols-[1.05fr_.95fr]">
      <div className="bg-[#0d2e62] p-7 text-white sm:p-11"><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-[#e5482d] font-black shadow-lg">BK</span><div><p className="font-bold">Burger King</p><p className="mt-0.5 text-sm text-[#c7d7ef]">0.8 mi away</p></div></div>
        <div className="mt-12"><span className="inline-flex rounded-full bg-[#ffd84d] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#10243f]">Best value</span><h1 ref={headingRef} tabIndex={-1} className="mt-5 text-5xl font-black leading-[.98] tracking-[-0.055em] outline-none sm:text-6xl">$5 Whopper Meal</h1><p className="mt-5 max-w-md text-lg leading-8 text-[#dce7f7]">A complete burger meal at one clear price—no mental math needed.</p></div>
        <div className="mt-12 flex items-end justify-between border-t border-white/20 pt-6"><div><p className="text-sm font-semibold text-[#aebfda]">You pay</p><p className="mt-1 text-4xl font-black">$5.00</p></div><div className="rounded-xl bg-white/10 px-4 py-3 text-right"><p className="text-xs font-semibold text-[#bfcde2]">Offer type</p><p className="mt-1 font-bold">Digital only</p></div></div>
      </div>
      <div className="p-7 sm:p-11"><h2 className="text-xl font-black tracking-tight text-[#10243f]">What’s included</h2><ul className="mt-4 grid gap-3 text-[#4e6076]">{["One Whopper sandwich", "Small fries", "Small fountain drink"].map((item) => <li key={item} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-[#e5f0ff] text-[#1761d1]"><Check className="size-4" strokeWidth={3} /></span>{item}</li>)}</ul>
        <div className="mt-8 rounded-2xl border border-[#dce5ef] bg-[#f6f9fd] p-5"><h2 className="font-black text-[#10243f]">How to get it</h2><ol className="mt-4 grid gap-4 text-sm text-[#53657b]">{["Open the Burger King app and sign in.", "Find the offer under ‘Royal Perks’ and add it to your order.", "Choose pickup or dine-in and complete your order."].map((item, i) => <li key={item} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#1761d1] font-black text-white">{i + 1}</span><span>{item}</span></li>)}</ol></div>
        <div className="mt-7"><h2 className="font-black text-[#10243f]">Offer details</h2><div className="mt-3 grid gap-3 text-sm text-[#5f7085]"><p className="flex gap-2"><Clock3 className="mt-0.5 size-4 shrink-0 text-[#1761d1]" />Available through September 30, 2026</p><p className="flex gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#1761d1]" />One offer per account. Participating locations only. Taxes may apply.</p></div></div>
        <Button className="mt-8 h-13 w-full rounded-xl bg-[#1761d1] text-base font-black hover:bg-[#0f50b4]" onClick={() => alert("Prototype complete — this would open the Burger King app.")}>Get deal <ExternalLink className="size-4" /></Button><p className="mt-3 text-center text-xs leading-5 text-[#7a8798]">Prototype offer—not a verified live promotion.</p>
      </div>
    </div></div>
  </section>;
}
