
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Task 2: Dynamic Admin ID Caching
  const cacheAdminId = (adminId) => {
    if (adminId) {
      localStorage.setItem('cached_admin_id', adminId);
      localStorage.setItem('cached_admin_timestamp', Date.now().toString());
    }
  };

  const getCachedAdminId = () => {
    const id = localStorage.getItem('cached_admin_id');
    const timestamp = localStorage.getItem('cached_admin_timestamp');
    // Validate cache TTL (e.g., 24 hours)
    if (id && timestamp && (Date.now() - parseInt(timestamp, 10)) < 86400000) {
      return id;
    }
    return null;
  };

  // Task 2: Dynamic Admin Retrieval Functions
  const getAdminByEmail = async (email) => {
    try {
      const records = await pb.collection('admin_users').getFullList({ 
        filter: `email="${email}"`, 
        $autoCancel: false 
      });
      return records[0] || null;
    } catch (error) {
      console.error("Failed to lookup admin by email:", error);
      return null;
    }
  };

  const getAdminByRole = async (role = 'super_admin') => {
    try {
      return await pb.collection('admin_users').getFullList({ 
        filter: `role="${role}"`, 
        $autoCancel: false 
      });
    } catch (error) {
      console.error("Failed to lookup admin by role:", error);
      return [];
    }
  };

  useEffect(() => {
    const initAdminAuth = async () => {
      try {
        if (pb.authStore.isValid && pb.authStore.model?.collectionName === 'admin_users') {
          // Attempt to refresh the token to ensure it's still valid
          const authData = await pb.collection('admin_users').authRefresh({ $autoCancel: false });
          setCurrentAdmin(authData.record);
          cacheAdminId(authData.record.id);
        } else {
          // Check if we have a valid cache and token but model dropped
          const cachedId = getCachedAdminId();
          if (cachedId && pb.authStore.token) {
            try {
              const record = await pb.collection('admin_users').getOne(cachedId, { $autoCancel: false });
              setCurrentAdmin(record);
            } catch (e) {
              setCurrentAdmin(null);
            }
          } else {
            setCurrentAdmin(null);
          }
        }
      } catch (err) {
        if (pb.authStore.model?.collectionName === 'admin_users') {
          pb.authStore.clear();
        }
        setCurrentAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    
    initAdminAuth();
    
    // Subscribe to auth store changes for multi-tab sync
    return pb.authStore.onChange((token, model) => {
      if (model?.collectionName === 'admin_users') {
        setCurrentAdmin(model);
        cacheAdminId(model.id);
      } else {
        setCurrentAdmin(null);
        localStorage.removeItem('cached_admin_id');
        localStorage.removeItem('cached_admin_timestamp');
      }
    });
  }, []);

  // Task 3 & 4: Update Login Flow to strictly use dynamic ID and caching
  const adminLogin = async (email, password) => {
    try {
      // Clear any existing session before admin login
      pb.authStore.clear();
      
      const authData = await pb.collection('admin_users').authWithPassword(email, password, { 
        $autoCancel: false 
      });
      
      // Explicitly retrieve the authenticated admin record using the dynamic ID
      const verifiedAdmin = await pb.collection('admin_users').getOne(authData.record.id, { 
        $autoCancel: false 
      });
      
      cacheAdminId(verifiedAdmin.id);
      setCurrentAdmin(verifiedAdmin);
      return authData;
    } catch (error) {
      console.error("Admin login error:", error);
      throw error;
    }
  };

  const adminLogout = () => {
    if (pb.authStore.model?.collectionName === 'admin_users') {
      pb.authStore.clear();
    }
    localStorage.removeItem('cached_admin_id');
    localStorage.removeItem('cached_admin_timestamp');
    setCurrentAdmin(null);
    toast.info('Admin securely logged out.');
  };

  return (
    <AdminAuthContext.Provider 
      value={{ 
        isAdminAuthenticated: !!currentAdmin, 
        currentAdmin,
        adminUser: currentAdmin, // Alias for compatibility across components
        adminLogin,
        loginAdmin: adminLogin, // Alias for backward compatibility
        adminLogout,
        logoutAdmin: adminLogout, // Alias for backward compatibility
        getAdminByEmail,
        getAdminByRole,
        getCachedAdminId,
        loading 
      }}
    >
      {!loading && children}
    </AdminAuthContext.Provider>
  );
};
