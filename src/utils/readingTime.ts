function stripMarkdown(raw: string): string {
  if (!raw) return ''
  let text = raw
  // Remove YAML frontmatter
  text = text.replace(/^---[\s\S]*?---\s*/m, ' ')
  // Remove fenced code blocks
  text = text.replace(/```[\s\S]*?```/g, ' ')
  // Remove inline code backticks
  text = text.replace(/`([^`]*)`/g, '$1')
  // Images ![alt](url) -> alt
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '$1')
  // Links [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
  // Strip HTML tags
  text = text.replace(/<[^>]+>/g, ' ')
  // Headings markers
  text = text.replace(/^\s{0,3}#{1,6}\s+/gm, '')
  // Blockquotes
  text = text.replace(/^\s*>\s?/gm, '')
  // Lists bullets and ordered
  text = text.replace(/^\s*[-*+]\s+/gm, '')
  text = text.replace(/^\s*\d+\.\s+/gm, '')
  // Emphasis markers
  text = text.replace(/[*_~]{1,3}/g, '')
  // URLs
  text = text.replace(/https?:\/\/[\w./?#=&%+-]+/g, ' ')
  // Collapse whitespace
  text = text.replace(/\s+/g, ' ').trim()
  return text
}

export function readingTimeMinutes(content: string, wordsPerMinute = 200): number {
  const plain = stripMarkdown(content)
  const words = plain ? plain.split(/\s+/).filter(Boolean).length : 0
  return Math.ceil(words / wordsPerMinute)
}

export function readingTimeLabel(content: string, wordsPerMinute = 200): string {
  return `${readingTimeMinutes(content, wordsPerMinute)} min read`
}
