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
    <main style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px" }}>
      <div className="hero-section">
        <img 
          src="/images/labubu-hero.png" 
          alt="Mischievous Labubu" 
          className="hero-image"
        />
        <div className="hero-content">
          <h1>That Labubu Life</h1>
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
      <ul>
        {items.map((p) => (
          <li key={p.slug} style={{ margin: "12px 0" }}>
            <a href={`/${p.slug}`} style={{ fontWeight: 600 }}>{p.title}</a>
            {p.description && <div style={{ opacity: 0.85 }}>{p.description}</div>}
            {p.date && <small style={{ opacity: 0.6 }}>{p.date}</small>}
          </li>
        ))}
      </ul>
    </main>
  );
}
