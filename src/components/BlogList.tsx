import React from 'react'
import { Link } from 'react-router-dom'
import { BlogPostType } from '../types/BlogPost'
import { Calendar, ArrowRight, PenTool, Clock } from 'lucide-react'
import { getAllPosts } from '../utils/markdown'

// Calculate reading time
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

const BlogList: React.FC = () => {
  const [posts, setPosts] = React.useState<BlogPostType[]>([])

  React.useEffect(() => {
    const loadPosts = async () => {
      const posts = await getAllPosts()
      setPosts(posts)
    }
    loadPosts()
  }, [])
  return (
    <div className="grid" style={{ 
      display: 'grid', 
      gridTemplateColumns: 'minmax(0, 1fr) 300px',
      gap: 'var(--spacing-2xl)',
      alignItems: 'start'
    }}>
      <div>
        <div className="page-header">
        <h1>Latest Blog Posts</h1>
        <p>Discover stories, thinking, and expertise from our community</p>
      </div>
      
      {posts.length === 0 ? (
        <div className="empty-state">
          <h3>No blog posts yet</h3>
          <p>Be the first to share your thoughts with the world!</p>
          <Link to="/create" className="btn btn-primary">
            <PenTool size={18} />
            Create your first post
          </Link>
        </div>
      ) : (
        <div>
          <div className="ad-container">Advertisement</div>
          {posts.map((post, index) => (
            <React.Fragment key={post.slug}>
              <article className="blog-post">
              <h2>
                <Link to={`/post/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              
              <div className="blog-post-meta">
              <div className="meta-group">
                <span className="meta-item">
                  <Calendar size={14} />
                  {post.date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
                <span className="meta-item">
                  <Clock size={14} />
                  {calculateReadingTime(post.content)} min read
                </span>
              </div>
              </div>
              
              {post.cover && (
                <img 
                  src={post.cover} 
                  alt={post.title}
                  className="blog-post-cover"
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '1rem'
                  }}
                />
              )}
              <div className="blog-post-content">
                <p>{post.description}</p>
                <Link to={`/post/${post.slug}`} className="btn btn-secondary">
                  Read more
                  <ArrowRight size={16} />
                </Link>
              </div>
              </article>
              {index % 3 === 2 && <div className="ad-container">Advertisement</div>}
            </React.Fragment>
          ))}
        </div>
      )}
      </div>
      <div className="ad-container sidebar">Advertisement</div>
    </div>
  )
}

export default BlogList
