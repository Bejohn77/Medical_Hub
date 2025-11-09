import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiLogOut, FiMenu, FiX, FiCalendar, FiSearch, FiShield } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navButtonClasses = "inline-flex items-center gap-2 text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors";

  return (
    <nav className="relative bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="absolute inset-0 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-r from-primary-50 via-transparent to-secondary-50" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-secondary-600"
              >
                Health Hub
              </motion.span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <span className="hidden lg:inline-flex items-center text-gray-700 px-3 py-2 text-sm">
                  <FiUser className="mr-2" />
                  {user?.user?.first_name || user?.user?.username}
                </span>
                {user?.user?.user_type === 'patient' && (
                  <>
                    <Link to="/doctors" className={navButtonClasses}>
                      <FiSearch /> Find Doctors
                    </Link>
                    <Link to="/ai-chatbot" className={navButtonClasses}>
                      🤖 AI Chatbot
                    </Link>
                  </>
                )}
                <Link to="/appointments" className={navButtonClasses}>
                  <FiCalendar /> Appointments
                </Link>
                {user?.user?.user_type === 'admin' && (
                  <Link to="/admin" className={navButtonClasses}>
                    <FiShield /> Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={navButtonClasses}>Login</Link>
                <Link to="/register" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Create account
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden border-t border-gray-100 bg-white/80 backdrop-blur"
          >
            <div className="px-4 py-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 text-gray-700">
                    <FiUser />
                    <span>{user?.user?.first_name || user?.user?.username}</span>
                  </div>
                  {user?.user?.user_type === 'patient' && (
                    <>
                      <Link to="/doctors" className="block px-2 py-2 rounded hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                        <div className="inline-flex items-center gap-2"><FiSearch /> Find Doctors</div>
                      </Link>
                      <Link to="/ai-chatbot" className="block px-2 py-2 rounded hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                        <div className="inline-flex items-center gap-2">🤖 AI Chatbot</div>
                      </Link>
                    </>
                  )}
                  <Link to="/appointments" className="block px-2 py-2 rounded hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                    <div className="inline-flex items-center gap-2"><FiCalendar /> Appointments</div>
                  </Link>
                  {user?.user?.user_type === 'admin' && (
                    <Link to="/admin" className="block px-2 py-2 rounded hover:bg-gray-50" onClick={() => setMobileOpen(false)}>
                      <div className="inline-flex items-center gap-2"><FiShield /> Admin Panel</div>
                    </Link>
                  )}
                  <button onClick={() => { setMobileOpen(false); handleLogout(); }} className="w-full mt-1 inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                    <FiLogOut /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-2 py-2 rounded hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/register" className="block px-2 py-2 rounded bg-primary-600 text-white text-center hover:bg-primary-700" onClick={() => setMobileOpen(false)}>
                    Create account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

