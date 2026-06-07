
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { ArrowRight, Loader2, Lock, Mail, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get return URL from query params or default to /my-tournaments
  const queryParams = new URLSearchParams(location.search);
  const returnTo = queryParams.get('returnTo') || '/tournaments';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(returnTo, { replace: true });
    } catch (err) {
      console.error(err);
      if (err.status === 403) {
        setError('Access forbidden. Your account may be suspended or lacks required permissions.');
      } else if (err.status === 400 || err.status === 401 || err.status === 404) {
        setError('Invalid email or password. Please try again.');
      } else if (!err.status || err.status === 0) {
        setError('Network error. Cannot reach the server. Please check your connection.');
      } else {
        setError(`Authentication failed: ${err.message || 'An unexpected error occurred.'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Helmet><title>Log In | NICD Productions</title></Helmet>
      
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-xl p-8 relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

        <div className="text-center mb-8 relative z-10">
          <div className="w-14 h-14 bg-primary mx-auto rounded-xl flex items-center justify-center text-primary-foreground font-black text-3xl shadow-[0_0_20px_rgba(0,255,65,0.3)] mb-4">
            N
          </div>
          <h1 className="text-3xl font-black tracking-tight">Welcome Back</h1>
          <p className="text-muted-foreground mt-2 font-medium">Log in to access your profile and matches</p>
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl mb-6 flex flex-col gap-2 relative z-10">
            <div className="flex items-start gap-2 font-medium">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground" htmlFor="email">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input 
                id="email"
                type="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                placeholder="player@example.com"
                className="pl-10 bg-background text-foreground h-12 border-border focus-visible:ring-primary rounded-xl"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-muted-foreground" htmlFor="password">Password</label>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Password reset instructions sent (Demo).'); }} className="text-xs font-bold text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input 
                id="password"
                type="password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••••••"
                className="pl-10 bg-background text-foreground h-12 border-border focus-visible:ring-primary rounded-xl"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1 pb-2">
            <Checkbox id="remember" className="rounded-md" />
            <label htmlFor="remember" className="text-sm font-medium leading-none text-muted-foreground cursor-pointer select-none">
              Remember me for 30 days
            </label>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 font-bold text-base shadow-[0_0_15px_rgba(0,255,65,0.2)] rounded-xl transition-all active:scale-[0.98]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <span className="flex items-center">Secure Login <ArrowRight className="w-4 h-4 ml-2" /></span>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm relative z-10 border-t border-border pt-6">
          <span className="text-muted-foreground">Don't have an account yet?</span>{' '}
          <Link to={`/signup?returnTo=${encodeURIComponent(returnTo)}`} className="font-bold text-foreground hover:text-primary transition-colors hover:underline">
            Create an account
          </Link>
        </div>
        
        <div className="mt-4 text-center text-xs relative z-10">
          <Link to="/admin/login" className="font-bold text-muted-foreground hover:text-primary transition-colors">
            Are you an admin? Login here
          </Link>
        </div>
      </div>
    </div>
  );
}
