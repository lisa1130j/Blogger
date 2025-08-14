import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BlogPostType } from '../types/BlogPost'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SocialShare from './SocialShare'
import { Container, Card, Button } from 'react-bootstrap'

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
    <Container fluid="md">
      <div className="mb-4">
        <Link to="/">
          <Button variant="link" className="d-flex align-items-center gap-2 p-0">
            <ArrowLeft size={18} />
            Back to Posts
          </Button>
        </Link>
      </div>
      
      <Card className="blog-post shadow-sm border-0">
        <Card.Body className="px-4 py-4">
          <Card.Title as="h1">{title}</Card.Title>
          
          <div className="mb-4">
            <div className="d-flex gap-4">
              <span className="d-flex align-items-center gap-2 text-muted">
                <Calendar size={16} />
                {date}
              </span>
              <span className="d-flex align-items-center gap-2 text-muted">
                <Clock size={16} />
                {calculateReadingTime(content)} min read
              </span>
            </div>
          </div>
          
          <div className="blog-content px-2">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="h1 mb-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="h2 mb-3 mt-4" {...props} />,
                h3: ({ node, ...props }) => <h3 className="h3 mb-3 mt-4" {...props} />,
                h4: ({ node, ...props }) => <h4 className="h4 mb-3 mt-4" {...props} />,
                h5: ({ node, ...props }) => <h5 className="h5 mb-3 mt-4" {...props} />,
                h6: ({ node, ...props }) => <h6 className="h6 mb-3 mt-4" {...props} />,
                p: ({ node, ...props }) => <p className="mb-3 text-body lh-lg" {...props} />,
                a: ({ node, ...props }) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-decoration-underline"
                  />
                ),
                ul: ({ node, ...props }) => <ul className="list-unstyled mb-4 ps-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="mb-4 ps-4" {...props} />,
                li: ({ node, ...props }) => (
                  <li className="mb-2 d-flex align-items-start">
                    <span className="me-2">•</span>
                    <span {...props} />
                  </li>
                ),
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-start border-4 border-primary ps-4 py-2 mb-4 text-muted fst-italic" {...props} />
                ),
                code: ({ node, children, className, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match;
                  return isInline ? (
                    <code className="bg-light px-1 rounded" {...props}>{children}</code>
                  ) : (
                    <Card className="mb-3">
                      <Card.Body className="bg-light p-3">
                        <pre className="mb-0">
                          <code className={className} {...props}>{children}</code>
                        </pre>
                      </Card.Body>
                    </Card>
                  );
                },
                img: ({ node, ...props }) => (
                  <figure className="figure mb-4">
                    <img {...props} className="figure-img img-fluid rounded" />
                    {props.alt && <figcaption className="figure-caption text-center">{props.alt}</figcaption>}
                  </figure>
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
        </Card.Body>
      </Card>
    </Container>
  )
}

export default BlogPost
