import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'
import CreatePost from './components/CreatePost'
import { BlogPostType } from './types/BlogPost'

const initialPosts: BlogPostType[] = [
  {
    id: '1',
    title: 'Welcome to the Future of Blogging',
    content: 'This is my first blog post on this amazing new platform! I\'m excited to share my thoughts and experiences with you all.\n\nThis blogging platform is built with modern React and TypeScript, featuring a clean and intuitive design that makes writing and reading a pleasure. The responsive layout ensures your content looks great on any device.\n\nI\'ve been working on this platform for weeks, and I\'m thrilled to finally share it with the world. The goal was to create something that puts the focus back on the content and the reading experience.',
    author: 'Alex Johnson',
    date: new Date('2024-01-15'),
    excerpt: 'Welcome to my new blogging platform built with React and TypeScript. A clean, modern approach to sharing ideas.'
  },
  {
    id: '2',
    title: 'The Art of Modern Web Development',
    content: 'React has revolutionized how we build user interfaces, and TypeScript has brought type safety to the JavaScript ecosystem. Together, they create a powerful combination for building robust web applications.\n\nIn this post, I\'ll cover the essential concepts you need to know:\n\n• Component-based architecture and reusability\n• State management with hooks and context\n• Type safety with TypeScript interfaces\n• Modern CSS techniques and responsive design\n\nThe development experience has never been better, with tools like Vite providing lightning-fast hot reloading and build times that keep you in the flow.',
    author: 'Sarah Chen',
    date: new Date('2024-01-20'),
    excerpt: 'Exploring the powerful combination of React and TypeScript for building modern web applications.'
  },
  {
    id: '3',
    title: 'Design Systems and User Experience',
    content: 'Creating a consistent and delightful user experience starts with a well-thought-out design system. Every color, spacing, and interaction should serve a purpose.\n\nKey principles I follow:\n\n• Consistency in visual hierarchy and spacing\n• Accessibility as a first-class consideration\n• Performance optimization for smooth interactions\n• Mobile-first responsive design\n\nThe best interfaces are invisible – they get out of the way and let users focus on what matters most: the content and their goals.',
    author: 'Mike Rodriguez',
    date: new Date('2024-01-25'),
    excerpt: 'How design systems and thoughtful UX create better experiences for everyone.'
  }
]

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
              <Route path="/" element={<BlogList posts={posts} />} />
              <Route path="/post/:id" element={<BlogPost posts={posts} />} />
              <Route path="/create" element={<CreatePost onAddPost={addPost} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
