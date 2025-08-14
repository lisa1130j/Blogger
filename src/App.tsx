import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Community from './pages/Community';
import AuthenticityVerification from './pages/AuthenticityVerification';
import CertifiedLabubu from './pages/CertifiedLabubu';
import About from './pages/About';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import Header from './components/Header'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import CreatePost from './components/CreatePost'
import Products from './components/Products'
import { BlogPostType } from './types/BlogPost'
import { features } from './config/features'
import Home from './pages/Home'
import Post from './pages/Post'
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from './contexts/AuthContext'

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
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <div className="container"> 
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreatePost onAddPost={addPost} />} />
                {features.enableProducts && (
                  <Route path="/products" element={<Products />} />
                )}
                <Route path="/community" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/authenticity-verification" element={<AuthenticityVerification />} />
                <Route path="/certified-labubu" element={<CertifiedLabubu />} />
                <Route path="/auth" element={<Home />} />
                <Route path="/:slug" element={<Post />} />
              </Routes>
              <Analytics/>
            </div>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
