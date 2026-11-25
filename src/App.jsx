import { Routes, Route, Navigate } from 'react-router'
import Container from 'react-bootstrap/Container'
import Spinner from 'react-bootstrap/Spinner'
import AppNavbar from './components/AppNavbar.jsx'
import LoginModal from './components/LoginModal.jsx'
import ChangePasswordModal from './components/ChangePasswordModal.jsx'
import Home from './pages/Home.jsx'
import RosterManagement from './pages/RosterManagement.jsx'
import NotFound from './pages/NotFound.jsx'
import { useAuth } from './auth/AuthContext.jsx'

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center"><Spinner /></div>;
  if (!user) return <LoginModal />;
  // Pages don't mount (so fetch nothing) until a temporary password is replaced
  if (user.must_change_password) return <ChangePasswordModal />;

  const isManager = user.access_level === 'manager';

  return (
    <>
      <AppNavbar />
      <Container as="main" className="py-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roster" element={isManager ? <RosterManagement /> : <Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
