import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  KeyRound,
  LogOut,
  Menu,
  Moon,
  Sun,
  UserCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'Repository', to: '/repository' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/login');
  };

  const dashboardPath =
    user?.role === 'student' ? '/student/dashboard' :
    user?.role === 'teacher' ? '/teacher/dashboard' :
    user?.role === 'admin' ? '/admin/dashboard' : null;

  const isActive = (item) => {
    if (item.to === '/') return location.pathname === '/' && !location.hash;
    if (item.to.startsWith('/#')) return location.pathname === '/' && location.hash === item.to.slice(1);
    return location.pathname === item.to;
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('navbar-dark-mode');
  };

  const navigationLinks = (mobile = false) =>
    navigationItems.map((item) => (
      <Link
        key={item.label}
        to={item.to}
        className={`saas-nav-link ${isActive(item) ? 'is-active' : ''}`}
        onClick={mobile ? (event) => event.currentTarget.closest('details')?.removeAttribute('open') : undefined}
      >
        {item.label}
      </Link>
    ));

  return (
    <nav className="saas-navbar" aria-label="Main navigation">
      <div className="saas-navbar-inner">
        <div className="saas-navbar-left">
          <Link to="/" className="saas-navbar-brand" aria-label="Open Repository home">
            <span className="saas-brand-icon"><BookOpen size={20} strokeWidth={2.4} /></span>
            <span>Open Repository</span>
          </Link>

          <div className="saas-nav-links" aria-label="Primary navigation">
            {navigationLinks()}
          </div>
        </div>

        <div className="saas-nav-actions">
          {dashboardPath && (
            <Link to={dashboardPath} className="saas-dashboard-link">
              Dashboard
            </Link>
          )}

          <button type="button" className="saas-theme-toggle" onClick={toggleTheme} aria-label="Toggle color theme">
            <Sun className="theme-icon-sun" size={18} aria-hidden="true" />
            <Moon className="theme-icon-moon" size={18} aria-hidden="true" />
          </button>

          {user ? (
            <div className="saas-user-menu">
              <button
                type="button"
                className="saas-user-trigger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <UserCircle size={19} />
                <span className="saas-user-name">{user.name}</span>
                <ChevronDown size={16} className={menuOpen ? 'is-open' : ''} />
              </button>

              {menuOpen && (
                <div className="saas-user-popover" role="menu">
                  <div className="saas-user-popover-heading">
                    <strong>{user.name}</strong>
                    <span>{user.role}</span>
                  </div>
                  <Link to="/change-password" onClick={() => setMenuOpen(false)} className="saas-menu-item" role="menuitem">
                    <KeyRound size={16} /> Change Password
                  </Link>
                  <button type="button" onClick={handleLogout} className="saas-menu-item saas-logout-item" role="menuitem">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="saas-login-link">
              <UserCircle size={18} />
              Login
            </Link>
          )}
        </div>

        <details className="saas-mobile-menu">
          <summary aria-label="Open navigation menu">
            <Menu className="saas-menu-icon" size={22} aria-hidden="true" />
            <X className="saas-close-icon" size={22} aria-hidden="true" />
          </summary>
          <div className="saas-mobile-panel">
            <div className="saas-mobile-links">{navigationLinks(true)}</div>
            <div className="saas-mobile-actions">
              {dashboardPath && <Link to={dashboardPath} className="saas-dashboard-link">Dashboard</Link>}
              <button type="button" className="saas-theme-toggle" onClick={toggleTheme}>
                <Sun className="theme-icon-sun" size={18} aria-hidden="true" />
                <Moon className="theme-icon-moon" size={18} aria-hidden="true" />
                Theme
              </button>
              {user ? (
                <>
                  <Link to="/change-password" className="saas-mobile-account-link"><KeyRound size={17} /> Change Password</Link>
                  <button type="button" onClick={handleLogout} className="saas-mobile-logout"><LogOut size={17} /> Logout</button>
                </>
              ) : (
                <Link to="/login" className="saas-login-link"><UserCircle size={18} /> Login</Link>
              )}
            </div>
          </div>
        </details>
      </div>
    </nav>
  );
};

export default Navbar;
