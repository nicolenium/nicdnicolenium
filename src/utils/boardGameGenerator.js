
// Procedural Board Game Position Generators

export const generateChessPosition = (stage = 'start') => {
  if (stage === 'start') {
    return [
      ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
      ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ];
  }
  // Simplified Endgame Generator
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  board[Math.floor(Math.random()*2)][Math.floor(Math.random()*8)] = 'k';
  board[7 - Math.floor(Math.random()*2)][Math.floor(Math.random()*8)] = 'K';
  board[Math.floor(Math.random()*8)][Math.floor(Math.random()*8)] = 'P';
  return board;
};

export const generateCheckersPosition = (variant = '8x8', stage = 'start') => {
  const size = variant === '10x10' ? 10 : 8;
  const board = Array(size).fill(null).map(() => Array(size).fill(0));
  if (stage === 'start') {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if ((r + c) % 2 === 1) {
          if (r < (size/2 - 1)) board[r][c] = 2;
          else if (r > (size/2)) board[r][c] = 1;
        }
      }
    }
  }
  return board;
};

export const generateLudoSequence = () => {
  return Array.from({length: 100}).map(() => Math.floor(Math.random() * 6) + 1);
};

export const generateTicTacToeVariation = () => {
  const board = Array(9).fill(null);
  const moves = Math.floor(Math.random() * 4); // 0-3 random opening moves
  for(let i=0; i<moves; i++) {
    const empty = board.map((v,i)=>v===null?i:null).filter(v=>v!==null);
    if(empty.length > 0) board[empty[Math.floor(Math.random()*empty.length)]] = i%2===0?'X':'O';
  }
  return board;
};

export const generateDominoDistribution = () => {
  const tiles = [];
  for (let i = 0; i <= 6; i++) {
    for (let j = i; j <= 6; j++) tiles.push([i, j]);
  }
  return tiles.sort(() => Math.random() - 0.5);
};

export const ensureNoRepeatPos = (history, pos) => {
  const str = JSON.stringify(pos);
  return !history.some(h => JSON.stringify(h) === str);
};
