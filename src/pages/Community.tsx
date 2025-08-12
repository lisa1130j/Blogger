
import React, { useState, useEffect } from 'react';
import './Community.css';
import { Topic, Post, Reply } from '../types/Database';
import * as communityService from '../services/communityService';

const Community: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [filter, setFilter] = useState('');
  const [activePostingTopic, setActivePostingTopic] = useState<string | null>(null);
  const [inputs, setInputs] = useState<{ [topicId: string]: { author: string; content: string; location?: string; image?: string } }>(
    Object.fromEntries(topics.map(t => [t.id, { author: '', content: '', location: '', image: '' }]))
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Convert file to data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string' && topic) {
          handleInputChange(topic.id, 'image', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [replyInputs, setReplyInputs] = useState<{ [postId: string]: { author: string; content: string } }>({});
  const [activeReply, setActiveReply] = useState<string | null>(null);

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

      const newPost = await communityService.createPost({
        topic_id: topicId,
        author: author.trim() ? author : 'Anonymous',
        content,
        location: topicId === 'finding' ? location : undefined,
        image_url: topicId === 'hangouts' ? image : undefined,
      });

      // Refresh posts for this topic
      const updatedPosts = await communityService.getPostsByTopic(topicId);
      console.log('Updated posts after creation:', updatedPosts);
      
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
        author: author.trim() ? author : 'Anonymous',
        content,
      });

      // Refresh posts for this topic to get updated replies
      const updatedPosts = await communityService.getPostsByTopic(selectedTopic);
      console.log('Updated posts after reply:', updatedPosts);
      
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

  // Load initial data
  useEffect(() => {
    const loadTopics = async () => {
      try {
        setLoading(true);
        console.log('Loading topics...');
        const topics = await communityService.getTopics();
        console.log('Topics loaded:', topics);
        
        if (topics.length > 0) {
          // Set the selected topic first
          setSelectedTopic(topics[0].id);
          console.log('Selected first topic:', topics[0]);
          
          // Load posts for the first topic
          const posts = await communityService.getPostsByTopic(topics[0].id);
          console.log('Posts loaded for first topic:', posts);
          
          // Initialize all topics with empty posts array
          setTopics(topics.map(t => ({
            ...t,
            posts: t.id === topics[0].id ? posts : []
          })));
          
          // Initialize inputs state with all topics
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

  // Load posts when topic changes
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

  console.log('Selected topic:', selectedTopic);
  console.log('Topics:', topics);
  console.log('Filtered posts:', filteredPosts);

  const topic = topics.find(t => t.id === selectedTopic)!;

  if (loading && !topics.length) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px',
        color: 'var(--color-primary)'
      }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px',
        color: 'var(--color-error)'
      }}>
        {error}
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="empty-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '200px',
        color: 'var(--color-text-muted)'
      }}>
        No topics available.
      </div>
    );
  }

  return (
    <main className="page-layout">
      <aside className="community-sidebar">
        <h2 className="sidebar-title">Topics</h2>
        <ul className="sidebar-list">
          {topics.map(topic => (
            <li
              key={topic.id}
              className={selectedTopic === topic.id ? 'active' : ''}
              onClick={() => {
                setSelectedTopic(topic.id);
                setActivePostingTopic(null);
              }}
            >
              {topic.title}
            </li>
          ))}
        </ul>
      </aside>
      <div className="main-content">
        <div className="ad-container top">
          Ad Space (728x90)
        </div>
      <section className="community-content">
        <div className="community-filter">
          <input
            type="text"
            placeholder="Search posts (author, content, location...)"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <div className="community-section" key={topic.id} style={{ position: 'relative' }}>
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner" />
            </div>
          )}
          <h2>{topic.title}</h2>
          <p>{topic.description}</p>
          {/* Create Post Button and Form */}
          {activePostingTopic !== topic.id && (
            <button
              className="create-post-btn"
              style={{marginBottom: '1.5rem', background: 'linear-gradient(90deg, #6366f1 0%, #f472b6 100%)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.7rem 1.6rem', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 1px 4px rgba(99,102,241,0.08)'}}
              onClick={() => setActivePostingTopic(topic.id)}
            >
              Create a Post
            </button>
          )}
          {activePostingTopic === topic.id && (
            <form
              className="create-post-form"
              onSubmit={e => {
                e.preventDefault();
                handlePost(topic.id);
                setActivePostingTopic(null);
              }}
            >
              <div className="form-group">
                <label>Name (optional)</label>
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={inputs[topic.id].author}
                  onChange={e => handleInputChange(topic.id, 'author', e.target.value)}
                />
              </div>
              {(topic.id === 'finding' || topic.id === 'hangouts') && (
                <div className="form-group">
                  {topic.id === 'finding' && (
                    <>
                      <label>Location</label>
                      <input
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
                      <label>Upload Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        className="file-input"
                      />
                      {selectedFile && (
                        <div className="image-preview">
                          <img 
                            src={URL.createObjectURL(selectedFile)} 
                            alt="Preview" 
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              <div className="form-group">
                <label>Post</label>
                <textarea
                  placeholder="Write your post..."
                  value={inputs[topic.id].content}
                  onChange={e => handleInputChange(topic.id, 'content', e.target.value)}
                  required
                  rows={8}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Post</button>
                <button type="button" className="btn-secondary" onClick={() => setActivePostingTopic(null)}>Cancel</button>
              </div>
            </form>
          )}
          <div className="community-posts">
            {filteredPosts.length === 0 && <p className="no-posts">No posts found.</p>}
            {filteredPosts.map(post => (
              <div className="community-post" key={post.id}>
                <div className="post-header">
                  <span className="post-author">{post.author}</span>
                  <span className="post-date">{new Date(post.created_at).toLocaleString()}</span>
                  {post.location && <span className="post-location">{post.location}</span>}
                </div>
                <div className="post-content">
                  {post.image_url && (
                    <div className="post-image">
                      <img src={post.image_url} alt="Labubu hangout" />
                    </div>
                  )}
                  <span>{post.content}</span>
                </div>
                <div className="community-replies">
                  {post.replies && post.replies.length > 0 && (
                    <div className="replies-list">
                      {post.replies.map(reply => (
                        <div className="reply" key={reply.id}>
                          <span className="reply-author">{reply.author}</span>
                          <span className="reply-date">{new Date(reply.created_at).toLocaleString()}</span>
                          <span className="reply-content">{reply.content}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {activeReply === post.id ? (
                    <form
                      className="reply-form"
                      onSubmit={e => {
                        e.preventDefault();
                        handleReply(post.id);
                      }}
                      style={{marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-end', flexWrap: 'wrap'}}
                    >
                      <input
                        type="text"
                        placeholder="Your name (optional)"
                        value={replyInputs[post.id]?.author || ''}
                        onChange={e => handleReplyInputChange(post.id, 'author', e.target.value)}
                        style={{minWidth: '120px'}}
                      />
                      <textarea
                        placeholder="Write a reply..."
                        value={replyInputs[post.id]?.content || ''}
                        onChange={e => handleReplyInputChange(post.id, 'content', e.target.value)}
                        required
                        rows={2}
                        style={{minWidth: '220px', maxWidth: '400px', fontFamily: 'inherit'}}
                      />
                      <button type="submit">Reply</button>
                      <button type="button" onClick={() => setActiveReply(null)} style={{marginLeft: '0.5rem', background: '#eee', color: '#6366f1', border: 'none', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 600, cursor: 'pointer'}}>Cancel</button>
                    </form>
                  ) : (
                    <button className="show-reply-btn" style={{marginTop: '1rem', background: 'linear-gradient(90deg, #6366f1 0%, #f472b6 100%)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.2rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 1px 4px rgba(99,102,241,0.08)'}} onClick={() => setActiveReply(post.id)}>Reply</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="ad-container bottom">
          Ad Space (728x90)
        </div>
      </section>
      </div>
      <aside className="sidebar">
        <div className="ad-container sidebar">
          Ad Space (300x600)
        </div>
      </aside>
    </main>
  );
};

export default Community;
