import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

const Navbar = ({ onMenuToggle, value, onChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="topbar">
      <button className="hamburger-btn" onClick={onMenuToggle}>
        <Menu size={20} />
      </button>
      <form className="topbar-search" onSubmit={handleSubmit}>
        <Search size={16} />
        <input
          type="text"
          placeholder="Search stocks..."
          value={value || ''}
          onChange={onChange}
        />
      </form>
      <div className="topbar-actions">
        <button aria-label="Notifications">
          <Bell size={18} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
