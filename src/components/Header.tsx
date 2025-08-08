import { Link } from 'react-router-dom'
import { PenTool, Home } from 'lucide-react'

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <h1>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              📝 Blogger
            </Link>
          </h1>
          <ul className="nav-links">
            <li>
              <Link to="/">
                <Home size={18} />
                Home
              </Link>
            </li>
            <li>
              <Link to="/create">
                <PenTool size={18} />
                Create Post
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
