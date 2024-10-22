import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">Dashboard</Link>
          <nav className="hidden md:flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600">الرئيسية</Link>
            <Link to="/projects" className="text-gray-600 hover:text-blue-600">المشاريع</Link>
            {user ? (
              <>
                <Link to={user.role === 'creator' ? '/creator-dashboard' : '/company-dashboard'} className="text-gray-600 hover:text-blue-600">لوحة التحكم</Link>
                <button onClick={logout} className="text-gray-600 hover:text-blue-600">تسجيل الخروج</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-blue-600">تسجيل الدخول</Link>
                <Link to="/register" className="text-gray-600 hover:text-blue-600">التسجيل</Link>
              </>
            )}
          </nav>
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <Link to="/" className="block py-2 text-gray-600 hover:text-blue-600">الرئيسية</Link>
            <Link to="/projects" className="block py-2 text-gray-600 hover:text-blue-600">المشاريع</Link>
            {user ? (
              <>
                <Link to={user.role === 'creator' ? '/creator-dashboard' : '/company-dashboard'} className="block py-2 text-gray-600 hover:text-blue-600">لوحة التحكم</Link>
                <button onClick={logout} className="block w-full text-right py-2 text-gray-600 hover:text-blue-600">تسجيل الخروج</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 text-gray-600 hover:text-blue-600">تسجيل الدخول</Link>
                <Link to="/register" className="block py-2 text-gray-600 hover:text-blue-600">التسجيل</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;