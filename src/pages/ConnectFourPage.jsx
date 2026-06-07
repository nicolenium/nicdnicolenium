
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { createInitialConnectFourBoard, dropPiece, checkConnectFourWin, isConnectFourDraw } from '@/utils/ConnectFourLogic.js';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const ConnectFourPage = () => {
  const [board, setBoard] = useState(createInitialConnectFourBoard());
  const [turn, setTurn] = useState('Red');
  const [status, setStatus] = useState('in-progress'); // in-progress, Red-wins, Yellow-wins, draw
  const [hoverCol, setHoverCol] = useState(null);

  const handleColumnClick = (col) => {
    if (status !== 'in-progress' || board[0][col] !== null) return;

    const { newBoard, row } = dropPiece(board, col, turn);
    if (row === -1) return;

    setBoard(newBoard);

    if (checkConnectFourWin(newBoard, row, col, turn)) {
      setStatus(`${turn}-wins`);
      toast.success(`${turn} Wins!`);
    } else if (isConnectFourDraw(newBoard)) {
      setStatus('draw');
      toast.info("Game Over: Draw");
    } else {
      setTurn(turn === 'Red' ? 'Yellow' : 'Red');
    }
  };

  const resetGame = () => {
    setBoard(createInitialConnectFourBoard());
    setTurn('Red');
    setStatus('in-progress');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Connect Four | NICD Games</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-5xl mx-auto p-4 py-12 flex flex-col items-center justify-center">
        
        <div className="w-full max-w-[600px] flex justify-between items-center mb-8 bg-card p-4 rounded-xl border shadow-sm">
          <div className={`p-2 px-6 rounded-xl font-bold uppercase tracking-wider transition-all ${turn === 'Red' && status === 'in-progress' ? 'bg-red-500 text-white shadow-lg scale-105' : 'bg-muted text-muted-foreground'}`}>Red</div>
          <div className="text-xl font-serif font-black">{status === 'in-progress' ? 'VS' : status.replace('-', ' ').toUpperCase()}</div>
          <div className={`p-2 px-6 rounded-xl font-bold uppercase tracking-wider transition-all ${turn === 'Yellow' && status === 'in-progress' ? 'bg-yellow-400 text-black shadow-lg scale-105' : 'bg-muted text-muted-foreground'}`}>Yellow</div>
        </div>

        <div className="relative w-full max-w-[700px] aspect-[7/6] bg-blue-600 border-[16px] border-blue-800 rounded-3xl p-2 shadow-2xl">
          
          {/* Hover Indicators */}
          <div className="absolute top-0 left-0 w-full h-4 -mt-8 flex justify-around px-2 z-20">
            {Array(7).fill(null).map((_, c) => (
              <div key={`hover-${c}`} className="flex-1 flex justify-center opacity-0 hover:opacity-100 transition-opacity">
                {status === 'in-progress' && board[0][c] === null && (
                  <div className={`w-8 h-8 rounded-full ${turn === 'Red' ? 'bg-red-500' : 'bg-yellow-400'} animate-bounce shadow-md`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 grid-rows-6 gap-2 sm:gap-3 h-full w-full">
            {board.map((row, r) => (
              row.map((cell, c) => (
                <div 
                  key={`${r}-${c}`} 
                  className="bg-blue-700 rounded-full cursor-pointer relative overflow-hidden shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)] flex items-center justify-center" 
                  onClick={() => handleColumnClick(c)}
                  onMouseEnter={() => setHoverCol(c)}
                  onMouseLeave={() => setHoverCol(null)}
                >
                  <div 
                    className={`w-[85%] h-[85%] rounded-full shadow-inner transition-all duration-500
                    ${cell === 'Red' ? 'bg-red-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : 
                      cell === 'Yellow' ? 'bg-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : 
                      'bg-background'}`} 
                  />
                  {status === 'in-progress' && hoverCol === c && cell === null && (
                    <div className={`absolute w-[85%] h-[85%] rounded-full opacity-30 ${turn === 'Red' ? 'bg-red-500' : 'bg-yellow-400'}`} />
                  )}
                </div>
              ))
            ))}
          </div>

          {status !== 'in-progress' && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center z-30">
              <h2 className={`text-5xl font-black font-serif mb-6 uppercase tracking-wider drop-shadow-md ${status === 'Red-wins' ? 'text-red-500' : status === 'Yellow-wins' ? 'text-yellow-400' : 'text-primary'}`}>
                {status === 'draw' ? 'Draw' : `${status.split('-')[0]} Wins!`}
              </h2>
              <Button onClick={resetGame} size="lg" className="rounded-full shadow-lg text-lg h-14 px-8">
                <RotateCcw className="w-5 h-5 mr-2" /> Play Again
              </Button>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default ConnectFourPage;
