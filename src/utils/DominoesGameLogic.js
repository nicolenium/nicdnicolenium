
/**
 * Dominoes Game Logic
 * Ensures standard double-six set (28 tiles), accurate board ends calculation,
 * and standard scoring rules.
 */

export const generateDominoes = () => {
  // Standard Double-Six Set has exactly 28 tiles
  const tiles = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) {
      tiles.push([i, j]);
    }
  }
  // Fisher-Yates shuffle
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
};

export const getBoardEnds = (board) => {
  if (!board || board.length === 0) return [];
  if (board.length === 1) return [board[0][0], board[0][1]];
  return [board[0][0], board[board.length - 1][1]];
};

export const canPlayTile = (tile, boardEnds) => {
  if (boardEnds.length === 0) return true; // Board is empty, any tile can be played
  return tile.includes(boardEnds[0]) || tile.includes(boardEnds[1]);
};

export const evaluateWinner = (p1Hand, p2Hand) => {
  if (p1Hand.length === 0) return { winner: 1, reason: 'domino' };
  if (p2Hand.length === 0) return { winner: 2, reason: 'domino' };

  // If blocked, sum the pips. Lowest sum wins.
  const sum1 = p1Hand.reduce((acc, t) => acc + t[0] + t[1], 0);
  const sum2 = p2Hand.reduce((acc, t) => acc + t[0] + t[1], 0);

  if (sum1 < sum2) return { winner: 1, reason: 'blocked_lowest_score' };
  if (sum2 < sum1) return { winner: 2, reason: 'blocked_lowest_score' };
  return { winner: 'draw', reason: 'blocked_tie' };
};

export const hasValidMoves = (hand, boardEnds) => {
  if (boardEnds.length === 0) return hand.length > 0;
  return hand.some(tile => tile.includes(boardEnds[0]) || tile.includes(boardEnds[1]));
};
