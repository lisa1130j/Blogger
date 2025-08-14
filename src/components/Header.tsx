import { Link, useNavigate } from 'react-router-dom'
import { PenTool, Home, ShoppingBag, Shield, Award, UserCircle } from 'lucide-react'
import { features } from '../config/features'
import { useAuth } from '../contexts/AuthContext'
import { UserMenu } from './auth/UserMenu'

const Header = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <h1>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              That Labubu Life
            </Link>
          </h1>
          <ul className="nav-links">
            <li>
              <Link to="/">
                <Home size={18} />
                Home
              </Link>
            </li>
            {features.enableCreatePost && (
              <li>
                <Link to="/create">
                  <PenTool size={18} />
                  Create Post
                </Link>
              </li>
            )}
            {features.enableProducts && (
              <li>
                <Link to="/products">
                  <ShoppingBag size={18} />
                  Products
                </Link>
              </li>
            )}
            {/* <li>
              <Link to="/community">
                Community
              </Link>
            </li> */}
            <li>
              <Link to="/authenticity-verification">
                <Shield size={18} />
                Authenticity & Verification
              </Link>
            </li>
           
            <li>
              <Link to="/about">
                <UserCircle size={18} />
                About
              </Link>
            </li>
            <li>
              <Link to="/contact">
                <PenTool size={18} />
                Contact
              </Link>
            </li>
            {/* <li>
              {user ? (
                <UserMenu />
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <UserCircle size={18} />
                  Sign In
                </button>
              )}
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
