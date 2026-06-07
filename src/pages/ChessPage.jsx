
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { initializeBoard, getValidMoves, movePiece, isWhite, getGameStatus } from '@/utils/ChessGameLogic.js';
import { Button } from '@/components/ui/button';
import { RotateCcw, Flag } from 'lucide-react';
import MoveHistoryPanel from '@/components/MoveHistoryPanel.jsx';
import { toast } from 'sonner';

const PIECE_SYMBOLS = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
};

const COLS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ROWS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const ChessPage = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [turn, setTurn] = useState('white');
  const [selected, setSelected] = useState(null);
  const [validMoves, setValidMoves] = useState([]);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('in-progress');

  const handleSquareClick = (r, c) => {
    if (status !== 'in-progress') return;

    const piece = board.board[r][c];
    const isPieceWhite = isWhite(piece);
    const turnWhite = turn === 'white';

    if (selected) {
      const move = validMoves.find(m => m.r === r && m.c === c);
      if (move) {
        const newBoard = movePiece(board, selected.r, selected.c, r, c, move);
        setBoard(newBoard);
        
        const notation = `${board.board[selected.r][selected.c]}${COLS[selected.c]}${ROWS[selected.r]}-${COLS[c]}${ROWS[r]}`;
        setHistory(prev => [...prev, { notation }]);
        
        const nextTurnWhite = !turnWhite;
        setTurn(nextTurnWhite ? 'white' : 'black');
        setSelected(null);
        setValidMoves([]);
        
        const gameStatusObj = getGameStatus(newBoard, nextTurnWhite);
        
        if (gameStatusObj.isCheckmate) {
          setStatus(nextTurnWhite ? 'black-wins' : 'white-wins');
          toast.success(`Game Over: ${nextTurnWhite ? 'Black' : 'White'} Wins by Checkmate!`);
        } else if (gameStatusObj.isStalemate) {
          setStatus('draw');
          toast.info("Game Over: Draw (Stalemate)");
        } else if (gameStatusObj.isCheck) {
          toast.warning("Check!");
        }
      } else if (piece && (turnWhite === isPieceWhite)) {
        setSelected({ r, c });
        setValidMoves(getValidMoves(board, r, c));
      } else {
        setSelected(null);
        setValidMoves([]);
      }
    } else {
      if (piece && (turnWhite === isPieceWhite)) {
        setSelected({ r, c });
        setValidMoves(getValidMoves(board, r, c));
      }
    }
  };

  const resetGame = () => {
    setBoard(initializeBoard());
    setTurn('white');
    setSelected(null);
    setValidMoves([]);
    setHistory([]);
    setStatus('in-progress');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Chess | NICOLENIUM</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto p-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6 bg-card p-4 rounded-xl border shadow-sm">
            <div className={`p-2 px-4 rounded-lg font-bold uppercase tracking-wider ${turn === 'white' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>White</div>
            <div className="text-xl font-serif font-black">{status === 'in-progress' ? 'VS' : status.replace('-', ' ').toUpperCase()}</div>
            <div className={`p-2 px-4 rounded-lg font-bold uppercase tracking-wider ${turn === 'black' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'}`}>Black</div>
          </div>

          <div className="relative w-full max-w-[600px] aspect-square border-8 border-secondary rounded-xl overflow-hidden shadow-2xl">
            <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
              {board.board.map((row, r) => row.map((piece, c) => {
                const isLight = (r + c) % 2 === 0;
                const isSelected = selected?.r === r && selected?.c === c;
                const isValid = validMoves.some(m => m.r === r && m.c === c);
                
                return (
                  <div 
                    key={`${r}-${c}`}
                    onClick={() => handleSquareClick(r, c)}
                    className={`
                      relative flex items-center justify-center text-4xl sm:text-5xl md:text-6xl cursor-pointer select-none transition-colors duration-200
                      ${isLight ? 'bg-amber-200' : 'bg-amber-800'}
                      ${isSelected ? 'bg-yellow-400 ring-inset ring-4 ring-white/30' : ''}
                    `}
                  >
                    {isValid && (
                      <div className="absolute w-1/3 h-1/3 bg-black/20 rounded-full opacity-60 z-10 animate-pulse" />
                    )}
                    <span className={`z-20 drop-shadow-md ${isWhite(piece) ? 'text-white' : 'text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]'}`}>
                      {piece ? PIECE_SYMBOLS[piece] : ''}
                    </span>
                    
                    {c === 0 && <span className="absolute top-1 left-1 text-[10px] font-bold text-foreground/50">{ROWS[r]}</span>}
                    {r === 7 && <span className="absolute bottom-0 right-1 text-[10px] font-bold text-foreground/50">{COLS[c]}</span>}
                  </div>
                );
              }))}
            </div>
            
            {status !== 'in-progress' && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                <h2 className="text-4xl font-black font-serif mb-6 uppercase tracking-wider text-primary drop-shadow-sm">
                  {status === 'draw' ? 'Draw' : status === 'white-wins' ? 'White Wins!' : 'Black Wins!'}
                </h2>
                <Button onClick={resetGame} size="lg" className="rounded-full shadow-lg">
                  <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col h-[500px]">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">Match Controls</h3>
            <div className="flex gap-2 mb-6">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={resetGame}>
                <RotateCcw className="w-4 h-4 mr-2" /> Reset
              </Button>
              <Button variant="destructive" className="flex-1 rounded-xl" onClick={() => setStatus(turn === 'white' ? 'black-wins' : 'white-wins')}>
                <Flag className="w-4 h-4 mr-2" /> Resign
              </Button>
            </div>
            <MoveHistoryPanel history={history} />
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default ChessPage;
