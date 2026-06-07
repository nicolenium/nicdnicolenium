
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, Trophy, Gamepad2, Award, ShieldCheck, FileImage as ImageIcon, LineChart, Settings, Menu, X, Search } from 'lucide-react';
import AdminProfileMenu from '@/components/AdminProfileMenu.jsx';
import AdminNotifications from '@/components/AdminNotifications.jsx';
import AdminSearch from '@/components/AdminSearch.jsx';
import { Button } from '@/components/ui/button.jsx';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';

export default function AdminMenuBar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { adminUser } = useAdminAuth();

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/tournaments', label: 'Tournaments', icon: Trophy },
    { to: '/admin/matches', label: 'Matches', icon: Gamepad2 },
    { to: '/admin/results', label: 'Results', icon: Award },
    { to: '/admin/leaderboard', label: 'Leaderboard', icon: LineChart },
    { to: '/admin/sponsorship', label: 'Sponsorship', icon: ShieldCheck },
    { to: '/admin/media', label: 'Media', icon: ImageIcon },
    { to: '/admin/reports', label: 'Reports', icon: LineChart },
  ];

  const isLinkActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  if (!adminUser) return null; // Wait for context to load to avoid unauthenticated renders

  return (
    <header className="sticky top-0 z-50 w-full bg-[hsl(var(--admin-menubar-bg,222,47%,10%))] border-b border-[hsl(var(--admin-menubar-border,217,32%,20%))] shadow-sm backdrop-blur-md">
      <div className="flex h-16 items-center px-4 lg:px-6 w-full justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 shrink-0 mr-6">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,255,65,0.3)]">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-black text-sm leading-tight tracking-tight text-white">NICD ADMIN</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Portal</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar mx-4">
          {navLinks.map((link) => {
            const active = isLinkActive(link.to, link.exact);
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}
              >
                <link.icon className={`w-4 h-4 mr-2 ${active ? 'text-primary' : 'opacity-70'}`} />
                {link.label}
              </NavLink>
            );
          })}
          <NavLink
            to="/admin/settings"
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ml-auto ${isLinkActive('/admin/settings') ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}`}
          >
            <Settings className={`w-4 h-4 mr-2 ${isLinkActive('/admin/settings') ? 'text-primary' : 'opacity-70'}`} />
            Settings
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 lg:gap-4 shrink-0">
          <AdminSearch />
          <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
            <Search className="w-5 h-5" />
          </Button>
          <AdminNotifications />
          <div className="h-6 w-px bg-border hidden sm:block mx-1"></div>
          <AdminProfileMenu />
          
          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-muted-foreground ml-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-slate-950 border-b border-slate-800 shadow-xl z-40 max-h-[calc(100vh-4rem)] overflow-y-auto animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link.to, link.exact);
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                    active 
                      ? 'bg-primary/10 text-primary' 
                      : 'text-muted-foreground hover:bg-slate-800 hover:text-slate-100'
                  }`}
                >
                  <link.icon className={`w-5 h-5 mr-3 ${active ? 'text-primary' : 'opacity-70'}`} />
                  {link.label}
                </NavLink>
              );
            })}
            <div className="my-2 border-t border-slate-800"></div>
            <NavLink
              to="/admin/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${
                isLinkActive('/admin/settings') 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Settings className={`w-5 h-5 mr-3 ${isLinkActive('/admin/settings') ? 'text-primary' : 'opacity-70'}`} />
              Settings
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
