import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../context/useAuth';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  const participantLinks = [
    { path: '/dashboard', label: '🏠 Dashboard' },
    { path: '/events', label: '🎪 Browse Events' },
    { path: '/participant/clubs', label: '🏛️ Clubs' },
    { path: '/participant/profile', label: '👤 Profile' },
  ];

  const organizerLinks = [
    { path: '/organizer', label: '📊 Dashboard' },
    { path: '/organizer/events', label: '🗓️ My Events' },
    { path: '/organizer/profile', label: '👤 Profile' },
  ];

  const adminLinks = [
    { path: '/admin', label: '⚙️ Dashboard' },
    { path: '/admin/organizers', label: '🏛️ Manage Clubs' },
    { path: '/admin/password-resets', label: '🔑 Reset Requests' },
  ];

  const links =
    user?.role === 'organizer' ? organizerLinks :
    user?.role === 'admin' ? adminLinks :
    participantLinks;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-logo">
          🎪 <span>Felicity</span>
        </Link>
      </div>

      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        {user ? (
          <>
            {links.map(link => (
              <Link key={link.path} to={link.path} className={isActive(link.path)} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <button className="btn-logout" onClick={handleLogout}>🚪 Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={isActive('/login')}>Login</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
