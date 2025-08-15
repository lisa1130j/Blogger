import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BlogPostType } from '../types/BlogPost'
import { Save, ArrowLeft } from 'lucide-react'

interface CreatePostProps {
  onAddPost: (post: Omit<BlogPostType, 'id' | 'date'>) => void
}

const CreatePost = ({ onAddPost }: CreatePostProps) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim() || !author.trim()) {
      alert('Please fill in all required fields')
      return
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    const trimmedAuthor = author.trim();
    const trimmedExcerpt = excerpt.trim() || content.substring(0, 150) + '...';
    
    // Generate slug from title
    const slug = trimmedTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    onAddPost({
      title: trimmedTitle,
      content: trimmedContent,
      author: trimmedAuthor,
      excerpt: trimmedExcerpt,
      description: trimmedExcerpt, // Use excerpt as description
      slug
    })

    navigate('/')
  }

  return (
    <div>
      <button className="back-button" onClick={() => navigate('/')}>
        <ArrowLeft size={18} />
        Back to Posts
      </button>

      <div className="page-header">
        <h1>Create New Blog Post</h1>
        <p>Share your thoughts and ideas with the world</p>
      </div>

      <div className="blog-post">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="title" className="form-label required">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="Enter your blog post title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="author" className="form-label required">
              Author
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="form-input"
              placeholder="Your name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt" className="form-label">
              Excerpt
            </label>
            <input
              type="text"
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="form-input"
              placeholder="Brief description (optional - will auto-generate if empty)"
            />
            <div className="form-help">
              This will appear on the blog list page. If left empty, we'll automatically create one from your content.
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="content" className="form-label required">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              className="form-textarea"
              placeholder="Write your blog post content here..."
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Publish Post
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost
