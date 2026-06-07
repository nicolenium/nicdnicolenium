
import { getValidColumns, dropPiece, checkConnectFourWin as checkWin, isConnectFourDraw as isDraw } from './ConnectFourLogic.js';
import { logAIMove, getDifficultyTimeout, executeWithTimeout } from './AILogger.js';

const evaluateWindow = (window, player) => {
  const opp = player === 1 ? 2 : 1;
  let score = 0;
  const pCount = window.filter(c => c === player).length;
  const oCount = window.filter(c => c === opp).length;
  const emptyCount = window.filter(c => c === null).length;

  if (pCount === 4) score += 100;
  else if (pCount === 3 && emptyCount === 1) score += 0.5;
  else if (pCount === 2 && emptyCount === 2) score += 0.1;
  
  if (oCount === 4) score -= 100;
  else if (oCount === 3 && emptyCount === 1) score -= 0.8;

  return score;
};

const evaluateBoard = (board, player) => {
  let score = 0;
  let centerCount = 0;
  for(let r=0; r<6; r++) if(board[r][3] === player) centerCount++;
  score += centerCount * 0.06;
  
  for (let r=0; r<6; r++) {
    for (let c=0; c<4; c++) {
      score += evaluateWindow([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]], player);
    }
  }
  for (let c=0; c<7; c++) {
    for (let r=0; r<3; r++) {
      score += evaluateWindow([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]], player);
    }
  }
  for (let r=0; r<3; r++) {
    for (let c=0; c<4; c++) {
      score += evaluateWindow([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]], player);
      score += evaluateWindow([board[r+3][c], board[r+2][c+1], board[r+1][c+2], board[r][c+3]], player);
    }
  }
  return score;
};

const yieldThread = () => new Promise(r => setTimeout(r, 0));

export async function getBestMove(board, difficulty = 'hard', timeLimitMs = 1500, player = 2) {
  const startTime = Date.now();
  const timeoutMs = getDifficultyTimeout(difficulty);
  let nodes = 0;
  const opponent = player === 1 ? 2 : 1;
  const cols = getValidColumns(board);
  const evalBefore = evaluateBoard(board, player);
  
  if (cols.length === 0) return null;
  if (cols.length === 1) {
      await logAIMove({
        game: 'ConnectFour',
        level: difficulty,
        depth: 1,
        eval: evalBefore,
        evalBefore: evalBefore,
        time: 0,
        move: `col:${cols[0]}`
      });
      return { move: cols[0], score: evalBefore, depth: 1, timeMs: 0, nodes: 0, explanation: "Forced move." };
  }

  const fallbackMove = cols[Math.floor(Math.random() * cols.length)];

  let maxDepth = 2;
  if (difficulty === 'easy') maxDepth = 2;
  else if (difficulty === 'medium') maxDepth = 5;
  else if (difficulty === 'hard') maxDepth = 7;
  else if (difficulty === 'expert') maxDepth = 9;

  try {
    return await executeWithTimeout(async () => {
      const minimax = async (currBoard, depth, alpha, beta, isMax) => {
        nodes++;
        if (nodes % 2000 === 0) await yieldThread();

        if (checkWin(currBoard, player)) return 100 + depth;
        if (checkWin(currBoard, opponent)) return -100 - depth;
        if (isDraw(currBoard)) return 0;

        if (depth === 0) return evaluateBoard(currBoard, player);

        const validCols = getValidColumns(currBoard);

        if (isMax) {
          let maxEval = -Infinity;
          for (const col of validCols) {
            const { newBoard } = dropPiece(currBoard, col, player);
            const ev = await minimax(newBoard, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, ev);
            alpha = Math.max(alpha, ev);
            if (beta <= alpha) break;
          }
          return maxEval;
        } else {
          let minEval = Infinity;
          for (const col of validCols) {
            const { newBoard } = dropPiece(currBoard, col, opponent);
            const ev = await minimax(newBoard, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, ev);
            beta = Math.min(beta, ev);
            if (beta <= alpha) break;
          }
          return minEval;
        }
      };

      let bestMove = cols[0];
      let bestScore = -Infinity;
      let currentDepth = 1;

      for (let d = 1; d <= maxDepth; d++) {
        currentDepth = d;
        let dBestScore = -Infinity;
        let dBestMove = cols[0];

        for (const col of cols) {
          const { newBoard, row } = dropPiece(board, col, player);
          if (checkWin(newBoard, row, col, player)) {
              await logAIMove({
                game: 'ConnectFour',
                level: difficulty,
                depth: d,
                eval: 100,
                evalBefore: evalBefore,
                time: Date.now() - startTime,
                move: `col:${col}`
              });
              return { move: col, score: 100, depth: d, timeMs: Date.now() - startTime, nodes, explanation: "Found immediate win!" };
          }
          
          const score = await minimax(newBoard, d - 1, -Infinity, Infinity, false);
          
          if (score > dBestScore) {
            dBestScore = score;
            dBestMove = col;
          }
        }
        bestScore = dBestScore;
        bestMove = dBestMove;
        
        if (bestScore > 90) break; 
      }
      
      const timeSpent = Date.now() - startTime;
      const explanation = bestScore > 90 ? "Found winning sequence!" : (bestScore < -90 ? "Trying to block losing sequence." : "Controlling the board.");
      
      await logAIMove({
        game: 'ConnectFour',
        level: difficulty,
        depth: currentDepth,
        eval: bestScore,
        evalBefore: evalBefore,
        time: timeSpent,
        move: `col:${bestMove}`
      });

      return {
        move: bestMove,
        score: bestScore,
        depth: currentDepth,
        timeMs: timeSpent,
        nodes,
        explanation,
        log: { depth: currentDepth, eval: bestScore, nodesSearched: nodes, time: timeSpent }
      };
    }, timeoutMs, 'ConnectFour', difficulty);

  } catch (e) {
    if (e.message === "TIMEOUT") {
      return {
        move: fallbackMove,
        score: evalBefore,
        depth: maxDepth,
        timeMs: Date.now() - startTime,
        nodes,
        explanation: "Timeout reached. Played random fallback move.",
        log: { depth: maxDepth, eval: evalBefore, nodesSearched: nodes, time: Date.now() - startTime }
      };
    }
    throw e;
  }
}
