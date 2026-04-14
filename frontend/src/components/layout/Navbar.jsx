import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiBriefcase, HiOutlineLogout } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout, isAdmin, isRecruiter } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <HiBriefcase size={28} />
          <span>CareerNest</span>
        </Link>

        <div className="navbar-links">
          <Link to="/jobs" className={isActive('/jobs')}>Browse Jobs</Link>

          {!user ? (
            <>
              <Link to="/login" className={isActive('/login')}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ marginLeft: '8px' }}>
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {isRecruiter() && (
                <Link to="/recruiter" className={isActive('/recruiter')}>Dashboard</Link>
              )}
              {isAdmin() && (
                <Link to="/admin" className={isActive('/admin')}>Admin</Link>
              )}
              {!isRecruiter() && !isAdmin() && (
                <Link to="/dashboard" className={isActive('/dashboard')}>Dashboard</Link>
              )}
              <button onClick={handleLogout} title="Logout">
                <HiOutlineLogout size={18} /> Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
