import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Checkbox } from '@/components/ui/checkbox.jsx';
import { ArrowRight, Loader2, Lock, Mail, User, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: '', name: '', phone: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const returnTo = queryParams.get('returnTo') || '/my-tournaments';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (!agreed) {
      setError("You must agree to the Terms of Service.");
      return;
    }
    
    setLoading(true);
    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        name: formData.name,
        phone: formData.phone
      });
      toast.success('Account created successfully!');
      navigate(returnTo, { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.response?.message || 'Failed to create account. Username or email may be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container py-12">
      <Helmet><title>Sign Up | NICD Productions</title></Helmet>
      
      <div className="auth-card !max-w-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tight">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join the ultimate competitive gaming platform</p>
        </div>

        {error && (
          <div className="bg-destructive/15 border border-destructive/30 text-destructive text-sm p-3 rounded-lg mb-6 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="auth-input-group !mb-0">
              <label className="auth-label" htmlFor="username">Username <span className="text-destructive">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input 
                  id="username" name="username" required 
                  value={formData.username} onChange={handleChange}
                  placeholder="PlayerOne"
                  className="pl-10 bg-background text-foreground border-border"
                />
              </div>
            </div>
            
            <div className="auth-input-group !mb-0">
              <label className="auth-label" htmlFor="name">Full Name <span className="text-destructive">*</span></label>
              <Input 
                id="name" name="name" required 
                value={formData.name} onChange={handleChange}
                placeholder="John Doe"
                className="bg-background text-foreground border-border"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label" htmlFor="email">Email Address <span className="text-destructive">*</span></label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input 
                id="email" name="email" type="email" required 
                value={formData.email} onChange={handleChange}
                placeholder="player@example.com"
                className="pl-10 bg-background text-foreground border-border"
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label className="auth-label" htmlFor="phone">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input 
                id="phone" name="phone" type="tel"
                value={formData.phone} onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="pl-10 bg-background text-foreground border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="auth-input-group !mb-0">
              <label className="auth-label" htmlFor="password">Password <span className="text-destructive">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input 
                  id="password" name="password" type="password" required 
                  value={formData.password} onChange={handleChange}
                  placeholder="Min 8 characters"
                  className="pl-10 bg-background text-foreground border-border"
                />
              </div>
            </div>
            
            <div className="auth-input-group !mb-0">
              <label className="auth-label" htmlFor="confirmPassword">Confirm Password <span className="text-destructive">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input 
                  id="confirmPassword" name="confirmPassword" type="password" required 
                  value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Repeat password"
                  className="pl-10 bg-background text-foreground border-border"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 pt-3">
            <Checkbox id="terms" checked={agreed} onCheckedChange={setAgreed} className="mt-1" />
            <label htmlFor="terms" className="text-sm font-medium leading-relaxed text-muted-foreground cursor-pointer">
              I agree to the <a href="/terms" className="text-primary hover:underline">Terms of Service</a> and <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
            </label>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 font-bold text-base mt-4 transition-transform active:scale-[0.98]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              <span className="flex items-center">Create Account <ArrowRight className="w-4 h-4 ml-2" /></span>
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{' '}
          <Link to={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="font-bold text-foreground hover:text-primary transition-colors hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}