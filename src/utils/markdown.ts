import { BlogPostType } from '../types/BlogPost'
import { parse } from 'yaml'

export async function getAllPosts(): Promise<BlogPostType[]> {
  const posts: BlogPostType[] = []
  
  // Import all markdown files from the posts directory
  const modules = import.meta.glob('../posts/*.md', { eager: true })
  
  for (const path in modules) {
    const content = modules[path] as { default: string }
    const filename = path.split('/').pop()?.replace('.md', '') || ''
    
    // Parse frontmatter and content
    const [, frontmatter = '', ...contentArr] = content.default.split('---')
    const metadata = parse(frontmatter)
    const postContent = contentArr.join('---').trim()
    
    posts.push({
      id: filename,
      slug: filename,
      title: metadata.title || filename,
      content: postContent,
      description: metadata.description || postContent.slice(0, 200) + '...',
      author: metadata.author || 'Anonymous',
      date: new Date(metadata.date || Date.now()),
      excerpt: metadata.excerpt || postContent.slice(0, 150) + '...',
      cover: metadata.cover,
      likes: metadata.likes || 0,
      html: metadata.html
    })
  }
  
  // Sort posts by date (newest first)
  return posts.sort((a, b) => b.date.getTime() - a.date.getTime())
}
