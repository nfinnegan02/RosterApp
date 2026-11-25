import { NavLink } from 'react-router'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import { useAuth } from '../auth/AuthContext.jsx'

function AppNavbar() {
  const { user, logout } = useAuth();
  const isManager = user.access_level === 'manager';

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Staff Rostering</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            {isManager && <Nav.Link as={NavLink} to="/roster">Roster Management</Nav.Link>}
          </Nav>
          <div className="d-flex align-items-center gap-3">
            <Navbar.Text>
              {user.first_name} {user.last_name}
              {isManager && <span className="badge text-bg-secondary ms-2">Manager</span>}
            </Navbar.Text>
            <Button variant="outline-secondary" size="sm" onClick={logout}>Sign out</Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default AppNavbar
