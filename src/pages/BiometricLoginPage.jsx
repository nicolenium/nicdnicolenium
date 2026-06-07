
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Loader2, AlertCircle, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';

const BiometricLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Fallback to standard login if needed
  const [email, setEmail] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if WebAuthn is supported
    if (!window.PublicKeyCredential) {
      setIsSupported(false);
      setError('Biometric authentication is not supported on this device or browser.');
    }
  }, []);

  const handleBiometricLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email first to locate your biometric profile.');
      return;
    }

    setIsAuthenticating(true);
    setError('');

    try {
      // Simulate WebAuthn challenge fetch from backend
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Call WebAuthn API
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          rpId: window.location.hostname,
          userVerification: "preferred",
          timeout: 60000,
        }
      });

      if (credential) {
        // In a real app, send credential to backend for verification
        // Here we simulate success and log them in (mocking standard login for demo)
        toast.success('Biometric verification successful!');
        // Mock login (requires actual password in this mock environment, so we just redirect if it was a real backend)
        // For this frontend-only demo, we'll just show success.
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Biometric auth failed:', err);
      setError(err.message || 'Biometric authentication failed or was canceled.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Biometric Login | NICD PRODUCTIONS</title>
      </Helmet>
      
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <Card className="w-full max-w-md border-border shadow-xl rounded-2xl overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-primary via-accent to-secondary"></div>
          <CardHeader className="space-y-2 text-center pt-8 pb-6">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-glow-cyan">
              <Fingerprint className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight">Fast & Secure</CardTitle>
            <CardDescription className="text-base">
              Use your device's fingerprint or face recognition to sign in instantly.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!isSupported ? (
              <div className="bg-destructive/10 text-destructive p-4 rounded-xl flex items-start gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            ) : (
              <form onSubmit={handleBiometricLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-muted-foreground font-semibold uppercase tracking-wider text-xs">Account Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="player@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 bg-muted/50 border-border focus-visible:ring-primary"
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive font-medium text-center">{error}</p>
                )}

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground interactive-scale shadow-md"
                  disabled={isAuthenticating || !email}
                >
                  {isAuthenticating ? (
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  ) : (
                    <Fingerprint className="w-6 h-6 mr-2" />
                  )}
                  {isAuthenticating ? 'Verifying...' : 'Scan to Login'}
                </Button>
              </form>
            )}

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground font-bold tracking-wider">Or</span>
              </div>
            </div>

            <Button asChild variant="outline" className="w-full h-12 font-bold border-border hover:bg-muted interactive-scale">
              <Link to="/login"><KeyRound className="w-4 h-4 mr-2" /> Use Password Instead</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default BiometricLoginPage;
