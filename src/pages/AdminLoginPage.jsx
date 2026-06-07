
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Shield, Loader2, AlertTriangle, KeyRound, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminLogin } = useAdminAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default redirect path or return to where they came from
  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form Validation
    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await adminLogin(email, password);
      toast.success('Admin authentication successful');
      setEmail('');
      setPassword('');
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failure:", err);
      if (err.status === 403) {
        setError('Access forbidden. Your admin account may be suspended or lacks required permissions.');
      } else if (err.status === 400 || err.status === 401 || err.status === 404) {
        setError('Invalid admin credentials. Please try again.');
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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4 relative overflow-hidden">
      <Helmet><title>Admin Login | NICD Productions</title></Helmet>

      {/* Subtle background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Card className="w-full max-w-md border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl relative z-10 rounded-2xl">
        <CardHeader className="text-center space-y-4 pt-10">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner border border-primary/20">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-black tracking-tight text-slate-50">Admin Portal</CardTitle>
            <CardDescription className="text-slate-400 font-medium">Secure access for platform administrators</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-xl flex flex-col gap-2 shadow-sm animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-start gap-2 font-medium">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
                {error.includes("credentials") && (
                  <p className="text-xs opacity-90 pl-6">
                    Tip: Verify your email and password. Passwords are case-sensitive.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="admin-email">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                <Input 
                  id="admin-email"
                  type="email" 
                  value={email} 
                  onChange={handleInputChange(setEmail)} 
                  required 
                  placeholder="admin@example.com"
                  className="pl-10 h-12 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-primary rounded-xl" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider" htmlFor="admin-password">Admin Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
                <Input 
                  id="admin-password"
                  type="password" 
                  value={password} 
                  onChange={handleInputChange(setPassword)} 
                  required 
                  placeholder="••••••••"
                  className="pl-10 h-12 bg-slate-900 border-slate-800 text-slate-100 placeholder:text-slate-600 focus-visible:ring-primary rounded-xl" 
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 font-bold bg-primary hover:bg-primary/90 text-primary-foreground text-base rounded-xl shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] transition-all active:scale-[0.98] mt-4" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                'Secure Authentication'
              )}
            </Button>
          </form>

          {/* Recovery / Public Links */}
          <div className="mt-8 flex flex-col items-center justify-center space-y-4 border-t border-white/10 pt-6">
            <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-primary transition-colors">
              Return to Player Login
            </Link>
            <button 
              type="button" 
              className="text-sm font-medium text-slate-400 hover:text-primary transition-colors flex items-center gap-1.5"
              onClick={() => toast.info('Please contact the super administrator to reset your password.')}
            >
              <KeyRound className="w-4 h-4" />
              Forgot your admin password?
            </button>
            <p className="text-xs text-slate-500 text-center max-w-[280px]">
              Access to this portal is strictly monitored. Unauthorized attempts will be logged.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
