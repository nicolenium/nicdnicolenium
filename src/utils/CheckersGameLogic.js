
export const createInitialBoard = () => {
  const board = Array(8).fill(null).map(() => Array(8).fill(0));
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        if (r < 3) board[r][c] = 2; // Black Top (Player 2)
        else if (r > 4) board[r][c] = 1; // Red Bottom (Player 1)
      }
    }
  }
  return board;
};

export const isPlayer1 = (p) => p === 1 || p === 3;
export const isPlayer2 = (p) => p === 2 || p === 4;
export const isKing = (p) => p === 3 || p === 4;

export const getSquareNumber = (r, c) => {
  if ((r + c) % 2 === 1) {
    return (r * 4) + Math.floor(c / 2) + 1;
  }
  return null;
};

export const convertPositionToNotation = (fromPos, toPos, isCapture = false) => {
  const fromSq = getSquareNumber(fromPos.r, fromPos.c);
  const toSq = getSquareNumber(toPos.r, toPos.c);
  return `${fromSq}${isCapture ? 'x' : '-'}${toSq}`;
};

export const formatMoveNotation = convertPositionToNotation;

// Strict American Checkers forced jump logic
const findJumps = (board, r, c, player, currentPath = [], currentCaps = [], jumps = []) => {
  const piece = board[r][c];
  const isK = isKing(piece);
  const dirs = [];
  
  if (player === 1 || isK) dirs.push({dr: -1, dc: -1}, {dr: -1, dc: 1}); // Forward for P1 (Red)
  if (player === 2 || isK) dirs.push({dr: 1, dc: -1}, {dr: 1, dc: 1}); // Forward for P2 (Black)

  let foundJump = false;
  for (const { dr, dc } of dirs) {
    const jr = r + dr * 2, jc = c + dc * 2;
    const mr = r + dr, mc = c + dc;

    if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8) {
      const midP = board[mr][mc];
      const jumpP = board[jr][jc];
      const alreadyCap = currentCaps.some(cap => cap.r === mr && cap.c === mc);

      if (!alreadyCap && jumpP === 0 && midP !== 0) {
        const isOpponent = player === 1 ? isPlayer2(midP) : isPlayer1(midP);
        if (isOpponent) {
          foundJump = true;
          const newBoard = board.map(row => [...row]);
          newBoard[r][c] = 0;
          newBoard[mr][mc] = 0;
          newBoard[jr][jc] = piece; // Pre-promote logic during jump sequence
          
          const willPromote = (player === 1 && jr === 0 && !isK) || (player === 2 && jr === 7 && !isK);
          const newPath = [...currentPath, { r: jr, c: jc }];
          const newCaps = [...currentCaps, { r: mr, c: mc }];

          // American checkers: if you promote, your turn ends immediately (no multi-jump after promotion)
          if (willPromote) {
            jumps.push({ toR: jr, toC: jc, isCapture: true, capturedPieces: newCaps, path: newPath });
          } else {
            findJumps(newBoard, jr, jc, player, newPath, newCaps, jumps);
          }
        }
      }
    }
  }

  if (!foundJump && currentPath.length > 0) {
    jumps.push({ toR: r, toC: c, isCapture: true, capturedPieces: currentCaps, path: currentPath });
  }

  return jumps;
};

export const getAllValidMoves = (board, player) => {
  const movesMap = new Map();
  let hasJumps = false;

  // 1. Enforce forced jumps strictly across all pieces
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((player === 1 && isPlayer1(board[r][c])) || (player === 2 && isPlayer2(board[r][c]))) {
        const jumps = findJumps(board, r, c, player);
        if (jumps.length > 0) {
          hasJumps = true;
          movesMap.set(`${r},${c}`, jumps);
        }
      }
    }
  }

  if (hasJumps) return movesMap;

  // 2. If no jumps, find regular moves
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((player === 1 && isPlayer1(board[r][c])) || (player === 2 && isPlayer2(board[r][c]))) {
        const piece = board[r][c];
        const isK = isKing(piece);
        const dirs = [];
        
        if (player === 1 || isK) dirs.push({dr: -1, dc: -1}, {dr: -1, dc: 1});
        if (player === 2 || isK) dirs.push({dr: 1, dc: -1}, {dr: 1, dc: 1});

        const moves = [];
        for (const { dr, dc } of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] === 0) {
            moves.push({ toR: nr, toC: nc, isCapture: false, capturedPieces: [], path: [{ r: nr, c: nc }] });
          }
        }
        
        if (moves.length > 0) {
          movesMap.set(`${r},${c}`, moves);
        }
      }
    }
  }

  return movesMap;
};

export const getValidMoves = (board, pos, player) => {
  // To strictly enforce forced jumps, we fetch ALL valid moves and extract the subset for this pos
  const map = getAllValidMoves(board, player);
  const key = `${pos.r},${pos.c}`;
  return map.get(key) || [];
};

export const validateMove = (board, fromPos, toPos, player) => {
  const moves = getValidMoves(board, fromPos, player);
  return moves.find(m => m.toR === toPos.r && m.toC === toPos.c);
};

export const executeMove = (board, fromPos, move, player) => {
  const newBoard = board.map(row => [...row]);
  let piece = newBoard[fromPos.r][fromPos.c];
  let madeKing = false;

  newBoard[fromPos.r][fromPos.c] = 0;
  newBoard[move.toR][move.toC] = piece;

  if (move.capturedPieces) {
    move.capturedPieces.forEach(cap => {
      newBoard[cap.r][cap.c] = 0;
    });
  }

  if (player === 1 && move.toR === 0 && !isKing(piece)) { newBoard[move.toR][move.toC] = 3; madeKing = true; }
  else if (player === 2 && move.toR === 7 && !isKing(piece)) { newBoard[move.toR][move.toC] = 4; madeKing = true; }

  return { newBoard, capturedPieces: move.capturedPieces || [], pos: { r: move.toR, c: move.toC }, madeKing };
};

export const getGameStatus = (board, currentPlayer) => {
  let p1Pieces = 0, p2Pieces = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (isPlayer1(board[r][c])) p1Pieces++;
      if (isPlayer2(board[r][c])) p2Pieces++;
    }
  }
  if (p1Pieces === 0) return { status: 'player2_win', winner: 2 };
  if (p2Pieces === 0) return { status: 'player1_win', winner: 1 };

  if (getAllValidMoves(board, currentPlayer).size === 0) {
    return { status: currentPlayer === 1 ? 'player2_win' : 'player1_win', winner: currentPlayer === 1 ? 2 : 1 };
  }
  return { status: 'in_progress', winner: null };
};

export const checkGameStatus = getGameStatus;

export const isGameOver = (board, currentPlayer = 1) => {
  return getGameStatus(board, currentPlayer).status !== 'in_progress';
};

export const checkWinner = (board, currentPlayer = 1) => {
  return getGameStatus(board, currentPlayer).winner;
};

export const switchTurn = (currentPlayer) => {
  return currentPlayer === 1 ? 2 : 1;
};

export const hasAnyCapture = (board, player) => {
  const movesMap = getAllValidMoves(board, player);
  for (const moves of movesMap.values()) {
    if (moves.some(m => m.isCapture)) return true;
  }
  return false;
};
