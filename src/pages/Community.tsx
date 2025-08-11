
import React, { useState } from 'react';
import './Community.css';

type Reply = {
  id: string;
  author: string;
  content: string;
  date: Date;
};

type Post = {
  id: string;
  author: string;
  content: string;
  date: Date;
  location?: string;
  image?: string;
  replies?: Reply[];
};

type Topic = {
  id: string;
  title: string;
  description: string;
  posts: Post[];
};

// Example mock data
const initialTopics: Topic[] = [
  {
    id: 'general',
    title: 'General',
    description: 'Talk about anything related to the community.',
    posts: [],
  },
  {
    id: 'finding',
    title: 'Finding Labubu',
    description: 'Share and find Labubu in your area!',
    posts: [],
  },
  {
    id: 'hangouts',
    title: 'Labubu Hangouts',
    description: 'Share photos and stories of hanging out with your Labubu!',
    posts: [],
  },
];

const Community: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [selectedTopic, setSelectedTopic] = useState<string>(topics[0].id);
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
        if (typeof reader.result === 'string') {
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

  const handlePost = (topicId: string) => {
    const topicIdx = topics.findIndex(t => t.id === topicId);
    if (topicIdx === -1) return;
    const { author, content, location, image } = inputs[topicId];
    if (!content.trim()) return;
    const newPost: Post = {
      id: Date.now().toString(),
      author: author.trim() ? author : 'Anonymous',
      content,
      date: new Date(),
      location: topicId === 'finding' ? location : undefined,
      image: topicId === 'hangouts' ? image : undefined,
      replies: [],
    };
    const updatedTopics = [...topics];
    updatedTopics[topicIdx] = {
      ...updatedTopics[topicIdx],
      posts: [newPost, ...updatedTopics[topicIdx].posts],
    };
    setTopics(updatedTopics);
    setInputs(prev => ({ ...prev, [topicId]: { author: '', content: '', location: '' } }));
  };

  const handleReply = (postId: string) => {
    const topicIdx = topics.findIndex(t => t.id === selectedTopic);
    if (topicIdx === -1) return;
    const postIdx = topics[topicIdx].posts.findIndex(p => p.id === postId);
    if (postIdx === -1) return;
    const { author, content } = replyInputs[postId] || { author: '', content: '' };
    if (!content.trim()) return;
    const newReply: Reply = {
      id: Date.now().toString(),
      author: author.trim() ? author : 'Anonymous',
      content,
      date: new Date(),
    };
    const updatedTopics = [...topics];
    const post = { ...updatedTopics[topicIdx].posts[postIdx] };
    post.replies = [...(post.replies || []), newReply];
    updatedTopics[topicIdx].posts[postIdx] = post;
    setTopics(updatedTopics);
    setReplyInputs(prev => ({ ...prev, [postId]: { author: '', content: '' } }));
    setActiveReply(null);
  };

  const filteredPosts = topics
    .find(t => t.id === selectedTopic)?.posts.filter(post => {
      const f = filter.toLowerCase();
      return (
        post.author.toLowerCase().includes(f) ||
        post.content.toLowerCase().includes(f) ||
        (post.location && post.location.toLowerCase().includes(f))
      );
    }) || [];

  const topic = topics.find(t => t.id === selectedTopic)!;

  return (
    <main className="community-container community-flex">
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
      <section className="community-content">
        <div className="community-filter">
          <input
            type="text"
            placeholder="Search posts (author, content, location...)"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <div className="community-section" key={topic.id}>
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
                  <span className="post-date">{post.date?.toLocaleString?.() ?? ''}</span>
                  {post.location && <span className="post-location">{post.location}</span>}
                </div>
                <div className="post-content">
                  {post.image && (
                    <div className="post-image">
                      <img src={post.image} alt="Labubu hangout" />
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
                          <span className="reply-date">{reply.date?.toLocaleString?.() ?? ''}</span>
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
      </section>
    </main>
  );
};

export default Community;
