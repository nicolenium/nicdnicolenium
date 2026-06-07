
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { ArrowLeft, RotateCcw, Flag, History, BrainCircuit, Maximize, Minimize, Settings2, Volume2, VolumeX, MessageSquare, Share2, Users, Video, X, HelpCircle as CircleHelp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MoveHistoryPanel from '@/components/MoveHistoryPanel.jsx';
import GameAnalysisPanel from '@/components/GameAnalysisPanel.jsx';
import GameChatPanel from '@/components/GameChatPanel.jsx';
import GameSharingPanel from '@/components/ShareGamePanel.jsx';
import CommunityLivePanel from '@/components/CommunityLivePanel.jsx';
import AVCommunicationPanel from '@/components/AVCommunicationPanel.jsx';
import Breadcrumb from '@/components/Breadcrumb.jsx';
import HowToPlayModal from '@/components/HowToPlayModal.jsx';
import GameSettingsModal from '@/components/GameSettingsModal.jsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog.jsx';
import { useSoundEffects } from '@/utils/soundManager.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

export const UnifiedGameLayout = ({ 
  children, 
  title, 
  turnText, 
  history = [], 
  aiAnalysisData = {},
  onReset, 
  isOnline, 
  onUndo, 
  onResign, 
  canUndo,
  gameType = 'game'
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activePanel, setActivePanel] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showResignDialog, setShowResignDialog] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const { isMuted, volume, toggleMute } = useSoundEffects();

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      
      if (e.key === '?') setShowHelpModal(true);
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.ctrlKey && e.key === 'z' && onUndo && canUndo) onUndo();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, canUndo]);

  const togglePanel = (panel) => setActivePanel(prev => prev === panel ? null : panel);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => toast.error("Fullscreen not supported."));
    } else {
      document.exitFullscreen();
    }
  };

  const handleConfirmResign = () => {
    setShowResignDialog(false);
    if (onResign) onResign();
    setActivePanel('analysis');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-hidden relative">
      <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-bold text-lg tracking-tight hidden sm:block">{title}</h1>
        </div>
        
        <div className="flex items-center justify-center flex-1 mx-4">
          <div className="px-6 py-2 bg-primary/10 text-primary rounded-full font-bold text-sm tracking-widest uppercase shadow-sm border border-primary/20">
            {turnText}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowHelpModal(true)} title="How to Play" className="text-primary hover:bg-primary/10">
            <CircleHelp className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => setShowSettingsModal(true)} title="Settings" className="text-primary hover:bg-primary/10">
            <Settings2 className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleMute} title="Toggle Sound">
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4 text-primary" />}
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleFullscreen} title="Fullscreen" className="hidden sm:flex">
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
          
          {!isOnline && onUndo && (
            <Button variant="outline" size="sm" onClick={onUndo} disabled={!canUndo} className="hidden lg:flex gap-2 font-bold rounded-full">
              <RotateCcw className="w-4 h-4" /> Undo
            </Button>
          )}
          {onResign && (
            <Button variant="destructive" size="sm" onClick={() => setShowResignDialog(true)} className="hidden lg:flex gap-2 font-bold rounded-full">
              <Flag className="w-4 h-4" /> Resign
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 flex relative overflow-hidden">
        {/* Advanced Game Panel (Sidebar) */}
        <div className="w-16 border-r border-border bg-card/50 backdrop-blur-xl flex flex-col items-center py-6 gap-6 z-20 shrink-0 shadow-lg">
          <Button variant={activePanel === 'history' ? 'default' : 'ghost'} size="icon" onClick={() => togglePanel('history')} title="Move History" className={activePanel==='history' ? 'shadow-glow-primary rounded-xl' : 'rounded-xl'}>
            <History className="w-5 h-5" />
          </Button>
          <Button variant={activePanel === 'analysis' ? 'default' : 'ghost'} size="icon" onClick={() => togglePanel('analysis')} title="AI Analysis" className={activePanel==='analysis' ? 'shadow-glow-primary rounded-xl' : 'rounded-xl'}>
            <BrainCircuit className="w-5 h-5" />
          </Button>
          <Button variant={activePanel === 'chat' ? 'default' : 'ghost'} size="icon" onClick={() => togglePanel('chat')} title="A/C Chat" className={activePanel==='chat' ? 'shadow-glow-primary rounded-xl' : 'rounded-xl'}>
            <MessageSquare className="w-5 h-5" />
          </Button>
          
          <div className="w-8 h-px bg-border/50 my-2" />
          
          <GameSharingPanel gameId="local" gameType={gameType} />
          
          <Button variant={activePanel === 'community' ? 'default' : 'ghost'} size="icon" onClick={() => togglePanel('community')} title="Live Community" className={activePanel==='community' ? 'shadow-glow-primary rounded-xl' : 'rounded-xl text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10'}>
            <Users className="w-5 h-5" />
          </Button>
          <Button variant={activePanel === 'av' ? 'default' : 'ghost'} size="icon" onClick={() => togglePanel('av')} title="A/V Chat" className={activePanel==='av' ? 'shadow-glow-primary rounded-xl' : 'rounded-xl text-amber-500 hover:text-amber-600 hover:bg-amber-500/10'}>
            <Video className="w-5 h-5" />
          </Button>
          
          <div className="flex-1" />
          
          {onResign && (
            <Button variant="ghost" size="icon" onClick={() => setShowResignDialog(true)} className="lg:hidden text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl" title="Resign">
              <Flag className="w-5 h-5" />
            </Button>
          )}
          {onReset && (
            <Button variant="ghost" size="icon" onClick={onReset} className="text-muted-foreground hover:text-foreground rounded-xl" title="Restart Game">
              <RotateCcw className="w-5 h-5" />
            </Button>
          )}
        </div>

        <main className="flex-1 flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 overflow-y-auto relative z-10 w-full bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-background via-background to-muted/20">
          <div className="w-full max-w-7xl mx-auto mb-4">
            <Breadcrumb className="py-0" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center w-full">
            {children}
          </div>
        </main>

        {/* Dynamic Panels */}
        {activePanel === 'history' && <MoveHistoryPanel history={history} onClose={() => setActivePanel(null)} gameType={gameType} />}
        {activePanel === 'analysis' && <GameAnalysisPanel history={history} analysisData={aiAnalysisData} onClose={() => setActivePanel(null)} moveCount={history.length} />}
        {activePanel === 'chat' && <GameChatPanel currentUser={currentUser} onClose={() => setActivePanel(null)} gameSessionId={gameType} />}
        {activePanel === 'community' && <CommunityLivePanel onClose={() => setActivePanel(null)} />}
        {activePanel === 'av' && <AVCommunicationPanel onClose={() => setActivePanel(null)} />}
      </div>

      {/* Resignation Confirmation Modal */}
      <Dialog open={showResignDialog} onOpenChange={setShowResignDialog}>
        <DialogContent className="bg-card border-border sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-foreground">Confirm Resignation</DialogTitle>
            <DialogDescription className="text-base font-medium text-muted-foreground pt-3">
              Are you sure you want to abandon this match? This will be recorded as a loss in your statistics.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-3 sm:justify-between">
            <Button variant="outline" onClick={() => setShowResignDialog(false)} className="font-bold flex-1 rounded-xl">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmResign} className="font-bold flex-1 rounded-xl shadow-md">
              Yes, Resign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modals */}
      {showHelpModal && <HowToPlayModal gameName={gameType} onClose={() => setShowHelpModal(false)} />}
      <GameSettingsModal open={showSettingsModal} onOpenChange={setShowSettingsModal} />
    </div>
  );
};
