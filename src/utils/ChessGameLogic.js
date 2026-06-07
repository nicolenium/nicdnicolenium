
export const initializeBoard = () => ({
  board: [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  ],
  turnWhite: true,
  castling: { wK: true, wQ: true, bK: true, bQ: true },
  enPassant: null,
  halfMoves: 0,
  moveNumber: 1,
  history: []
});

export const createInitialState = initializeBoard;

export const isWhite = (p) => p && p === p.toUpperCase();
export const isBlack = (p) => p && p === p.toLowerCase();

export const findKing = (board, isWhiteKing) => {
  const target = isWhiteKing ? 'K' : 'k';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === target) return { r, c };
    }
  }
  return null;
};

export const isSquareUnderAttack = (state, r, c, byWhite) => {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const p = state.board[i][j];
      if (p && (byWhite ? isWhite(p) : isBlack(p))) {
        const type = p.toLowerCase();
        const dir = isWhite(p) ? -1 : 1;
        
        if (type === 'p') {
          if (i + dir === r && (j - 1 === c || j + 1 === c)) return true;
        } else if (type === 'n') {
          const dr = Math.abs(i - r), dc = Math.abs(j - c);
          if ((dr === 2 && dc === 1) || (dr === 1 && dc === 2)) return true;
        } else if (type === 'k') {
          if (Math.abs(i - r) <= 1 && Math.abs(j - c) <= 1) return true;
        } else {
          const dr = r > i ? 1 : r < i ? -1 : 0;
          const dc = c > j ? 1 : c < j ? -1 : 0;
          if (type === 'b' && dr === 0 && dc === 0) continue; 
          if (type === 'r' && dr !== 0 && dc !== 0) continue; 
          
          let tr = i + dr, tc = j + dc;
          let blocked = false;
          while (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
            if (tr === r && tc === c) return true;
            if (state.board[tr][tc]) { blocked = true; break; }
            tr += dr; tc += dc;
          }
        }
      }
    }
  }
  return false;
};

export const isCheck = (state, forWhite) => {
  const k = findKing(state.board, forWhite);
  if (!k) return false;
  return isSquareUnderAttack(state, k.r, k.c, !forWhite);
};

const getPseudoLegalMoves = (state, r, c) => {
  const piece = state.board[r][c];
  if (!piece) return [];
  const moves = [];
  const white = isWhite(piece);
  const dir = white ? -1 : 1;

  const addMove = (tr, tc, special = {}) => {
    if (tr < 0 || tr > 7 || tc < 0 || tc > 7) return false;
    const target = state.board[tr][tc];
    if (!target) {
      moves.push({ fromR: r, fromC: c, r: tr, c: tc, ...special });
      return true;
    }
    if ((white && isBlack(target)) || (!white && isWhite(target))) {
      moves.push({ fromR: r, fromC: c, r: tr, c: tc, capture: true, ...special });
    }
    return false;
  };
  
  const slide = (dr, dc) => { 
    let tr = r + dr, tc = c + dc; 
    while (addMove(tr, tc)) { tr += dr; tc += dc; } 
  };

  const type = piece.toLowerCase();
  
  if (type === 'p') {
    if (r + dir >= 0 && r + dir <= 7 && !state.board[r + dir][c]) {
      moves.push({ fromR: r, fromC: c, r: r + dir, c, promotion: (r + dir === 0 || r + dir === 7) });
      if ((white && r === 6) || (!white && r === 1)) {
        if (!state.board[r + dir * 2][c]) moves.push({ fromR: r, fromC: c, r: r + dir * 2, c, doublePush: true });
      }
    }
    [-1, 1].forEach(dc => {
      const tc = c + dc;
      if (tc >= 0 && tc <= 7 && r + dir >= 0 && r + dir <= 7) {
        const t = state.board[r + dir][tc];
        if (t && ((white && isBlack(t)) || (!white && isWhite(t)))) {
          moves.push({ fromR: r, fromC: c, r: r + dir, c: tc, capture: true, promotion: (r + dir === 0 || r + dir === 7) });
        } else if (state.enPassant && state.enPassant.r === r + dir && state.enPassant.c === tc) {
          moves.push({ fromR: r, fromC: c, r: r + dir, c: tc, capture: true, isEnPassant: true });
        }
      }
    });
  } else if (type === 'n') {
    [[-2,-1], [-2,1], [-1,-2], [-1,2], [1,-2], [1,2], [2,-1], [2,1]].forEach(([dr, dc]) => addMove(r + dr, c + dc));
  } else if (type === 'b') {
    slide(-1, -1); slide(-1, 1); slide(1, -1); slide(1, 1);
  } else if (type === 'r') {
    slide(-1, 0); slide(1, 0); slide(0, -1); slide(0, 1);
  } else if (type === 'q') {
    slide(-1, 0); slide(1, 0); slide(0, -1); slide(0, 1); slide(-1, -1); slide(-1, 1); slide(1, -1); slide(1, 1);
  } else if (type === 'k') {
    [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]].forEach(([dr, dc]) => addMove(r + dr, c + dc));
    
    if (white && r === 7 && c === 4) {
      if (state.castling.wK && !state.board[7][5] && !state.board[7][6]) moves.push({fromR: r, fromC: c, r: 7, c: 6, castle: 'K'});
      if (state.castling.wQ && !state.board[7][1] && !state.board[7][2] && !state.board[7][3]) moves.push({fromR: r, fromC: c, r: 7, c: 2, castle: 'Q'});
    }
    if (!white && r === 0 && c === 4) {
      if (state.castling.bK && !state.board[0][5] && !state.board[0][6]) moves.push({fromR: r, fromC: c, r: 0, c: 6, castle: 'k'});
      if (state.castling.bQ && !state.board[0][1] && !state.board[0][2] && !state.board[0][3]) moves.push({fromR: r, fromC: c, r: 0, c: 2, castle: 'q'});
    }
  }
  return moves;
};

const serializeBoard = (board) => board.map(row => row.map(p => p || '.').join('')).join('/');

export const executeMove = (state, fromR, fromC, toR, toC, special = {}) => {
  const newState = { 
    ...state, 
    board: state.board.map(row => [...row]), 
    castling: { ...state.castling }, 
    enPassant: null,
    turnWhite: !state.turnWhite,
    history: [...(state.history || [])],
    halfMoves: state.halfMoves + 1
  };
  
  let piece = newState.board[fromR][fromC];
  const type = piece ? piece.toLowerCase() : '';
  
  if (type === 'p' || special.capture || newState.board[toR][toC]) {
    newState.halfMoves = 0;
  }
  
  if (special.castle) {
    if (special.castle === 'K') { newState.board[7][5] = 'R'; newState.board[7][7] = null; }
    if (special.castle === 'Q') { newState.board[7][3] = 'R'; newState.board[7][0] = null; }
    if (special.castle === 'k') { newState.board[0][5] = 'r'; newState.board[0][7] = null; }
    if (special.castle === 'q') { newState.board[0][3] = 'r'; newState.board[0][0] = null; }
  }

  if (special.isEnPassant) {
    const dir = isWhite(piece) ? 1 : -1;
    newState.board[toR + dir][toC] = null; 
  }

  newState.board[toR][toC] = piece;
  newState.board[fromR][fromC] = null;

  if (special.promotion) newState.board[toR][toC] = isWhite(piece) ? 'Q' : 'q'; 

  if (special.doublePush) newState.enPassant = { r: isWhite(piece) ? toR + 1 : toR - 1, c: toC };

  if (type === 'k') {
    if (isWhite(piece)) { newState.castling.wK = false; newState.castling.wQ = false; }
    else { newState.castling.bK = false; newState.castling.bQ = false; }
  } else if (type === 'r') {
    if (fromR === 7 && fromC === 0) newState.castling.wQ = false;
    if (fromR === 7 && fromC === 7) newState.castling.wK = false;
    if (fromR === 0 && fromC === 0) newState.castling.bQ = false;
    if (fromR === 0 && fromC === 7) newState.castling.bK = false;
  }
  
  if (toR === 7 && toC === 0) newState.castling.wQ = false;
  if (toR === 7 && toC === 7) newState.castling.wK = false;
  if (toR === 0 && toC === 0) newState.castling.bQ = false;
  if (toR === 0 && toC === 7) newState.castling.bK = false;

  if (!state.turnWhite) newState.moveNumber += 1;
  newState.history.push(serializeBoard(newState.board));

  return newState;
};

export const movePiece = executeMove;

export const getValidMoves = (state, r, c) => {
  const piece = state.board[r][c];
  if (!piece) return [];
  const white = isWhite(piece);
  if (white !== state.turnWhite) return []; 
  const pseudoMoves = getPseudoLegalMoves(state, r, c);
  
  return pseudoMoves.filter(move => {
    if (move.castle) {
      if (isCheck(state, white)) return false; 
      const passC = move.castle.toLowerCase() === 'k' ? 5 : 3;
      if (isSquareUnderAttack(state, r, passC, !white)) return false; 
    }
    const testState = executeMove(state, r, c, move.r, move.c, move);
    return !isCheck(testState, white);
  });
};

export const getAvailableMoves = getValidMoves;

export const hasAnyValidMoves = (state, turnWhite) => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = state.board[r][c];
      if (p && (turnWhite ? isWhite(p) : isBlack(p))) {
        if (getValidMoves(state, r, c).length > 0) return true;
      }
    }
  }
  return false;
};

const checkThreefoldRepetition = (state) => {
  if (!state.history || state.history.length < 9) return false;
  const currentStr = serializeBoard(state.board);
  const matches = state.history.filter(h => h === currentStr).length;
  return matches >= 3;
};

export const getGameStatus = (state, turnWhite) => {
  if (state.halfMoves >= 100) return { status: 'draw', winner: 'draw', reason: '50-move rule' };
  if (checkThreefoldRepetition(state)) return { status: 'draw', winner: 'draw', reason: 'Threefold repetition' };
  
  const inCheck = isCheck(state, turnWhite);
  const hasMoves = hasAnyValidMoves(state, turnWhite);

  if (inCheck && !hasMoves) return { status: 'checkmate', winner: turnWhite ? 'black' : 'white', isCheckmate: true };
  if (!inCheck && !hasMoves) return { status: 'stalemate', winner: 'draw', isStalemate: true };
  if (inCheck) return { status: 'check', winner: null, isCheck: true };
  
  return { status: 'playing', winner: null };
};

export const getChessAIOptions = () => [
  { label: 'Easy', value: 'easy', depth: 2 },
  { label: 'Medium', value: 'medium', depth: 4 },
  { label: 'Hard', value: 'hard', depth: 6 }
];
