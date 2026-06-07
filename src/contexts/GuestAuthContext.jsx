
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const GuestAuthContext = createContext();

export const useGuestAuth = () => {
  const context = useContext(GuestAuthContext);
  if (!context) {
    throw new Error('useGuestAuth must be used within GuestAuthProvider');
  }
  return context;
};

export const GuestAuthProvider = ({ children }) => {
  const [guestSession, setGuestSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('guest_session');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        if (new Date(session.guestSessionExpiry) > new Date()) {
          setGuestSession(session);
        } else {
          localStorage.removeItem('guest_session');
        }
      } catch (e) {
        localStorage.removeItem('guest_session');
      }
    }
    setLoading(false);
  }, []);

  const guestLogin = () => {
    const guestId = 'guest_' + Math.random().toString(36).substring(2, 11);
    const guestUsername = `Guest_${guestId.substring(6)}`;
    const guestSessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
    
    const session = {
      isGuest: true,
      guestId,
      guestUsername,
      guestSessionExpiry
    };

    localStorage.setItem('guest_session', JSON.stringify(session));
    setGuestSession(session);
    toast.success(`Playing as ${guestUsername}`);
    return session;
  };

  const guestLogout = () => {
    localStorage.removeItem('guest_session');
    setGuestSession(null);
  };

  const value = {
    isGuest: !!guestSession,
    guestId: guestSession?.guestId || null,
    guestUsername: guestSession?.guestUsername || null,
    guestSessionExpiry: guestSession?.guestSessionExpiry || null,
    guestLogin,
    guestLogout,
    loading
  };

  return (
    <GuestAuthContext.Provider value={value}>
      {children}
    </GuestAuthContext.Provider>
  );
};
