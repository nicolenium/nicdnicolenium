
export const getSquareNumber10x10 = (r, c) => {
  if ((r + c) % 2 === 1) {
    return (r * 5) + Math.floor(c / 2) + 1;
  }
  return null;
};

export const getSquareNumber = getSquareNumber10x10;

export const createInitialBoard10x10 = () => {
  const board = Array(10).fill(null).map(() => Array(10).fill(null));
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      if ((r + c) % 2 === 1) {
        let id = getSquareNumber10x10(r, c);
        if (r < 4) board[r][c] = { player: 2, isKing: false, id: `p2-${id}` };
        else if (r > 5) board[r][c] = { player: 1, isKing: false, id: `p1-${id}` };
      }
    }
  }
  return board;
};

export const formatMoveNotation10x10 = (fromR, fromC, toR, toC) => {
  const fromSquare = getSquareNumber10x10(fromR, fromC);
  const toSquare = getSquareNumber10x10(toR, toC);
  return `${fromSquare}-${toSquare}`;
};

const getCapturePaths = (board, r, c, player, isKing, currentPath = [], currentCaps = []) => {
  let paths = [];
  const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]]; 

  for (const [dr, dc] of dirs) {
    if (isKing) {
      // Flying king capture rules
      let dist = 1;
      let oppPos = null;
      while (true) {
        const nr = r + dr * dist;
        const nc = c + dc * dist;
        if (nr < 0 || nr >= 10 || nc < 0 || nc >= 10) break;
        
        const piece = board[nr][nc];
        if (piece) {
          if (piece.player === player) break; 
          const alreadyCaptured = currentCaps.some(cap => cap.r === nr && cap.c === nc);
          if (alreadyCaptured) break; 
          oppPos = { r: nr, c: nc };
          break;
        }
        dist++;
      }

      if (oppPos) {
        let landDist = 1;
        while (true) {
          const lr = oppPos.r + dr * landDist;
          const lc = oppPos.c + dc * landDist;
          if (lr < 0 || lr >= 10 || lc < 0 || lc >= 10) break;
          
          const landPiece = board[lr][lc];
          // Can land on empty square or starting square of sequence
          if (!landPiece || (lr === currentPath[0]?.fromR && lc === currentPath[0]?.fromC)) {
            const newBoard = board.map(row => [...row]);
            newBoard[r][c] = null;
            newBoard[lr][lc] = { player, isKing: true }; 
            
            const newCaps = [...currentCaps, oppPos];
            const newPath = [...currentPath, { r: lr, c: lc }];
            
            const subPaths = getCapturePaths(newBoard, lr, lc, player, true, newPath, newCaps);
            if (subPaths.length > 0) {
              paths.push(...subPaths);
            } else {
              paths.push({ to: { r: lr, c: lc }, captured: newCaps, path: newPath });
            }
          } else {
            break; // blocked by another piece
          }
          landDist++;
        }
      }
    } else {
      // Regular man capture (International rules: can capture backwards!)
      const nr = r + dr;
      const nc = c + dc;
      const jr = r + dr * 2;
      const jc = c + dc * 2;

      if (jr >= 0 && jr < 10 && jc >= 0 && jc < 10) {
        const midPiece = board[nr][nc];
        const landPiece = board[jr][jc];
        
        if (midPiece && midPiece.player !== player && !currentCaps.some(cap => cap.r === nr && cap.c === nc)) {
          if (!landPiece || (jr === currentPath[0]?.fromR && jc === currentPath[0]?.fromC)) {
            const newBoard = board.map(row => [...row]);
            newBoard[r][c] = null;
            newBoard[jr][jc] = { player, isKing: false }; 
            
            const newCaps = [...currentCaps, { r: nr, c: nc }];
            const newPath = [...currentPath, { r: jr, c: jc }];
            
            const subPaths = getCapturePaths(newBoard, jr, jc, player, false, newPath, newCaps);
            if (subPaths.length > 0) {
              paths.push(...subPaths);
            } else {
              paths.push({ to: { r: jr, c: jc }, captured: newCaps, path: newPath });
            }
          }
        }
      }
    }
  }
  return paths;
};

export const getValidMoves10x10 = (board, player, restrictedSquare = null) => {
  let allCaptures = [];
  let maxCaptureLength = 0;

  // Find all captures first (Majority Capture Rule Enforced)
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      if (restrictedSquare && (r !== restrictedSquare.r || c !== restrictedSquare.c)) continue;
      
      const piece = board[r][c];
      if (piece && piece.player === player) {
        const paths = getCapturePaths(board, r, c, player, piece.isKing);
        for (const path of paths) {
          if (path.captured.length > maxCaptureLength) {
            maxCaptureLength = path.captured.length;
            allCaptures = [{ from: { r, c }, ...path }];
          } else if (path.captured.length === maxCaptureLength && maxCaptureLength > 0) {
            allCaptures.push({ from: { r, c }, ...path });
          }
        }
      }
    }
  }

  // If there are captures, by majority capture rule, we MUST take one of the maximal length captures
  if (maxCaptureLength > 0) return allCaptures;

  // Normal moves
  const moves = [];
  const dirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 10; c++) {
      if (restrictedSquare && (r !== restrictedSquare.r || c !== restrictedSquare.c)) continue;

      const piece = board[r][c];
      if (!piece || piece.player !== player) continue;

      const forwardDir = player === 1 ? -1 : 1;

      for (const [dr, dc] of dirs) {
        if (!piece.isKing && dr !== forwardDir) continue; // Men only move forward without capturing

        if (piece.isKing) {
          let dist = 1;
          while (true) {
            const nr = r + dr * dist;
            const nc = c + dc * dist;
            if (nr < 0 || nr >= 10 || nc < 0 || nc >= 10) break;
            if (board[nr][nc]) break; 
            moves.push({ from: { r, c }, to: { r: nr, c: nc }, captured: [] });
            dist++;
          }
        } else {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10 && !board[nr][nc]) {
            moves.push({ from: { r, c }, to: { r: nr, c: nc }, captured: [] });
          }
        }
      }
    }
  }
  return moves;
};

export const executeMove10x10 = (board, move) => {
  const newBoard = board.map(row => [...row]);
  const piece = { ...newBoard[move.from.r][move.from.c] };
  let madeKing = false;
  
  newBoard[move.from.r][move.from.c] = null;
  newBoard[move.to.r][move.to.c] = piece;

  if (move.captured && move.captured.length > 0) {
    move.captured.forEach(cap => {
      newBoard[cap.r][cap.c] = null;
    });
  }

  // Promotion occurs at END of turn in international rules (not mid-jump)
  if (!piece.isKing) {
    if ((piece.player === 1 && move.to.r === 0) || (piece.player === 2 && move.to.r === 9)) {
      piece.isKing = true;
      madeKing = true;
    }
  }

  return { newBoard, capturedPieces: move.captured || [], madeKing };
};

export const checkGameStatus10x10 = (board, player) => {
  const moves = getValidMoves10x10(board, player);
  if (moves.length === 0) {
    let p1Count = 0, p2Count = 0;
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 10; c++) {
        if (board[r][c]?.player === 1) p1Count++;
        if (board[r][c]?.player === 2) p2Count++;
      }
    }
    if (p1Count === 0) return { status: 'won', winner: 2 };
    if (p2Count === 0) return { status: 'won', winner: 1 };
    return { status: 'won', winner: player === 1 ? 2 : 1 }; 
  }
  return { status: 'active', winner: null };
};
