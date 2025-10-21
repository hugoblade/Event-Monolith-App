import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          🌍 World Clock
        </div>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/settings" 
              className={location.pathname === '/settings' ? 'nav-link active' : 'nav-link'}
            >
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;