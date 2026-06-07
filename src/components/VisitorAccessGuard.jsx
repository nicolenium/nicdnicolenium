
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { VisitorAccessManager } from '@/utils/VisitorAccessManager.js';
import { VisitorPlayCounter, VisitorRegistrationModal } from '@/components/VisitorPlayCounter.jsx';
import { useNavigate } from 'react-router-dom';

export default function VisitorAccessGuard({ children, gameId }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [remainingPlays, setRemainingPlays] = useState(2);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && gameId) {
      const plays = VisitorAccessManager.getRemainingPlays(gameId);
      setRemainingPlays(plays);
      
      if (plays <= 0) {
        setShowLimitModal(true);
      } else {
        // Increment play on mount if they have plays left
        VisitorAccessManager.incrementPlay(gameId);
        setRemainingPlays(VisitorAccessManager.getRemainingPlays(gameId));
      }
    }
  }, [gameId, isAuthenticated]);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="relative flex flex-col h-full w-full">
        {/* Floating Play Counter */}
        {gameId && remainingPlays > 0 && (
          <div className="absolute top-4 right-4 z-50 pointer-events-auto">
            <VisitorPlayCounter remainingPlays={remainingPlays} gameId={gameId} />
          </div>
        )}
        
        {/* Only render game if they have plays left or we haven't checked yet */}
        {(remainingPlays > 0 || !showLimitModal) ? children : null}
      </div>

      <VisitorRegistrationModal 
        isOpen={showLimitModal} 
        onClose={() => navigate('/games-hub')} 
      />
    </>
  );
}
