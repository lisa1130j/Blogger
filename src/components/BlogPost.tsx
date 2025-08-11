import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BlogPostType } from '../types/BlogPost'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SocialShare from './SocialShare'

// Calculate reading time
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

interface BlogPostProps {
  title: string
  content: string
  date: string
  slug: string
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content, date, slug }) => {
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    // Load likes from localStorage
    const storedLikes = localStorage.getItem(`blog-likes-${slug}`)
    const userLiked = localStorage.getItem(`blog-liked-${slug}`)
    if (storedLikes) {
      setLikes(parseInt(storedLikes))
    }
    if (userLiked) {
      setIsLiked(true)
    }
  }, [slug])

  const handleLike = () => {
    const newLikeState = !isLiked
    const newLikes = newLikeState ? likes + 1 : likes - 1
    
    setIsLiked(newLikeState)
    setLikes(newLikes)
    
    localStorage.setItem(`blog-likes-${slug}`, newLikes.toString())
    localStorage.setItem(`blog-liked-${slug}`, newLikeState ? 'true' : '')
  }
  
  return (
    <div>
      <Link to="/" className="back-button">
        <ArrowLeft size={18} />
        Back to Posts
      </Link>
      
      <article className="blog-post">
        <h1>{title}</h1>
        
        <div className="blog-post-meta">
          <div className="meta-group">
            <span className="meta-item">
              <Calendar size={16} />
              {date}
            </span>
            <span className="meta-item">
              <Clock size={16} />
              {calculateReadingTime(content)} min read
            </span>
          </div>
        </div>
        
        <div className="blog-post-content markdown-content">
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
        
        <SocialShare
          title={title}
          url={window.location.href}
          onLike={handleLike}
          likes={likes}
          isLiked={isLiked}
        />
      </article>
    </div>
  )
}

export default BlogPost
