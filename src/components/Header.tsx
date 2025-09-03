import { Link, useNavigate } from 'react-router-dom'
import { Home, FilePlus, Store, ShieldCheck, Info, Mail } from 'lucide-react'
import { features } from '../config/features'
import { useAuth } from '../contexts/AuthContext'
import { UserMenu } from './auth/UserMenu'
import { Navbar, Nav, Container } from 'react-bootstrap'

const Header = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <Navbar expand="lg" className="header py-2" fixed="top">
      <Container className="px-3 px-sm-4">
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="brand-text fs-4 fs-lg-3"
          style={{ lineHeight: 1.2 }}
        >
          ThatLabubuLife
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto py-2 py-lg-0">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center gap-2 py-2 py-lg-3">
              <Home size={18} />
              Home
            </Nav.Link>
            {features.enableCreatePost && (
              <Nav.Link as={Link} to="/create" className="d-flex align-items-center gap-2 py-2 py-lg-3">
                <FilePlus size={18} />
                Create Post
              </Nav.Link>
            )}
            {features.enableProducts && (
              <Nav.Link as={Link} to="/products" className="d-flex align-items-center gap-2 py-2 py-lg-3">
                <Store size={18} />
                Products
              </Nav.Link>
            )}
            <Nav.Link as={Link} to="/authenticity-verification" className="d-flex align-items-center gap-2 py-2 py-lg-3">
              <ShieldCheck size={18} />
              Authenticity & Verification
            </Nav.Link>
            {/* <Nav.Link as={Link} to="/certified-labubu" className="d-flex align-items-center gap-2">
              <Award size={18} />
              Certified Labubu
            </Nav.Link> */}
            <Nav.Link as={Link} to="/about" className="d-flex align-items-center gap-2 py-2 py-lg-3">
              <Info size={18} />
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="d-flex align-items-center gap-2 py-2 py-lg-3">
              <Mail size={18} />
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
