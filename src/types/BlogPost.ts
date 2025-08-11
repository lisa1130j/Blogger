export interface BlogPostType {
  id: string
  title: string
  content: string
  author: string
  date: Date
  excerpt: string
  likes?: number
  html?: string
  cover?: string
}
