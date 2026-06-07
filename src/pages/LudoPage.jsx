
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LudoBoard from '@/components/LudoBoard.jsx';
import { createInitialLudoState, LUDO_COLORS } from '@/utils/LudoLogic.js';
import { Button } from '@/components/ui/button';
import { Dices, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const LudoPage = () => {
  const [gameState, setGameState] = useState(createInitialLudoState());
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    if (isRolling || gameState.status !== 'playing') return;
    setIsRolling(true);
    
    setTimeout(() => {
      const finalRoll = Math.floor(Math.random() * 6) + 1;
      setIsRolling(false);
      
      setGameState(prev => ({
        ...prev,
        dice: finalRoll,
        turn: finalRoll === 6 ? prev.turn : (prev.turn + 1) % 4
      }));
      
      toast.info(`${LUDO_COLORS[gameState.turn].name} rolled a ${finalRoll}!`);
    }, 600);
  };

  const handlePieceClick = (colorId, pieceIndex) => {
    if (colorId !== gameState.turn || !gameState.dice) return;
    toast.success(`Moved piece ${pieceIndex + 1}`);
    setGameState(prev => ({ ...prev, dice: null, turn: (prev.turn + 1) % 4 }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Ludo | NICOLENIUM</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-6xl mx-auto p-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-8 flex justify-center items-center">
          <div className="w-full max-w-[700px]">
            <LudoBoard gameState={gameState} onPieceClick={handlePieceClick} />
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-card border rounded-2xl p-6 shadow-md text-center">
            <h3 className="font-bold text-lg mb-6 uppercase tracking-wider text-muted-foreground">Current Turn</h3>
            
            <div 
              className="w-24 h-24 mx-auto rounded-3xl mb-6 shadow-lg border-4 flex items-center justify-center text-4xl font-black text-white transition-all duration-300"
              style={{ 
                backgroundColor: LUDO_COLORS[gameState.turn].hex,
                borderColor: 'rgba(255,255,255,0.3)',
                transform: isRolling ? 'rotate(360deg)' : 'none'
              }}
            >
              {gameState.dice || '?'}
            </div>
            
            <h4 className="text-2xl font-black mb-8" style={{ color: LUDO_COLORS[gameState.turn].hex }}>
              {LUDO_COLORS[gameState.turn].name}'s Turn
            </h4>

            <Button 
              onClick={rollDice} 
              disabled={isRolling || gameState.dice !== null}
              size="lg" 
              className="w-full h-16 text-xl rounded-xl shadow-lg"
              style={{ backgroundColor: LUDO_COLORS[gameState.turn].hex }}
            >
              <Dices className="w-6 h-6 mr-2" /> Roll Dice
            </Button>
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-md flex gap-2">
            <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setGameState(createInitialLudoState())}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset Game
            </Button>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default LudoPage;
