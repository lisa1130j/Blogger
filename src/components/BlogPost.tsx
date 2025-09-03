import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BlogPostType } from '../types/BlogPost'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import SocialShare from './SocialShare'
import { adjustLikes, getLikes } from '../services/likesService'
import { Container, Card, Button } from 'react-bootstrap'
import { readingTimeLabel } from '../utils/readingTime'

interface BlogPostProps {
  title: string
  content: string
  date: string
  slug: string
}

const BlogPost: React.FC<BlogPostProps> = ({ title, content, date, slug }) => {
  const navigate = useNavigate()
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const remoteLikes = await getLikes(slug)
        if (active) setLikes(remoteLikes)
      } catch (e) {
        console.error('Failed to load likes', e)
      }
      // keep per-user liked flag local only
      const userLiked = localStorage.getItem(`blog-liked-${slug}`)
      if (userLiked && active) setIsLiked(true)
    })()
    return () => { active = false }
  }, [slug])

  const handleLike = async () => {
    const newLikeState = !isLiked
    setIsLiked(newLikeState)
    try {
      const delta = newLikeState ? 1 : -1
      const updated = await adjustLikes(slug, delta)
      setLikes(updated)
      if (newLikeState) localStorage.setItem(`blog-liked-${slug}`, 'true')
      else localStorage.removeItem(`blog-liked-${slug}`)
    } catch (e) {
      console.error('Failed to update like', e)
      // revert optimistic toggle on error
      setIsLiked(!newLikeState)
    }
  }
  
  return (
    <Container fluid="md">
      <div className="mb-4">
        <Button 
          variant="link" 
          className="d-flex align-items-center gap-2 p-0"
          onClick={() => {
            const scrollPosition = sessionStorage.getItem('scrollPosition');
            navigate('/', { state: { scrollPosition: scrollPosition ? parseInt(scrollPosition) : 0 } });
          }}
        >
          <ArrowLeft size={18} />
          Back to Posts
        </Button>
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
                {readingTimeLabel(content)}
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
