
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { ArrowLeft, Home, Search, Menu, X, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export default function TournamentNavigationBar({ title }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="tournament-nav w-full py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-1">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-full" aria-label="Go Back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-full hidden sm:flex" aria-label="Home">
              <Home className="w-5 h-5" />
            </Button>
          </div>

          {/* Center Brand & Title */}
          <div className="flex flex-col items-center justify-center flex-shrink-0 flex-[2] truncate">
            <div className="flex items-center gap-1.5 opacity-80 mb-0.5">
              <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center text-primary-foreground font-black text-[9px]">N</div>
              <span className="font-black text-[10px] tracking-widest uppercase">NICD PRODUCTIONS</span>
            </div>
            <h1 className="font-bold text-base md:text-xl truncate max-w-[200px] sm:max-w-md">{title || "Tournament Details"}</h1>
          </div>

          {/* Right Actions */}
          <div className="flex items-center justify-end gap-2 md:gap-4 flex-1">
            <Button variant="ghost" size="icon" onClick={() => navigate('/tournaments')} className="hover:bg-white/10 text-muted-foreground hover:text-foreground rounded-full hidden sm:flex" aria-label="Search Tournaments">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-white/10 text-foreground md:hidden rounded-full" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center space-y-8 animate-in fade-in zoom-in duration-200">
          <Button variant="ghost" size="icon" className="absolute top-6 right-6 rounded-full w-12 h-12" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </Button>
          
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-3xl shadow-[0_0_30px_rgba(0,255,65,0.4)] mb-4">N</div>
          
          <nav className="flex flex-col items-center gap-6 text-xl font-bold">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors flex items-center gap-3"><Home className="w-6 h-6"/> Home Page</Link>
            <Link to="/tournaments" onClick={() => setMobileMenuOpen(false)} className="hover:text-primary transition-colors flex items-center gap-3"><Trophy className="w-6 h-6"/> Browse Tournaments</Link>
          </nav>
        </div>
      )}
    </>
  );
}
