import { Link, useNavigate } from 'react-router-dom'
import { PenTool, Home, ShoppingBag, Shield, Award, UserCircle } from 'lucide-react'
import { features } from '../config/features'
import { useAuth } from '../contexts/AuthContext'
import { UserMenu } from './auth/UserMenu'
import { Navbar, Nav, Container } from 'react-bootstrap'

const Header = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Navbar expand="lg" className="header" fixed="top" style={{ height: 'var(--header-height)' }}>
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-text">
          ThatLabubuLife
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-2">
              <Home size={18} />
              Home
            </Nav.Link>
            {features.enableCreatePost && (
              <Nav.Link as={Link} to="/create" className="d-flex align-items-center gap-2">
                <PenTool size={18} />
                Create Post
              </Nav.Link>
            )}
            {features.enableProducts && (
              <Nav.Link as={Link} to="/products" className="d-flex align-items-center gap-2">
                <ShoppingBag size={18} />
                Products
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/authenticity-verification" className="d-flex align-items-center gap-2">
              <Shield size={18} />
              Authenticity & Verification
            </Nav.Link>
            {/* <Nav.Link as={Link} to="/certified-labubu" className="d-flex align-items-center gap-2">
              <Award size={18} />
              Certified Labubu
            </Nav.Link> */}
            <Nav.Link as={Link} to="/about" className="d-flex align-items-center gap-2">
              <UserCircle size={18} />
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="d-flex align-items-center gap-2">
              <PenTool size={18} />
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
