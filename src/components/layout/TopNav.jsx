import React from 'react';
import { useAuth } from '../../AuthProvider';
import { useNavigate } from 'react-router-dom';

const ADMIN_PRINCIPAL = process.env.ADMIN_PRINCIPAL || "2vxsx-fae";

const TopNav = () => {
  const { identity } = useAuth();
  const navigate = useNavigate();
  
  const isAdmin = identity && 
    identity.getPrincipal().toString().toLowerCase() === ADMIN_PRINCIPAL.toLowerCase();
  
  if (!isAdmin) return null;
  
  return (
    <div className="fixed top-0 right-0 m-4 z-50">
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">Admin Mode</span>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors shadow-lg"
        >
          Dashboard
        </button>
        <button
          onClick={() => navigate('/app')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors shadow-lg"
        >
          Back to App
        </button>
      </div>
    </div>
  );
};

export default TopNav;