import React from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import YAML from "yaml";

const rawPosts = import.meta.glob("../posts/*.md", { as: "raw", eager: true }) as Record<string, string>;

type Frontmatter = { title?: string; date?: string; description?: string };

function parseFrontmatter(raw: string): { content: string; frontmatter: Frontmatter } {
  if (!raw.startsWith("---")) return { content: raw, frontmatter: {} };
  const match = raw.match(/^---\s*[\r\n]+([\s\S]*?)\r?\n---\s*/);
  if (!match) return { content: raw, frontmatter: {} };
  const yamlBlock = match[1];
  const frontmatter = (YAML.parse(yamlBlock) ?? {}) as Frontmatter;
  const content = raw.slice(match[0].length);
  return { content, frontmatter };
}

function getPost(slug: string) {
  const key = `../posts/${slug}.md`;
  const raw = rawPosts[key];
  if (!raw) return null;
  return parseFrontmatter(raw);
}

export default function Post() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : null;

  if (!post) {
    return (
      <main style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px" }}>
        <h1>Not found</h1>
        <p>We couldn't find that post.</p>
      </main>
    );
  }

  const { content, frontmatter } = post;

  return (
    <main style={{ maxWidth: 760, margin: "40px auto", padding: "0 16px" }}>
      <Link to="/" className="back-button">
        ← Back to posts
      </Link>
      <div className="blog-post">
        {frontmatter.title && <h1>{frontmatter.title}</h1>}
        {frontmatter.date && <small style={{ opacity: 0.7 }}>{frontmatter.date}</small>}
        <div style={{ marginTop: 24 }}>
          <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    a: ({ node, ...props }) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "underline", cursor: "pointer" }}
      />
    ),
  }}
>
  {content}
</ReactMarkdown>

        </div>
      </div>
    </main>
  );
}
