import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, ListGroup, Spinner, Alert, Image } from 'react-bootstrap';
import { Topic, Post, Reply } from '../types/Database';
import * as communityService from '../services/communityService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdPlaceholder from '../components/AdPlaceholder';

const Community = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [filter, setFilter] = useState('');
  const [activePostingTopic, setActivePostingTopic] = useState<string | null>(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<{ [topicId: string]: { author: string; content: string; location?: string; image?: string } }>(
    Object.fromEntries(topics.map(t => [t.id, { author: '', content: '', location: '', image: '' }]))
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [replyInputs, setReplyInputs] = useState<{ [postId: string]: { author: string; content: string } }>({});
  const [activeReply, setActiveReply] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string' && topic) {
          handleInputChange(topic.id, 'image', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (topicId: string, field: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [topicId]: {
        ...prev[topicId],
        [field]: value,
      },
    }));
  };

  const handleReplyInputChange = (postId: string, field: string, value: string) => {
    setReplyInputs(prev => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        [field]: value,
      },
    }));
  };

  const handlePost = async (topicId: string) => {
    try {
      const { author, content, location, image } = inputs[topicId];
      if (!content.trim()) return;

      await communityService.createPost({
        topic_id: topicId,
        user_id: user?.id,
        author: user ? (profile?.username || user.email?.split('@')[0] || 'User') : (author.trim() ? author : 'Anonymous'),
        content,
        location: topicId === 'finding' ? location : undefined,
        image_url: topicId === 'hangouts' ? image : undefined,
      });

      const updatedPosts = await communityService.getPostsByTopic(topicId);
      setTopics(prevTopics => 
        prevTopics.map(t => ({
          ...t,
          posts: t.id === topicId ? updatedPosts : (t.posts || [])
        }))
      );

      setInputs(prev => ({ ...prev, [topicId]: { author: '', content: '', location: '' } }));
    } catch (err) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', err);
    }
  };

  const handleReply = async (postId: string) => {
    try {
      const { author, content } = replyInputs[postId] || { author: '', content: '' };
      if (!content.trim()) return;

      await communityService.createReply({
        post_id: postId,
        user_id: user?.id,
        author: user ? (profile?.username || user.email?.split('@')[0] || 'User') : (author.trim() ? author : 'Anonymous'),
        content,
      });

      const updatedPosts = await communityService.getPostsByTopic(selectedTopic);
      setTopics(prevTopics => 
        prevTopics.map(t => ({
          ...t,
          posts: t.id === selectedTopic ? updatedPosts : (t.posts || [])
        }))
      );

      setReplyInputs(prev => ({ ...prev, [postId]: { author: '', content: '' } }));
      setActiveReply(null);
    } catch (err) {
      setError('Failed to create reply. Please try again.');
      console.error('Error creating reply:', err);
    }
  };

  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true);
        const topics = await communityService.getTopics();
        
        if (topics.length > 0) {
          setSelectedTopic(topics[0].id);
          const posts = await communityService.getPostsByTopic(topics[0].id);
          
          setTopics(topics.map(t => ({
            ...t,
            posts: t.id === topics[0].id ? posts : []
          })));
          
          setInputs(Object.fromEntries(
            topics.map(t => [t.id, { author: '', content: '', location: '', image: '' }])
          ));
        }
      } catch (err) {
        setError('Failed to load topics. Please refresh the page.');
        console.error('Error loading topics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTopics();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const posts = await communityService.getPostsByTopic(selectedTopic);
        setTopics(prevTopics => 
          prevTopics.map(t => ({
            ...t,
            posts: t.id === selectedTopic ? posts : (t.posts || [])
          }))
        );
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedTopic) {
      loadPosts();
    }
  }, [selectedTopic]);

  const filteredPosts = topics
    .find(t => t.id === selectedTopic)?.posts?.filter(post => {
      if (!filter) return true;
      const f = filter.toLowerCase();
      return (
        post.author.toLowerCase().includes(f) ||
        post.content.toLowerCase().includes(f) ||
        (post.location && post.location.toLowerCase().includes(f))
      );
    }) || [];

  const topic = topics.find(t => t.id === selectedTopic)!;

  if (loading && !topics.length) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!topic) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Alert variant="info">No topics available.</Alert>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="g-4">
        <Col lg={3}>
          <Card className="sticky-top" style={{ top: '1rem' }}>
            <Card.Body>
              <Card.Title 
                className="mb-3"
                style={{
                  background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Topics
              </Card.Title>
              <ListGroup variant="flush">
                {topics.map(topic => (
                  <ListGroup.Item
                    key={topic.id}
                    action
                    active={selectedTopic === topic.id}
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      setActivePostingTopic(null);
                    }}
                    className="border-0 rounded mb-2"
                    style={selectedTopic === topic.id ? {
                      background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info))"
                    } : {
                      background: "linear-gradient(135deg, rgba(255, 107, 156, 0.1), rgba(108, 223, 255, 0.1))"
                    }}
                  >
                    {topic.title}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <div className="d-flex justify-content-center mb-4">
            <AdPlaceholder format="banner" />
          </div>

          <Card className="mb-4">
            <Card.Body>
              <Form.Control
                type="text"
                placeholder="Search posts (author, content, location...)"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="mb-4"
              />

              {loading && (
                <div className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}

              <Card.Title 
                className="mb-3"
                style={{
                  background: "linear-gradient(135deg, var(--bs-primary), var(--bs-info))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                {topic.title}
              </Card.Title>
              <Card.Text className="text-muted mb-4">{topic.description}</Card.Text>

              {activePostingTopic !== topic.id ? (
                <Button
                  variant="primary"
                  className="mb-4 w-100"
                  style={{
                    background: "linear-gradient(90deg, var(--bs-primary), var(--bs-info))",
                    border: "none"
                  }}
                  onClick={() => user ? setActivePostingTopic(topic.id) : navigate('/auth')}
                >
                  {user ? 'Create a Post' : 'Sign in to Post'}
                </Button>
              ) : (
                <Form
                  className="mb-4"
                  onSubmit={e => {
                    e.preventDefault();
                    handlePost(topic.id);
                    setActivePostingTopic(null);
                  }}
                >
                  {!user && (
                    <Form.Group className="mb-3">
                      <Form.Label>Name (optional)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Your name (optional)"
                        value={inputs[topic.id].author}
                        onChange={e => handleInputChange(topic.id, 'author', e.target.value)}
                      />
                    </Form.Group>
                  )}

                  {(topic.id === 'finding' || topic.id === 'hangouts') && (
                    <Form.Group className="mb-3">
                      {topic.id === 'finding' && (
                        <>
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Location (e.g. Taipei, Online, etc.)"
                            value={inputs[topic.id].location}
                            onChange={e => handleInputChange(topic.id, 'location', e.target.value)}
                            required={topic.id === 'finding'}
                          />
                        </>
                      )}
                      {topic.id === 'hangouts' && (
                        <>
                          <Form.Label>Upload Image</Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            required
                          />
                          {selectedFile && (
                            <Image 
                              src={URL.createObjectURL(selectedFile)} 
                              alt="Preview"
                              className="mt-3 rounded"
                              fluid
                            />
                          )}
                        </>
                      )}
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Post</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={8}
                      placeholder="Write your post..."
                      value={inputs[topic.id].content}
                      onChange={e => handleInputChange(topic.id, 'content', e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button type="submit" variant="primary">Post</Button>
                    <Button variant="secondary" onClick={() => setActivePostingTopic(null)}>Cancel</Button>
                  </div>
                </Form>
              )}

              {filteredPosts.length === 0 ? (
                <Alert variant="info">No posts found.</Alert>
              ) : (
                filteredPosts.map(post => (
                  <Card key={post.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex gap-3 align-items-center">
                          <span className="text-primary fw-bold">{post.author}</span>
                          <small className="text-muted">{new Date(post.created_at).toLocaleString()}</small>
                        </div>
                        {post.location && (
                          <span className="text-info">{post.location}</span>
                        )}
                      </div>

                      {post.image_url && (
                        <Image 
                          src={post.image_url} 
                          alt="Labubu hangout"
                          className="mb-3 rounded"
                          fluid
                        />
                      )}

                      <Card.Text>{post.content}</Card.Text>

                      {post.replies && post.replies.length > 0 && (
                        <ListGroup variant="flush" className="mb-3 border-start ps-3">
                          {post.replies.map(reply => (
                            <ListGroup.Item key={reply.id} className="border-0 bg-light rounded mb-2">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <span className="text-secondary fw-bold">{reply.author}</span>
                                <small className="text-muted">{new Date(reply.created_at).toLocaleString()}</small>
                              </div>
                              <div>{reply.content}</div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}

                      {activeReply === post.id ? (
                        <Form
                          onSubmit={e => {
                            e.preventDefault();
                            handleReply(post.id);
                          }}
                          className="mt-3"
                        >
                          {!user && (
                            <Form.Control
                              type="text"
                              placeholder="Your name (optional)"
                              value={replyInputs[post.id]?.author || ''}
                              onChange={e => handleReplyInputChange(post.id, 'author', e.target.value)}
                              className="mb-2"
                            />
                          )}
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Write a reply..."
                            value={replyInputs[post.id]?.content || ''}
                            onChange={e => handleReplyInputChange(post.id, 'content', e.target.value)}
                            required
                            className="mb-2"
                          />
                          <div className="d-flex gap-2">
                            <Button type="submit" variant="primary" size="sm">Reply</Button>
                            <Button variant="secondary" size="sm" onClick={() => setActiveReply(null)}>Cancel</Button>
                          </div>
                        </Form>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          style={{
                            background: "linear-gradient(90deg, var(--bs-primary), var(--bs-info))",
                            border: "none"
                          }}
                          onClick={() => user ? setActiveReply(post.id) : navigate('/auth')}
                        >
                          {user ? 'Reply' : 'Sign in to Reply'}
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                ))
              )}
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-center">
            <AdPlaceholder format="banner" />
          </div>
        </Col>

        <Col lg={3}>
          <div className="sticky-top" style={{ top: '1rem' }}>
            <AdPlaceholder format="sidebar" />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Community;
