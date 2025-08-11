import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import CreatePost from './components/CreatePost'
import Products from './components/Products'
import { BlogPostType } from './types/BlogPost'
import { features } from './config/features'
import Home from './pages/Home'
import Post from './pages/Post'
import { Analytics } from "@vercel/analytics/react";

const initialPosts: BlogPostType[] = []

function App() {
  const [posts, setPosts] = useState<BlogPostType[]>(initialPosts)

  const addPost = (newPost: Omit<BlogPostType, 'id' | 'date'>) => {
    const post: BlogPostType = {
      ...newPost,
      id: Date.now().toString(),
      date: new Date()
    }
    setPosts([post, ...posts])
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <div className="container"> 
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:slug" element={<Post />} />
              <Route path="/create" element={<CreatePost onAddPost={addPost} />} />
              {features.enableProducts && (
                <Route path="/products" element={<Products />} />
              )}
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
