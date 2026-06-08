import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#000000',
        color: '#FFB1EE',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Geist Mono', monospace",
        fontSize: '14px'
      }}>
        LOADING_SESSION...
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
