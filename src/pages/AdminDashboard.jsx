import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Helmet } from 'react-helmet';

// Simple wrapper to apply admin context and meta layout wrapper if needed
export default function AdminDashboard() {
  const { currentAdmin, isAdminAuthenticated } = useAdminAuth();

  // If we reach this page, ProtectedAdminRoute already verified auth,
  // but it's good practice to provide the context shell if needed.
  return (
    <>
      <Helmet><title>Admin Control Panel | NICD PRODUCTIONS</title></Helmet>
      {/* The AdminLayout wraps the navigation, this just provides the outlet container for nested routes */}
      <Outlet />
    </>
  );
}