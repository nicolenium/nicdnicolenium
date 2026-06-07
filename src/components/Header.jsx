
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Menu, X, Gamepad2, User, Trophy, Volume2, VolumeX, ChevronDown, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu.jsx';
import LanguageSwitcher from '@/components/LanguageSwitcher.jsx';
import LocationButton from '@/components/LocationButton.jsx';
import BackButton from '@/components/BackButton.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useSoundEffects } from '@/utils/soundManager.js';
import pb from '@/lib/pocketbaseClient.js';
import { ALL_GAMES } from '@/config/gamePosterConfig.js';

export default function Header() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isMuted, toggleMute } = useSoundEffects();

  const isValidUser = isAuthenticated && !!currentUser?.id;

  const boardGames = ALL_GAMES.filter(g => g.category === 'Board Games');
  const eduGames = ALL_GAMES.filter(g => g.category === 'Educational Games');
  const quizGames = ALL_GAMES.filter(g => g.category === 'Quiz Games');

  const handleNavigation = (path) => {
    setMobileMenuOpen(false);
    if (location.pathname === path) return;
    
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 150);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  function HomeIcon(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
  }

  const renderDropdownItems = (games) => {
    return games.map(game => {
      const Icon = game.icon;
      return (
        <DropdownMenuItem key={game.id} onClick={() => handleNavigation(game.path)} className="cursor-pointer font-bold flex items-center gap-3 py-2 px-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="w-4 h-4" />
          </div>
          {game.name}
        </DropdownMenuItem>
      );
    });
  };

  return (
    <>
      {isNavigating && (
        <div className="fixed top-0 left-0 w-full h-1 bg-primary/20 z-[100]">
          <div className="h-full bg-primary animate-pulse w-1/3" />
        </div>
      )}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            <div className="flex items-center gap-4">
              <BackButton className="hidden md:flex text-muted-foreground hover:text-primary" />
              <button onClick={() => handleNavigation('/')} className="flex items-center gap-3 group outline-none">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow-primary transition-all duration-300 group-hover:scale-105 shrink-0">
                  <span className="font-black text-primary-foreground text-xl tracking-tighter">N</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-black text-lg md:text-xl tracking-tight text-primary hidden sm:block uppercase leading-none mb-1">NICD NICOLENIUM</span>
                </div>
              </button>
            </div>

            <nav className="hidden lg:flex items-center space-x-1">
              <button onClick={() => handleNavigation('/')} className={`px-3 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${location.pathname === '/' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}>
                <HomeIcon className="w-4 h-4" /> {t('menu.home')}
              </button>
              
              <button onClick={() => handleNavigation('/games-hub')} className={`px-3 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${location.pathname === '/games-hub' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}>
                <Gamepad2 className="w-4 h-4" /> {t('menu.games')}
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="px-3 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 text-muted-foreground hover:bg-muted hover:text-primary outline-none">
                    {t('menu.categories')} <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 p-2 bg-card border-2" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-black text-xs uppercase text-muted-foreground tracking-widest">Board Games</DropdownMenuLabel>
                    {renderDropdownItems(boardGames)}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-black text-xs uppercase text-muted-foreground tracking-widest">Educational Games</DropdownMenuLabel>
                    {renderDropdownItems(eduGames)}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-black text-xs uppercase text-muted-foreground tracking-widest">Quiz & Puzzle</DropdownMenuLabel>
                    {renderDropdownItems(quizGames)}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <button onClick={() => handleNavigation('/tournaments')} className={`px-3 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${location.pathname.startsWith('/tournaments') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}>
                <Trophy className="w-4 h-4" /> {t('menu.tournaments')}
              </button>

              <button onClick={() => handleNavigation('/educational-library')} className={`px-3 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${location.pathname.startsWith('/educational-library') ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-primary'}`}>
                <BookOpen className="w-4 h-4" /> {t('menu.library')}
              </button>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <LocationButton />
              <Button variant="ghost" size="icon" onClick={toggleMute} className="text-muted-foreground hover:text-primary" aria-label="Toggle Sound">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              
              <LanguageSwitcher />
              
              {isValidUser ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none" aria-label="Profile">
                      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-primary font-bold overflow-hidden border-2 border-primary/50">
                        {currentUser?.avatar ? (
                          <img src={pb.files.getUrl(currentUser, currentUser.avatar)} alt={currentUser?.username || "Avatar"} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 bg-card border-2">
                    <DropdownMenuLabel className="font-bold">{currentUser.username || currentUser.name || 'Player'}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigation('/profile')} className="font-bold cursor-pointer py-3"><User className="w-4 h-4 mr-2"/> {t('menu.profile')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('/leaderboard')} className="font-bold cursor-pointer py-3"><Trophy className="w-4 h-4 mr-2"/> {t('menu.leaderboard')}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="font-bold cursor-pointer text-destructive focus:text-destructive py-3">{t('menu.logout')}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleNavigation('/login')} className="font-bold text-foreground hover:text-primary">
                    {t('menu.login')}
                  </Button>
                  <Button size="sm" onClick={() => handleNavigation('/signup')} className="font-bold rounded-full bg-primary text-primary-foreground shadow-glow-primary">
                    {t('menu.signup')}
                  </Button>
                </div>
              )}
            </div>

            <div className="flex lg:hidden items-center gap-3">
              <BackButton className="flex md:hidden text-muted-foreground" size="icon" />
              <LanguageSwitcher variant="icon" />
              <Button variant="ghost" size="icon" className="text-primary hover:bg-muted" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-3xl absolute w-full shadow-2xl animate-in slide-in-from-top-4 max-h-[85vh] overflow-y-auto pb-6">
            <div className="px-4 py-6 space-y-2">
              <button onClick={() => handleNavigation('/')} className="w-full px-5 py-3 rounded-xl font-bold flex items-center gap-4 text-foreground hover:bg-muted text-left"><HomeIcon className="w-5 h-5" /> {t('menu.home')}</button>
              <button onClick={() => handleNavigation('/games-hub')} className="w-full px-5 py-3 rounded-xl font-bold flex items-center gap-4 text-foreground hover:bg-muted text-left"><Gamepad2 className="w-5 h-5" /> {t('menu.games')}</button>
              <button onClick={() => handleNavigation('/tournaments')} className="w-full px-5 py-3 rounded-xl font-bold flex items-center gap-4 text-foreground hover:bg-muted text-left"><Trophy className="w-5 h-5" /> {t('menu.tournaments')}</button>
              <button onClick={() => handleNavigation('/educational-library')} className="w-full px-5 py-3 rounded-xl font-bold flex items-center gap-4 text-foreground hover:bg-muted text-left"><BookOpen className="w-5 h-5" /> {t('menu.library')}</button>
              
              <div className="pt-6 border-t border-border mt-6">
                {isValidUser ? (
                  <div className="space-y-4">
                    <button onClick={() => handleNavigation('/profile')} className="w-full flex items-center gap-4 px-5 py-3 rounded-xl hover:bg-muted font-bold text-foreground text-left">
                      <User className="w-5 h-5 text-primary" /> {t('menu.profile')}
                    </button>
                    <Button variant="destructive" className="w-full h-12 text-base font-bold" onClick={handleLogout}>{t('menu.logout')}</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full h-12 text-base font-bold border-2" onClick={() => handleNavigation('/login')}>
                      {t('menu.login')}
                    </Button>
                    <Button className="w-full h-12 text-base font-bold bg-primary text-primary-foreground shadow-glow-primary" onClick={() => handleNavigation('/signup')}>
                      {t('menu.signup')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
