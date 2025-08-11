import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BlogPostType } from '../types/BlogPost'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { getPostBySlug } from '../utils/markdown'

// Calculate reading time
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPostType | null>(null)

  useEffect(() => {
    const loadPost = async () => {
      if (slug) {
        const loadedPost = await getPostBySlug(slug)
        setPost(loadedPost)
      }
    }
    loadPost()
  }, [slug])

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
  
  useEffect(() => {
  if (!post?.html) return;
  const container = document.querySelector('.blog-post-content') as HTMLElement | null;
  if (!container) return;

  container.querySelectorAll('a').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    (a as HTMLAnchorElement).style.pointerEvents = 'auto';
    (a as HTMLAnchorElement).style.textDecoration = 'underline';
    (a as HTMLAnchorElement).style.cursor = 'pointer';
  });
}, [post?.html]);


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
        </div>
        
        {post.cover && (
          <img 
            src={post.cover} 
            alt={post.title}
            className="blog-post-cover"
            style={{
              width: '100%',
              height: '300px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '2rem'
            }}
          />
        )}
        
        <div 
          className="blog-post-content markdown-content"
          dangerouslySetInnerHTML={{ __html: post.html || '' }}
        />
      </article>
    </div>
  )
}

export default BlogPost
