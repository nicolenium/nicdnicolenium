
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const BiometricAuthContext = createContext(null);

export const BiometricAuthProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    if (!currentUser) {
      setEnrollments([]);
      setLoading(false);
      return;
    }
    try {
      const records = await pb.collection('biometric_enrollments').getFullList({
        filter: `userId = "${currentUser.id}"`,
        $autoCancel: false
      });
      setEnrollments(records);
    } catch (error) {
      console.error("Failed to fetch enrollments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, [currentUser]);

  const logAudit = async (action, type, success, details = {}) => {
    if (!currentUser) return;
    try {
      await pb.collection('biometric_audit_log').create({
        userId: currentUser.id,
        action,
        biometricType: type,
        success,
        details
      }, { $autoCancel: false });
    } catch (e) {
      console.error("Failed to log biometric audit", e);
    }
  };

  const enrollBiometric = async (type, rawData) => {
    if (!currentUser) throw new Error("Must be logged in to enroll biometrics");
    
    // Check if already enrolled
    const existing = enrollments.find(e => e.biometricType === type);
    if (existing) {
      throw new Error(`Biometric type ${type} is already enrolled.`);
    }

    try {
      // In a real app, rawData would be WebAuthn credentials or encrypted templates.
      // We simulate storing an encrypted payload.
      const mockEncryptedData = { templateHash: btoa(JSON.stringify(rawData)), version: 1 };
      
      const record = await pb.collection('biometric_enrollments').create({
        userId: currentUser.id,
        biometricType: type,
        enrollmentData: mockEncryptedData,
        isActive: true,
        verificationCount: 0,
        failureCount: 0
      }, { $autoCancel: false });

      await logAudit('enroll', type, true);
      setEnrollments(prev => [...prev, record]);
      return record;
    } catch (error) {
      await logAudit('enroll', type, false, { error: error.message });
      throw error;
    }
  };

  const verifyBiometric = async (type) => {
    if (!currentUser) throw new Error("User context required for verification step-up");
    const enrollment = enrollments.find(e => e.biometricType === type && e.isActive);
    
    if (!enrollment) {
      throw new Error("Biometric not enrolled or inactive");
    }

    try {
      // Simulate biometric scan API call...
      await new Promise(res => setTimeout(res, 1500));
      
      // Update usage stats
      await pb.collection('biometric_enrollments').update(enrollment.id, {
        verificationCount: (enrollment.verificationCount || 0) + 1,
        lastVerified: new Date().toISOString()
      }, { $autoCancel: false });

      await logAudit('verify', type, true);
      fetchEnrollments();
      return true;
    } catch (error) {
      await pb.collection('biometric_enrollments').update(enrollment.id, {
        failureCount: (enrollment.failureCount || 0) + 1
      }, { $autoCancel: false });
      
      await logAudit('verify', type, false, { error: error.message });
      throw new Error("Biometric verification failed");
    }
  };

  const disableBiometric = async (id, type) => {
    try {
      await pb.collection('biometric_enrollments').update(id, { isActive: false }, { $autoCancel: false });
      await logAudit('disable', type, true);
      fetchEnrollments();
    } catch (e) {
      await logAudit('disable', type, false);
      throw e;
    }
  };

  const deleteBiometric = async (id, type) => {
    try {
      await pb.collection('biometric_enrollments').delete(id, { $autoCancel: false });
      await logAudit('delete', type, true);
      setEnrollments(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      await logAudit('delete', type, false);
      throw e;
    }
  };

  const getBiometricStatus = (type) => {
    const e = enrollments.find(e => e.biometricType === type);
    return e ? (e.isActive ? 'active' : 'disabled') : 'un-enrolled';
  };

  return (
    <BiometricAuthContext.Provider value={{
      enrollments,
      loading,
      enrollBiometric,
      verifyBiometric,
      disableBiometric,
      deleteBiometric,
      getBiometricStatus
    }}>
      {children}
    </BiometricAuthContext.Provider>
  );
};

export const useBiometricAuth = () => useContext(BiometricAuthContext);
