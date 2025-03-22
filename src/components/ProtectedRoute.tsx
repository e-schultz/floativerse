
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { session, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-float-bg">
        <p className="text-float-text">Loading...</p>
      </div>
    );
  }

  if (!session || !user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
