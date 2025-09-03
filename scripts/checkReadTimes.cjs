const fs = require('fs');
const path = require('path');

function stripMarkdown(raw) {
  if (!raw) return '';
  let text = raw;
  // Remove YAML frontmatter
  text = text.replace(/^---[\s\S]*?---\s*/m, ' ');
  // Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, ' ');
  // Remove inline code backticks
  text = text.replace(/`([^`]*)`/g, '$1');
  // Images ![alt](url) -> alt
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1');
  // Links [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
  // Strip HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Headings markers
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, '');
  // Blockquotes
  text = text.replace(/^\s*>\s?/gm, '');
  // Lists bullets and ordered
  text = text.replace(/^\s*[-*+]\s+/gm, '');
  text = text.replace(/^\s*\d+\.\s+/gm, '');
  // Emphasis markers
  text = text.replace(/[*_~]{1,3}/g, '');
  // URLs
  text = text.replace(/https?:\/\/[\w./?#=&%+-]+/g, ' ');
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

function readingTimeMinutes(content, wordsPerMinute = 200) {
  const plain = stripMarkdown(content);
  const words = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
  return { minutes: Math.ceil(words / wordsPerMinute), words };
}

const postsDir = path.join(__dirname, '..', 'src', 'posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

const results = files.map(file => {
  const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const { minutes, words } = readingTimeMinutes(raw);
  return { file: file.replace('.md',''), minutes, words };
}).sort((a,b)=> a.file.localeCompare(b.file));

console.table(results);
