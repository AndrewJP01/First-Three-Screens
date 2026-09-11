"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, ExternalLink, MapPin, Search, ShieldCheck, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Screen = "home" | "results" | "details";
type WebMcpContext = { registerTool: (tool: { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean; untrustedContentHint: boolean }; execute: (input: unknown) => object }, options: { signal: AbortSignal }) => void | Promise<void> };
const deals = [
  { id: "whopper", restaurant: "Burger King", monogram: "BK", color: "bg-[#e5482d]", title: "$5 Whopper Meal", summary: "Whopper, small fries, and a small drink", valueLabel: "Meal price", value: "$5 before tax", requirements: "App and account required. One offer per account at participating locations.", distance: "0.8 mi", badge: "Complete meal" },
  { id: "mcdonalds", restaurant: "McDonald’s", monogram: "M", color: "bg-[#ffbc0d] text-[#5b3713]", title: "20% off $12+", summary: "A discount on a qualifying mobile order", valueLabel: "Order discount", value: "20% off your order", requirements: "Requires a $12 minimum mobile order. Final price depends on your order.", distance: "1.2 mi" },
  { id: "wendys", restaurant: "Wendy’s", monogram: "W", color: "bg-[#1673b8]", title: "Free fries with purchase", summary: "Any size fries with a qualifying mobile order", valueLabel: "Item savings", value: "Free fries with purchase", requirements: "Qualifying mobile purchase required. Minimum spend is not specified in this example.", distance: "1.5 mi" },
  { id: "sonic", restaurant: "Sonic", monogram: "S", color: "bg-[#e8292f]", title: "Half-price cheeseburger", summary: "One classic cheeseburger at a discounted price", valueLabel: "Item discount", value: "50% off a cheeseburger", requirements: "Available after 5 p.m. Regular price is not specified in this example.", distance: "2.1 mi" },
];

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [query, setQuery] = useState("");
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
        inputSchema: { type: "object", properties: { dealId: { type: "string", enum: ["whopper"] } }, required: ["dealId"], additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute: (input) => {
          const dealId = typeof input === "object" && input !== null && "dealId" in input ? String((input as { dealId: unknown }).dealId) : "";
          if (dealId !== "whopper") throw new Error("Only the Burger King detail example is included in this prototype.");
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
      {screen === "results" && <Results headingRef={headingRef} onBack={goHome} onDeal={() => setScreen("details")} />}
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
      <div className="flex items-center gap-4"><p className="hidden items-center gap-2 text-sm font-semibold text-[#607087] sm:flex"><ShieldCheck className="size-[18px] text-[#1761d1]" />Compare first. Choose confidently.</p><nav aria-label="Main navigation"><Button variant="ghost" onClick={onHome} aria-current={screen === "home" ? "page" : undefined} className="h-11 text-[#1755aa]">Home</Button></nav></div>
    </div>
    {screen !== "home" && <div className="h-1 bg-gradient-to-r from-[#1761d1] via-[#4d8df3] to-[#ffd84d]" />}
  </header>;
}

function Landing({ headingRef, query, setQuery, onSearch }: { headingRef: React.RefObject<HTMLHeadingElement | null>; query: string; setQuery: (value: string) => void; onSearch: (event?: FormEvent) => void; }) {
  return <section className="relative overflow-hidden">
    <div className="absolute inset-x-0 top-0 h-[580px] bg-[#f3f7fd]" />
    <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[1.6fr_1fr] lg:gap-12 lg:py-16">
      <div className="z-10 max-w-2xl">
        <h1 ref={headingRef} tabIndex={-1} className="max-w-xl text-[clamp(2.5rem,5vw,4.2rem)] font-black leading-[1.04] tracking-[-0.065em] text-[#10243f] outline-none">Compare restaurant deals for <span className="text-[#1761d1]">the food you crave.</span></h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-[#55657b]">Choose where to eat with confidence. Compare what’s included, prices, and requirements in one place.</p>
        <form onSubmit={onSearch} className="mt-8 max-w-xl">
          <label htmlFor="food-search" className="mb-2 block text-sm font-bold text-[#263d5b]">Search by food</label>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] rounded-2xl border-2 border-[#aec7ea] bg-white p-1.5 shadow-[0_18px_48px_rgba(20,63,125,.14)] focus-within:border-[#1761d1] focus-within:ring-4 focus-within:ring-[#1761d1]/10">
            <Search className="ml-3 mt-3 size-5 shrink-0 text-[#64758c]" />
            <Input id="food-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Try “burgers”" className="h-11 min-w-0 border-0 bg-transparent text-base shadow-none focus-visible:ring-0 md:text-base" autoComplete="off" />
            <Button type="submit" size="lg" className="col-span-2 mt-2 h-12 w-full rounded-xl bg-[#1761d1] px-5 font-bold hover:bg-[#0f50b4]">Find deals <ArrowRight className="size-4" /></Button>
          </div>
        </form>
        <div className="mt-3 max-w-xl">
          <Button variant="link" onClick={() => { setQuery("Burgers"); onSearch(); }} className="h-11 px-0 font-bold text-[#1755aa]">Try Burgers <ArrowRight className="size-4" /></Button>
          <p className="text-sm leading-6 text-[#607087]">Class prototype with four mock burger offers. Promotions are examples only.</p>
        </div>
      </div>
      <figure className="w-full max-w-sm justify-self-center overflow-hidden rounded-2xl border border-[#d9e2ec] bg-white lg:justify-self-end">
        <img src="/burger-hero.png" alt="Cheeseburger and fries" className="h-44 w-full object-cover object-center sm:h-56 lg:h-64" />
        <figcaption className="p-4 text-sm leading-6 text-[#55657b]">
          <span className="block font-bold text-[#10243f]">One craving. Four restaurant offers.</span>
          Compare example burger deals before you choose.
        </figcaption>
      </figure>
    </div>
  </section>;
}

function Results({ headingRef, onBack, onDeal }: { headingRef: React.RefObject<HTMLHeadingElement | null>; onBack: () => void; onDeal: () => void; }) {
  return <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
    <Button variant="ghost" onClick={onBack} className="-ml-3 mb-5 text-[#53657b] hover:bg-[#edf3fb]"><ArrowLeft /> New search</Button>
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-extrabold uppercase tracking-[.13em] text-[#1761d1]">4 example offers</p><h1 ref={headingRef} tabIndex={-1} className="mt-1 text-4xl font-black tracking-[-0.045em] text-[#10243f] outline-none sm:text-5xl">Burger deals</h1><p className="mt-3 text-base text-[#5d6e84]">Compare what you get, the price or savings, and the requirements. Discounts are not final prices.</p></div>
    </div>
    <div className="mt-8 grid gap-4">{deals.map((deal) => <article key={deal.id} className="group relative grid gap-5 rounded-2xl border border-[#d9e2ec] bg-white p-5 shadow-[0_8px_28px_rgba(16,47,96,.06)] transition-all hover:-translate-y-0.5 hover:border-[#9dbce8] hover:shadow-[0_16px_38px_rgba(16,47,96,.11)] lg:grid-cols-[minmax(150px,.8fr)_minmax(0,1.15fr)_minmax(0,1.4fr)_126px] lg:items-center sm:p-6">
      {deal.badge && <span className="absolute -top-3 right-5 rounded-full bg-[#ffd84d] px-3 py-1 text-xs font-black uppercase tracking-wide text-[#10243f] shadow-sm">{deal.badge}</span>}
      <div className="flex items-center gap-3.5"><span className={`grid size-12 shrink-0 place-items-center rounded-xl text-base font-black text-white shadow-sm ${deal.color}`}>{deal.monogram}</span><div><p className="font-extrabold text-[#172b47]">{deal.restaurant}</p><p className="mt-1 flex items-center gap-1.5 text-sm text-[#66778c]"><MapPin className="size-3.5" /> {deal.distance}</p></div></div>
      <div className="border-y border-[#e5ebf2] py-4 lg:border-x lg:border-y-0 lg:px-5 lg:py-1"><h2 className="text-lg font-black tracking-[-.015em] text-[#10243f]">{deal.title}</h2><p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#53657b]">What you get</p><p className="mt-1 text-sm leading-6 text-[#64758a]">{deal.summary}</p></div>
      <dl className="rounded-xl bg-[#f3f7fd] p-4">
        <dt className="text-xs font-bold uppercase tracking-wide text-[#53657b]">Price or savings · {deal.valueLabel}</dt>
        <dd className="mt-1 text-xl font-black tracking-tight text-[#1761d1]">{deal.value}</dd>
        <dt className="mt-3 text-xs font-bold uppercase tracking-wide text-[#53657b]">Requirements</dt>
        <dd className="mt-1 text-sm leading-6 text-[#53657b]">{deal.requirements}</dd>
      </dl>
      {deal.id === "whopper" ? <Button onClick={onDeal} variant="outline" className="h-11 rounded-xl border-[#1761d1] font-bold text-[#1755aa] hover:bg-[#1761d1] hover:text-white" aria-label={`View ${deal.title} from ${deal.restaurant}`}>View deal <ChevronRight /></Button> : <p className="text-sm leading-6 text-[#53657b]">Details not included in this prototype.</p>}
    </article>)}</div>
    <p className="mt-6 text-center text-sm text-[#718095]">Prototype offers for demonstration only. Confirm terms in the restaurant app.</p>
  </section>;
}

function Details({ headingRef, onBack }: { headingRef: React.RefObject<HTMLHeadingElement | null>; onBack: () => void; }) {
  return <section className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
    <Button variant="ghost" onClick={onBack} className="-ml-3 mb-5 text-[#53657b] hover:bg-[#edf3fb]"><ArrowLeft /> Back to burger deals</Button>
    <div className="overflow-hidden rounded-[1.75rem] border border-[#d7e1ed] bg-white shadow-[0_22px_60px_rgba(14,47,97,.11)]"><div className="grid lg:grid-cols-[1.05fr_.95fr]">
      <div className="bg-[#0d2e62] p-7 text-white sm:p-11"><div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-xl bg-[#e5482d] font-black shadow-lg">BK</span><div><p className="font-bold">Burger King</p><p className="mt-0.5 text-sm text-[#c7d7ef]">0.8 mi away</p></div></div>
        <div className="mt-12"><span className="inline-flex rounded-full bg-[#ffd84d] px-3 py-1.5 text-xs font-black uppercase tracking-wide text-[#10243f]">Complete meal</span><h1 ref={headingRef} tabIndex={-1} className="mt-5 text-5xl font-black leading-[.98] tracking-[-0.055em] outline-none sm:text-6xl">$5 Whopper Meal</h1><p className="mt-5 max-w-md text-lg leading-8 text-[#dce7f7]">A burger, fries, and a drink for $5 before tax. App and account required.</p></div>

      </div>
      <div className="p-7 sm:p-11"><h2 className="text-xl font-black tracking-tight text-[#10243f]">What you get</h2><ul className="mt-4 grid gap-3 text-[#4e6076]">{["One Whopper sandwich", "Small fries", "Small fountain drink"].map((item) => <li key={item} className="flex items-center gap-3"><span className="grid size-6 place-items-center rounded-full bg-[#e5f0ff] text-[#1761d1]"><Check className="size-4" strokeWidth={3} /></span>{item}</li>)}</ul>
        <dl className="mt-6 rounded-xl bg-[#f3f7fd] p-4">
          <dt className="text-xs font-bold uppercase tracking-wide text-[#53657b]">Price or savings · Meal price</dt>
          <dd className="mt-1 text-2xl font-black tracking-tight text-[#1761d1]">$5.00 before tax</dd>
          <dt className="mt-3 text-xs font-bold uppercase tracking-wide text-[#53657b]">Requirements</dt>
          <dd className="mt-1 text-sm leading-6 text-[#53657b]">Digital offer. App and account required. One offer per account at participating locations. Taxes may apply.</dd>
          <dt className="mt-3 text-xs font-bold uppercase tracking-wide text-[#53657b]">Example availability</dt>
          <dd className="mt-1 flex items-start gap-2 text-sm leading-6 text-[#53657b]"><Clock3 className="mt-1 size-4 shrink-0 text-[#1761d1]" />Through September 30, 2026</dd>
        </dl>
        <div className="mt-8 border-t border-[#dce5ef] pt-6"><h2 className="text-xl font-black tracking-tight text-[#10243f]">How to get it</h2><ol className="mt-4 grid gap-4 text-sm text-[#53657b]">{["Open the Burger King app and sign in.", "Find the offer under ‘Royal Perks’ and add it to your order.", "Choose pickup or dine-in and complete your order."].map((item, i) => <li key={item} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#1761d1] font-black text-white">{i + 1}</span><span>{item}</span></li>)}</ol>
        <Button className="mt-6 h-13 w-full rounded-xl bg-[#1761d1] text-base font-black hover:bg-[#0f50b4]" onClick={() => alert("Prototype complete — this would open the Burger King app.")}>Get deal <ExternalLink className="size-4" /></Button><p className="mt-3 text-center text-xs leading-5 text-[#7a8798]">Prototype offer—not a verified live promotion.</p>
        </div>

      </div>
    </div></div>
  </section>;
}
