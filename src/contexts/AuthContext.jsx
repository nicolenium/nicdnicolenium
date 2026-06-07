
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  
  const [currentUser, setCurrentUser] = useState(() => {
    // Only initialize with user if the model has a valid ID
    return pb.authStore.isValid && pb.authStore.model?.collectionName === 'users' && pb.authStore.model?.id
      ? pb.authStore.model
      : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return pb.authStore.isValid && pb.authStore.model?.collectionName === 'users' && !!pb.authStore.model?.id;
  });
  
  const [loading, setLoading] = useState(true);

  const performLogout = useCallback((silent = false, forceRedirect = false) => {
    console.log("AuthContext: Performing logout and clearing state.");
    if (pb.authStore.model?.collectionName === 'users') {
      pb.authStore.clear();
    }
    // Hard clear to prevent corrupted cache
    localStorage.removeItem('pocketbase_auth'); 
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    if (!silent) {
      toast.success('Logged out successfully');
    }
    
    if (forceRedirect) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log("AuthContext: Initializing auth state...");
        
        // Prevent auto-login with invalid/missing user IDs
        if (!pb.authStore.isValid || !pb.authStore.model?.id || pb.authStore.model?.collectionName !== 'users') {
          console.log("AuthContext: No valid local session found.");
          setCurrentUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // Attempt to refresh the token. Throws 404 if user was deleted or is invalid
        const authData = await pb.collection('users').authRefresh({ $autoCancel: false });
        
        if (authData?.record?.id) {
          console.log("AuthContext: Session successfully refreshed.");
          setCurrentUser(authData.record);
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid record returned on refresh");
        }
      } catch (err) {
        console.error("AuthContext: Session validation failed:", err.message || err);
        
        if (err.status === 404) {
          console.warn("AuthContext: User record returned 404. Invalidating session immediately.");
          toast.error("Your account is no longer available. Please log in again.");
          performLogout(true, true);
        } else {
          // Always fail gracefully to unauthenticated state on any initialization error
          performLogout(true);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen to changes in auth state from other tabs or hooks
    const unsubscribe = pb.authStore.onChange((token, model) => {
      console.log("AuthContext: Auth store changed event triggered.");
      if (model?.collectionName === 'users' && model?.id) {
        setCurrentUser(model);
        setIsAuthenticated(!!model && !!token);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    }, true);

    // Listen for global 404 events emitted by our App.jsx interceptor
    const handleGlobal404 = () => {
      console.warn("AuthContext: Caught global 404 event. Logging out.");
      toast.error("Your account is no longer available. Please log in again.");
      performLogout(true, true);
    };
    window.addEventListener('auth-logout-forced', handleGlobal404);

    return () => {
      unsubscribe();
      window.removeEventListener('auth-logout-forced', handleGlobal404);
    };
  }, [performLogout]);

  const login = async (email, password) => {
    try {
      console.log("AuthContext: Attempting login...");
      pb.authStore.clear(); // Clear any stale session first
      
      const authData = await pb.collection('users').authWithPassword(email, password, { 
        $autoCancel: false 
      });
      
      if (!authData?.record?.id) {
        throw new Error("Login failed: Invalid user record returned.");
      }
      
      return authData;
    } catch (error) {
      console.error("AuthContext: Login error:", error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      console.log("AuthContext: Attempting signup...");
      await pb.collection('users').create({
        ...userData,
        passwordConfirm: userData.password,
        onboardingCompleted: false // Explicitly set to false on signup
      }, { $autoCancel: false });
      
      // Auto-login after successful creation
      return await login(userData.email, userData.password);
    } catch (error) {
      console.error("AuthContext: Signup error:", error);
      throw error;
    }
  };

  const validateUserExists = async (userId) => {
    try {
      await pb.collection('users').getOne(userId, { $autoCancel: false });
      return true;
    } catch (error) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  };

  const updateProfile = async (userId, data) => {
    try {
      if (!userId || userId !== currentUser?.id) {
        throw new Error("AuthContext: Cannot update. Invalid user ID or missing session.");
      }
      
      // Pre-validate that the user still exists before attempting the PATCH
      const userExists = await validateUserExists(userId);
      if (!userExists) {
        const notFoundError = new Error("User record not found");
        notFoundError.status = 404;
        throw notFoundError;
      }

      console.log("AuthContext: Updating profile for user:", userId);
      const updatedUser = await pb.collection('users').update(userId, data, { $autoCancel: false });
      
      if (updatedUser?.id) {
        setCurrentUser(updatedUser);
      }
      return updatedUser;
    } catch (error) {
      console.error("AuthContext: Profile update failed:", error);
      
      if (error.status === 404) {
        console.warn("AuthContext: User record missing on update. Forcing logout and redirect.");
        toast.error("Your account is no longer available. Please log in again.");
        performLogout(true, true);
      }
      throw error;
    }
  };

  const completeOnboarding = async () => {
    if (!currentUser?.id) return;
    try {
      await updateProfile(currentUser.id, { onboardingCompleted: true });
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      // Only show generic error if it wasn't a 404 (which is already handled by updateProfile)
      if (error.status !== 404) {
        toast.error("Failed to save onboarding status.");
      }
    }
  };

  const value = {
    currentUser,
    isAuthenticated: isAuthenticated && !!currentUser?.id,
    loading,
    login,
    signup,
    logout: () => performLogout(false, true),
    updateProfile,
    completeOnboarding,
    validateUserExists
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
