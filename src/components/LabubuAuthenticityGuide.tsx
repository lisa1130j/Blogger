import React from "react";
import AdPlaceholder from "./AdPlaceholder";

export type AccentColor =
  | "emerald"
  | "mint"
  | "teal"
  | "cyan"
  | "sky"
  | "rose"
  | "violet"
  | "indigo";

export interface LabubuAuthenticityGuideProps {
  accent?: AccentColor;
  className?: string;
}

interface ChecklistCardProps {
  title: string;
  desc: string;
  style?: React.CSSProperties;
}

const colorMap: Record<AccentColor, { text: string; border: string; bgSoft: string; button: string }> = {
  emerald: {
    text: "text-emerald-700",
    border: "border-emerald-600",
    bgSoft: "bg-emerald-50",
    button: "hover:bg-emerald-100",
  },
  mint: {
    text: "text-mint-700",
    border: "border-mint-600",
    bgSoft: "bg-mint-50",
    button: "hover:bg-mint-100",
  },
  teal: { text: "text-teal-700", border: "border-teal-600", bgSoft: "bg-teal-50", button: "hover:bg-teal-100" },
  cyan: { text: "text-cyan-700", border: "border-cyan-600", bgSoft: "bg-cyan-50", button: "hover:bg-cyan-100" },
  sky: { text: "text-sky-700", border: "border-sky-600", bgSoft: "bg-sky-50", button: "hover:bg-sky-100" },
  rose: { text: "text-rose-700", border: "border-rose-600", bgSoft: "bg-rose-50", button: "hover:bg-rose-100" },
  violet: { text: "text-violet-700", border: "border-violet-600", bgSoft: "bg-violet-50", button: "hover:bg-violet-100" },
  indigo: { text: "text-indigo-700", border: "border-indigo-600", bgSoft: "bg-indigo-50", button: "hover:bg-indigo-100" },
};

function clsx(...xs: Array<string | undefined | false>) {
  return xs.filter(Boolean).join(" ");
}

function ChecklistCard({ title, desc, style }: ChecklistCardProps) {
  return (
    <div className="rounded-2xl border p-6 shadow-sm hover:shadow-lg transition-all duration-300" style={style}>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}

export default function LabubuAuthenticityGuide({
  accent = "emerald",
  className,
}: LabubuAuthenticityGuideProps) {
  const c = colorMap[accent] ?? colorMap.emerald;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_300px] gap-8 relative">
      <div className="min-w-0">
        <section className={clsx("py-10", className)} aria-labelledby="labubu-auth-title">
            {/* Top Banner Ad */}
            <div className="mb-8 flex justify-center">
              <AdPlaceholder format="banner" />
            </div>

            <header className="mb-8 text-center">
              <h1 
                id="labubu-auth-title" 
                className="text-3xl font-bold tracking-tight"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-accent), var(--color-accent-2))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Labubu Authenticity Guide
              </h1>
              <p className="mt-2 text-sm text-gray-500">How to spot a genuine Pop Mart Labubu vs a counterfeit.</p>
            </header>

            {/* Two-up: Real vs Fake */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* REAL */}
              <article 
                className="rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-all duration-300" 
                style={{ 
                  borderColor: "var(--color-primary)",
                  background: "linear-gradient(135deg, rgba(255, 107, 156, 0.1), rgba(108, 223, 255, 0.1))"
                }} 
                aria-labelledby="real-heading"
              >
                <div className="space-y-3 p-5">
                  <h2 id="real-heading" style={{ color: "var(--color-primary)" }} className="text-xl font-semibold">
                    REAL (Authentic)
                  </h2>
                  <ul className="list-inside space-y-2">
                    <li>Matte, crisp packaging print; colors are not overly saturated.</li>
                    <li>Clean paint lines, correct facial proportions.</li>
                    <li>
                      <span className="font-medium">Exactly 9 teeth</span> with sharp, even spacing.
                    </li>
                    <li>Smooth vinyl; seams are tight and consistent.</li>
                    <li>
                      Foot sole has a clear, precise <span className="font-medium">POP MART</span> imprint.
                    </li>
                    <li>
                      Holographic/silver <span className="font-medium">scratch-off QR sticker</span> present.
                    </li>
                    <li>2024+ may show a small UV stamp on the right foot (blacklight).</li>
                  </ul>
                </div>
              </article>

              {/* FAKE */}
              <article 
                className="rounded-2xl border bg-white shadow-sm hover:shadow-lg transition-all duration-300" 
                style={{ 
                  borderColor: "var(--color-error)",
                  background: "linear-gradient(135deg, rgba(255, 82, 82, 0.1), rgba(255, 107, 156, 0.1))"
                }} 
                aria-labelledby="fake-heading"
              >
                <div className="space-y-3 p-5">
                  <h2 id="fake-heading" style={{ color: "var(--color-error)" }} className="text-xl font-semibold">
                    FAKE (Counterfeit)
                  </h2>
                  <ul className="list-inside space-y-2">
                    <li>Glossy or overly bright box; blurry edges in printing.</li>
                    <li>Uneven paint, off-model face/ears, sloppy seams.</li>
                    <li>
                      <span className="font-medium">Wrong tooth count</span> (often 8 or 10) or rounded teeth.
                    </li>
                    <li>Plastic feels flimsy or overly shiny.</li>
                    <li>Foot logo missing, soft, or misaligned.</li>
                    <li>QR sticker missing, non-holographic, or redirects to unknown domain.</li>
                  </ul>
                </div>
              </article>
            </div>

            {/* Middle Banner Ad */}
            <div className="my-10 flex justify-center">
              <AdPlaceholder format="banner" />
            </div>

            {/* Quick Checklist */}
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              <ChecklistCard 
                title="1) Box & Print" 
                desc="Matte finish, soft colors, sharp lines. No spelling errors."
                style={{
                  borderColor: "var(--color-primary)",
                  background: "linear-gradient(135deg, rgba(255, 107, 156, 0.05), rgba(108, 223, 255, 0.05))"
                }}
              />
              <ChecklistCard 
                title="2) Teeth & Sculpt" 
                desc="Nine sharp teeth, correct proportions, clean seams."
                style={{
                  borderColor: "var(--color-secondary)",
                  background: "linear-gradient(135deg, rgba(156, 136, 255, 0.05), rgba(255, 184, 108, 0.05))"
                }}
              />
              <ChecklistCard 
                title="3) Foot & Logos" 
                desc="Crisp POP MART foot imprint; no smudging or drift."
                style={{
                  borderColor: "var(--color-accent-2)",
                  background: "linear-gradient(135deg, rgba(108, 223, 255, 0.05), rgba(255, 107, 156, 0.05))"
                }}
              />
            </div>

            {/* QR Verification Steps */}
            <div 
              className="mt-10 rounded-2xl border p-6"
              style={{
                borderColor: "var(--color-primary)",
                background: "linear-gradient(135deg, rgba(255, 107, 156, 0.1), rgba(108, 223, 255, 0.1))"
              }}
            >
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>
                Verify with the QR Sticker
              </h3>
              <ol className="mt-3 list-inside list-decimal space-y-2 text-sm">
                <li>
                  Locate the <span className="font-medium">holographic/silver scratch-off</span> QR sticker (box or hang tag).
                </li>
                <li>Scratch gently to reveal the code, then scan with your phone's camera.</li>
                <li>
                  Authentic results load on a Pop Mart domain (e.g., <span className="font-mono">popmart.com</span> /
                  <span className="font-mono"> m-gss.popmart.com</span>).
                </li>
                <li>If it redirects elsewhere or fails to validate, treat as suspicious.</li>
              </ol>
              <div className="mt-4 text-sm">
                <a
                  href="https://www.popmart.com/us/help/authenticity-check"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium border transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "linear-gradient(135deg, var(--color-primary), var(--color-accent-2))",
                    color: "white",
                    borderColor: "transparent"
                  }}
                >
                  Check Authenticity on Pop Mart →
                </a>
              </div>
            </div>

            {/* Trusted Buying Tips */}
            <div 
              className="mt-10 rounded-2xl border p-6 shadow-sm"
              style={{
                borderColor: "var(--color-secondary)",
                background: "linear-gradient(135deg, rgba(156, 136, 255, 0.1), rgba(255, 184, 108, 0.1))"
              }}
            >
              <h3 className="text-lg font-semibold" style={{ color: "var(--color-secondary)" }}>
                Trusted Buying Tips
              </h3>
              <ul className="mt-2 list-inside list-disc text-sm">
                <li>Best: Pop Mart official stores, website, or vending machines.</li>
                <li>If reselling: ask for clear photos of the box, foot logo, and the intact QR sticker.</li>
                <li>Request live verification (seller scratches & scans on video).</li>
              </ul>
            </div>

            {/* Comparison Image */}
            <div className="mt-10 text-center">
              <h3 
                className="mb-6 text-xl font-semibold"
                style={{
                  background: "linear-gradient(135deg, var(--color-primary), var(--color-accent-2))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Can you spot the real one?
              </h3>
              <img 
                src="/images/labubu-compare.jpg" 
                alt="Labubu Comparison Guide"
                className="w-full rounded-2xl shadow-lg"
                style={{
                  maxWidth: '800px',
                  margin: '0 auto',
                  border: '2px solid var(--color-primary)',
                  background: 'linear-gradient(135deg, rgba(255, 107, 156, 0.1), rgba(108, 223, 255, 0.1))'
                }}
              />
            </div>
          </section>
      </div>

      {/* Sidebar Ad */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 w-[300px]">
          <AdPlaceholder format="sidebar" />
        </div>
      </aside>
    </div>
  );
}
