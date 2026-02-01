import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { path: '/menu', name: 'Menu Manager', icon: <UtensilsCrossed size={18} /> },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-50 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <NavLink to="/" className="text-xl font-bold text-orange-600 tracking-tight">
          Restro<span className="text-gray-900 font-extrabold">ADMIN</span>
        </NavLink>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => 
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium ${
                  isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:text-orange-500'
                }`
              }
            >
              {link.icon} <span>{link.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-gray-600 hover:text-orange-600 focus:outline-none" 
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden py-4 border-t mt-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 px-6 py-3 rounded-lg font-medium ${
                  isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-600'
                }`
              }
            >
              {link.icon} <span>{link.name}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;