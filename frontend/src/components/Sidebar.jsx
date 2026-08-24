import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Bookmark,
  BarChart3,
  GitCompareArrows,
  Globe,
  Info,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/stocks', label: 'Stocks', icon: TrendingUp },
  { to: '/watchlist', label: 'Watchlist', icon: Bookmark },
  { to: '/analysis', label: 'Analysis', icon: BarChart3 },
  { to: '/compare', label: 'Compare', icon: GitCompareArrows },
  { to: '/stocks', label: 'Market', icon: Globe },
  { to: '/about', label: 'About', icon: Info },
];

const Sidebar = ({ isOpen, onClose }) => (
  <>
    {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <h1>StockVision</h1>
        <span className="sidebar-subtitle">MARKET ANALYTICS</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <span>StockVision v1.0</span>
      </div>
    </aside>
  </>
);

export default Sidebar;
