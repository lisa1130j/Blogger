import { Link } from 'react-router-dom'
import { PenTool, Home, ShoppingBag, Shield } from 'lucide-react'
import { features } from '../config/features'

const Header = () => {
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
              <li>
                <Link to="/community">
                  Community
                </Link>
              </li>
              <li>
                <Link to="/authenticity-verification">
                  <Shield size={18} />
                  Authenticity & Verification
                </Link>
              </li>
              </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
