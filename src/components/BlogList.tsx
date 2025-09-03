import React from 'react'
import { Link } from 'react-router-dom'
import { BlogPostType } from '../types/BlogPost'
import { Calendar, ArrowRight, PenTool, Clock } from 'lucide-react'
import { getAllPosts } from '../utils/markdown'
import { Container, Row, Col, Card, Button } from 'react-bootstrap'
import { readingTimeLabel } from '../utils/readingTime'

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
    <Container fluid>
      <Row>
        <Col lg={9}>
          <div className="page-header">
            <h1>Latest Blog Posts</h1>
            <p>Discover stories, thinking, and expertise from our community</p>
          </div>
          
          {posts.length === 0 ? (
            <div className="empty-state">
              <h3>No blog posts yet</h3>
              <p>Be the first to share your thoughts with the world!</p>
              <Link to="/create">
                <Button variant="primary" className="d-flex align-items-center gap-2">
                  <PenTool size={18} />
                  Create your first post
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="ad-container">Advertisement</div>
              {posts.map((post, index) => (
                <React.Fragment key={post.slug}>
                  <Card className="blog-post mb-4">
                    <Card.Body>
                      <Card.Title as="h2">
                        <Link to={`/post/${post.slug}`}>
                          {post.title}
                        </Link>
                      </Card.Title>
                      
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
                            {readingTimeLabel(post.content)}
                          </span>
                        </div>
                      </div>
                      
                      {post.cover && (
                        <Card.Img
                          src={post.cover}
                          alt={post.title}
                          className="blog-post-cover my-3"
                          style={{
                            height: '200px',
                            objectFit: 'cover'
                          }}
                        />
                      )}
                      <Card.Text className="blog-post-content">
                        {post.description}
                      </Card.Text>
                      <Link to={`/post/${post.slug}`}>
                        <Button
                          variant="secondary"
                          className="d-flex align-items-center gap-2"
                        >
                          Read more
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </Card.Body>
                  </Card>
                  {index % 3 === 2 && <div className="ad-container">Advertisement</div>}
                </React.Fragment>
              ))}
            </>
          )}
        </Col>
        <Col lg={3}>
          <div className="ad-container sidebar">Advertisement</div>
        </Col>
      </Row>
    </Container>
  )
}

export default BlogList
