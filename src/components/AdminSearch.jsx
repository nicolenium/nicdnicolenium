
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, User, Trophy, Gamepad2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

export default function AdminSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState({ users: [], tournaments: [], matches: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && !inputRef.current?.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced Search
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults({ users: [], tournaments: [], matches: [] });
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const [usersRes, tourneyRes, matchRes] = await Promise.all([
          pb.collection('users').getList(1, 3, { filter: `username ~ "${query}" || email ~ "${query}"`, $autoCancel: false }),
          pb.collection('tournaments').getList(1, 3, { filter: `name ~ "${query}"`, $autoCancel: false }),
          pb.collection('game_sessions').getList(1, 3, { filter: `id ~ "${query}"`, $autoCancel: false })
        ]);
        
        setResults({
          users: usersRes.items,
          tournaments: tourneyRes.items,
          matches: matchRes.items
        });
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  const handleNavigate = (path) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  const hasResults = results.users.length > 0 || results.tournaments.length > 0 || results.matches.length > 0;

  return (
    <div className="relative w-full max-w-xs xl:max-w-sm hidden md:block">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          className="w-full h-9 pl-9 pr-12 bg-muted/50 border border-transparent focus:bg-card focus:border-border text-sm rounded-lg outline-none transition-all placeholder:text-muted-foreground text-foreground font-medium shadow-sm"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
        />
        <div className="absolute right-3 flex items-center pointer-events-none">
          <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-2 bg-card border border-border shadow-2xl rounded-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          {loading ? (
            <div className="flex items-center justify-center p-6 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-sm font-medium">Searching...</span>
            </div>
          ) : !hasResults ? (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Search className="w-8 h-8 mb-3 opacity-20" />
              <p className="text-sm font-bold text-foreground">No results found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto py-2">
              {results.users.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30">Users</div>
                  {results.users.map(user => (
                    <button key={user.id} onClick={() => handleNavigate('/admin/users')} className="w-full text-left px-4 py-2 hover:bg-muted/50 flex items-center gap-3 transition-colors">
                      <div className="w-8 h-8 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate text-foreground">{user.username}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {results.tournaments.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30">Tournaments</div>
                  {results.tournaments.map(t => (
                    <button key={t.id} onClick={() => handleNavigate('/admin/tournaments')} className="w-full text-left px-4 py-2 hover:bg-muted/50 flex items-center gap-3 transition-colors">
                      <div className="w-8 h-8 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{t.status}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {results.matches.length > 0 && (
                <div className="mb-1">
                  <div className="px-3 py-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30">Matches</div>
                  {results.matches.map(m => (
                    <button key={m.id} onClick={() => handleNavigate('/admin/matches')} className="w-full text-left px-4 py-2 hover:bg-muted/50 flex items-center gap-3 transition-colors">
                      <div className="w-8 h-8 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                        <Gamepad2 className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate text-foreground capitalize">{m.gameType || 'Match'}</p>
                        <p className="text-xs text-muted-foreground truncate">ID: {m.id}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="bg-muted p-2 text-center border-t border-border">
            <span className="text-[10px] font-medium text-muted-foreground">Press Esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
