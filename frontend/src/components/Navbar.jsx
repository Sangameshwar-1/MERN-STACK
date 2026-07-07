import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../context/useAuth';
import { 
  Menu, X, LogOut, 
  LayoutDashboard, Compass, Building2, UserCircle, 
  CalendarDays, Settings, KeyRound, ShieldAlert
} from 'lucide-react';
import { Button } from './ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'text-white' : 'text-slate-400 hover:text-slate-200';

  const participantLinks = [
    { path: '/participant', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/participant/events', label: 'Browse', icon: Compass },
    { path: '/participant/clubs', label: 'Clubs', icon: Building2 },
    { path: '/participant/profile', label: 'Profile', icon: UserCircle },
  ];

  const organizerLinks = [
    { path: '/organizer', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/organizer/events', label: 'My Events', icon: CalendarDays },
    { path: '/organizer/profile', label: 'Profile', icon: UserCircle },
  ];

  const adminLinks = [
    { path: '/admin', label: 'Dashboard', icon: Settings },
    { path: '/admin/organizers', label: 'Manage Clubs', icon: Building2 },
    { path: '/admin/password-resets', label: 'Security', icon: KeyRound },
  ];

  const links =
    user?.role === 'organizer' ? organizerLinks :
    user?.role === 'admin' ? adminLinks :
    user ? participantLinks : [];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/[0.08] navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={user ? (user.role === 'admin' ? '/admin' : user.role === 'organizer' ? '/organizer' : '/participant') : '/'} className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_4px_15px_rgba(139,92,246,0.5)]">
                <span className="text-white font-extrabold text-2xl leading-none tracking-tighter">F</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white hidden sm:block">Felicity</span>
            </Link>
          </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              {links.map(link => {
                const Icon = link.icon;
                return (
                  <Link key={link.path} to={link.path} className={`flex items-center gap-2 text-sm font-medium transition-colors ${isActive(link.path)}`}>
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="h-4 w-px bg-white/[0.05]"></div>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className={`text-sm font-medium ${isActive('/login')}`}>
                Login
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 -mr-2 text-slate-400 hover:text-white" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#09090b] px-4 py-4 space-y-4">
          {user ? (
            <div className="flex flex-col space-y-3">
              {links.map(link => {
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    className={`flex items-center gap-3 py-2 text-sm font-medium ${isActive(link.path)}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                );
              })}
              <div className="border-t border-white/[0.08] pt-3">
                <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300" onClick={handleLogout}>
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">Login</Button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <Button className="w-full justify-center">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
