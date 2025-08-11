import React from "react";
import { useParams } from "react-router-dom";
import YAML from "yaml";
import BlogPost from "../components/BlogPost";

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
      <BlogPost
        title={frontmatter.title || "Untitled Post"}
        content={content}
        date={frontmatter.date || new Date().toLocaleDateString()}
        slug={slug || ""}
      />
    </main>
  );
}
