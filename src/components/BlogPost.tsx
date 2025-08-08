import { useParams, Link } from 'react-router-dom'
import { BlogPostType } from '../types/BlogPost'
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react'

// Calculate reading time
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

interface BlogPostProps {
  posts: BlogPostType[]
}

const BlogPost = ({ posts }: BlogPostProps) => {
  const { id } = useParams<{ id: string }>()
  const post = posts.find(p => p.id === id)

  if (!post) {
    return (
      <div>
        <div className="empty-state">
          <h3>Post Not Found</h3>
          <p>The blog post you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <button className="back-button" onClick={() => window.history.back()}>
        <ArrowLeft size={18} />
        Back to Posts
      </button>
      
      <article className="blog-post">
        <h1>{post.title}</h1>
        
        <div className="blog-post-meta">
          <div className="meta-group">
            <span className="meta-item">
              <User size={16} />
              {post.author}
            </span>
            <span className="meta-item">
              <Calendar size={16} />
              {post.date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="meta-item">
              <Clock size={16} />
              {calculateReadingTime(post.content)} min read
            </span>
          </div>
          <div className="meta-tags">
            <Tag size={16} />
            <span className="tag">Technology</span>
            <span className="tag">Web Development</span>
          </div>
        </div>
        
        <div className="blog-post-content">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  )
}

export default BlogPost
