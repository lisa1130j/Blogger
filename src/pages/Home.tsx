import React from "react";
import YAML from "yaml";

const rawPosts = import.meta.glob("../posts/*.md", { as: "raw", eager: true }) as Record<string, string>;

type Item = { slug: string; title: string; date?: string; description?: string };

function parseFrontmatter(raw: string) {
  if (!raw.startsWith("---")) return { content: raw, fm: {} as Record<string, unknown> };
  const match = raw.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*/);
  if (!match) return { content: raw, fm: {} as Record<string, unknown> };
  const fm = (YAML.parse(match[1]) ?? {}) as Record<string, unknown>;
  const content = raw.slice(match[0].length);
  return { content, fm };
}

const items: Item[] = Object.entries(rawPosts)
  .map(([path, raw]) => {
    const slug = path.split("/").pop()!.replace(".md", "");
    const { fm } = parseFrontmatter(raw);
    return {
      slug,
      title: String((fm as any).title ?? slug),
      date: (fm as any).date as string | undefined,
      description: (fm as any).description as string | undefined,
    };
  })
  .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));

export default function Home() {
  return (
    <div className="relative max-w-[1400px] mx-auto px-4 min-h-screen">
      {/* Top Banner Ad */}
      <div className="flex justify-center mb-8">
        <div className="ad-container bg-gray-100 rounded-lg p-4 text-center h-[90px] w-[728px] flex items-center justify-center">
          Ad Space (728x90)
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,_1fr)_300px] gap-8">
        <main className="min-w-0">
      <div className="hero-section">
        <img 
          src="/images/labubu-hero.png" 
          alt="Mischievous Labubu" 
          className="hero-image"
        />
        <div className="hero-content">
          <h1>That Labubu Life</h1>
          <div className="welcome-message">
            <p>New to Labubu or a lifelong fan? Welcome to the burrow — where curiosity meets chaos and every ear tells a story.</p>
          </div>
          <div className="verify-section">
            <h2>Verify Your Labubu</h2>
            <p>Ensure your Labubu is authentic by checking its verification code on PopMart's official site.</p>
            <a 
              href="https://www.popmart.com/us/help/authenticity-check" 
              target="_blank" 
              rel="noopener noreferrer"
              className="verify-button"
            >
              Verify Authenticity
            </a>
          </div>
        </div>
      </div>
      <ul className="space-y-6 mt-10">
        {items.map((p) => (
          <li key={p.slug} className="border-b border-gray-100 pb-6 last:border-0">
            <a href={`/${p.slug}`} className="text-lg font-semibold hover:text-primary transition-colors">{p.title}</a>
            {p.description && <div className="mt-2 text-gray-600">{p.description}</div>}
            {p.date && <div className="mt-2 text-sm text-gray-500">{p.date}</div>}
          </li>
        ))}
      </ul>
        </main>
        
        {/* Sidebar Ad */}
        <aside className="hidden lg:block h-[calc(100vh-6rem)] w-[300px] max-w-[300px]">
          <div className="sticky top-24">
            <div className="ad-container bg-gray-100 rounded-lg p-4 text-center h-[500px] flex items-center justify-center">
              Ad Space (300x500)
            </div>
          </div>
        </aside>
      </div>
      
      {/* Banner Ads */}
      {/* <div className="flex justify-center my-8">
        <div className="ad-container bg-gray-100 rounded-lg p-4 text-center h-[90px] w-[728px] flex items-center justify-center">
          Ad Space (728x90)
        </div>
      </div> */}
    </div>
  );
}
