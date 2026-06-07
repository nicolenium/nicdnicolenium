
import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Button } from '@/components/ui/button.jsx';
import { 
  Home, Users, Trophy, Gamepad2, Settings, Shield, LogOut, X, ChevronDown, ChevronRight, Info, SlidersHorizontal, Activity, Cpu, FlaskConical, Server
} from 'lucide-react';

export default function AdminSidebar({ isMobileOpen, setIsMobileOpen }) {
  const { adminLogout, adminUser } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [gamesOpen, setGamesOpen] = useState(false);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const isLinkActive = (to, exact) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  if (!adminUser) return null;

  const navContent = (
    <>
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950 shrink-0">
        <div className="flex items-center">
          <Shield className="w-8 h-8 text-primary mr-3" />
          <div>
            <div className="font-black text-white leading-none tracking-tight text-lg">NICD</div>
            <div className="text-primary text-[10px] font-bold uppercase tracking-widest mt-1">Admin Portal</div>
          </div>
        </div>
        <button className="lg:hidden text-muted-foreground hover:text-white transition-colors" onClick={() => setIsMobileOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 bg-slate-950">
        <NavLink to="/admin/dashboard" onClick={() => setIsMobileOpen(false)} className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${isLinkActive('/admin/dashboard', true) ? 'bg-primary text-primary-foreground shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Home className="w-5 h-5 mr-3 opacity-90" /> Home
        </NavLink>
        
        <NavLink to="/admin/activity" onClick={() => setIsMobileOpen(false)} className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${isLinkActive('/admin/activity') ? 'bg-primary text-primary-foreground shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Activity className="w-5 h-5 mr-3 opacity-90" /> Live Activity
        </NavLink>

        <NavLink to="/admin/ai-debug" onClick={() => setIsMobileOpen(false)} className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${isLinkActive('/admin/ai-debug') ? 'bg-primary text-primary-foreground shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Cpu className="w-5 h-5 mr-3 opacity-90" /> AI Debug Logs
        </NavLink>

        <NavLink to="/admin/test" onClick={() => setIsMobileOpen(false)} className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${isLinkActive('/admin/test') ? 'bg-primary text-primary-foreground shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <FlaskConical className="w-5 h-5 mr-3 opacity-90" /> Game Test Suite
        </NavLink>

        <div>
          <button onClick={() => setGamesOpen(!gamesOpen)} className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 text-slate-400 hover:bg-slate-800 hover:text-white`}>
            <div className="flex items-center"><Gamepad2 className="w-5 h-5 mr-3 opacity-90" /> Games</div>
            {gamesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {gamesOpen && (
            <div className="pl-10 pr-2 py-2 space-y-1">
              <NavLink to="/admin/games" onClick={() => setIsMobileOpen(false)} className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isLinkActive('/admin/games') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}>
                Portfolio Overview
              </NavLink>
            </div>
          )}
        </div>

        <div className="my-4 border-t border-slate-800"></div>

        <NavLink to="/admin/users" onClick={() => setIsMobileOpen(false)} className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${isLinkActive('/admin/users') ? 'bg-primary text-primary-foreground shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Users className="w-5 h-5 mr-3 opacity-90" /> Users
        </NavLink>
        <NavLink to="/admin/tournaments" onClick={() => setIsMobileOpen(false)} className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${isLinkActive('/admin/tournaments') ? 'bg-primary text-primary-foreground shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Trophy className="w-5 h-5 mr-3 opacity-90" /> Tournaments
        </NavLink>
        <NavLink to="/admin/system" onClick={() => setIsMobileOpen(false)} className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${isLinkActive('/admin/system') ? 'bg-primary text-primary-foreground shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Server className="w-5 h-5 mr-3 opacity-90" /> System Status
        </NavLink>
        <NavLink to="/admin/settings" onClick={() => setIsMobileOpen(false)} className={`flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 ${isLinkActive('/admin/settings') ? 'bg-primary text-primary-foreground shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <Settings className="w-5 h-5 mr-3 opacity-90" /> Settings
        </NavLink>
      </nav>
      
      <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
        <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-400/10 hover:text-red-400 font-bold rounded-xl transition-colors">
          <LogOut className="w-5 h-5 mr-3" /> Secure Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      <div className="hidden lg:flex flex-col w-[250px] fixed inset-y-0 left-0 bg-slate-950 z-40 border-r border-slate-800 shadow-2xl">
        {navContent}
      </div>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-950 shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
