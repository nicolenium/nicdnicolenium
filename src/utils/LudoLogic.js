
export const LUDO_COLORS = [
  { id: 0, name: 'Red', hex: '#ef4444', start: 0, home: 51 },
  { id: 1, name: 'Green', hex: '#22c55e', start: 13, home: 12 },
  { id: 2, name: 'Yellow', hex: '#eab308', start: 26, home: 25 },
  { id: 3, name: 'Blue', hex: '#3b82f6', start: 39, home: 38 }
];

export const SAFE_ZONES = [
  { r: 6, c: 1 }, { r: 2, c: 6 }, { r: 1, c: 8 }, { r: 6, c: 12 },
  { r: 8, c: 13 }, { r: 12, c: 8 }, { r: 13, c: 6 }, { r: 8, c: 2 }
];

// 52 positions around the board (15x15 grid)
export const TRACK_PATH = [
  {r:6, c:0}, {r:6, c:1}, {r:6, c:2}, {r:6, c:3}, {r:6, c:4}, {r:6, c:5},
  {r:5, c:6}, {r:4, c:6}, {r:3, c:6}, {r:2, c:6}, {r:1, c:6}, {r:0, c:6},
  {r:0, c:7}, {r:0, c:8}, {r:1, c:8}, {r:2, c:8}, {r:3, c:8}, {r:4, c:8}, {r:5, c:8},
  {r:6, c:9}, {r:6, c:10}, {r:6, c:11}, {r:6, c:12}, {r:6, c:13}, {r:6, c:14},
  {r:7, c:14}, {r:8, c:14}, {r:8, c:13}, {r:8, c:12}, {r:8, c:11}, {r:8, c:10}, {r:8, c:9},
  {r:9, c:8}, {r:10, c:8}, {r:11, c:8}, {r:12, c:8}, {r:13, c:8}, {r:14, c:8},
  {r:14, c:7}, {r:14, c:6}, {r:13, c:6}, {r:12, c:6}, {r:11, c:6}, {r:10, c:6}, {r:9, c:6},
  {r:8, c:5}, {r:8, c:4}, {r:8, c:3}, {r:8, c:2}, {r:8, c:1}, {r:8, c:0},
  {r:7, c:0}
];

// Home stretches for each player (indices 0: Red, 1: Green, 2: Yellow, 3: Blue)
export const HOME_STRETCHES = [
  [{r:7, c:1}, {r:7, c:2}, {r:7, c:3}, {r:7, c:4}, {r:7, c:5}, {r:7, c:6}], // Red
  [{r:1, c:7}, {r:2, c:7}, {r:3, c:7}, {r:4, c:7}, {r:5, c:7}, {r:6, c:7}], // Green
  [{r:7, c:13}, {r:7, c:12}, {r:7, c:11}, {r:7, c:10}, {r:7, c:9}, {r:7, c:8}], // Yellow
  [{r:13, c:7}, {r:12, c:7}, {r:11, c:7}, {r:10, c:7}, {r:9, c:7}, {r:8, c:7}]  // Blue
];

export const getAbsolutePos = (player, pos) => {
  if (pos < 0 || pos > 51) return pos;
  return (pos + LUDO_COLORS[player].start) % 52;
};

export const createInitialLudoState = () => {
  const initialPositions = [
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1],
    [-1, -1, -1, -1] 
  ];
  return {
    pieces: initialPositions,
    positions: initialPositions,
    turn: 0,
    dice: null,
    diceRolled: false,
    winner: null,
    status: 'playing',
    consecutiveSixes: 0
  };
};

export const getValidLudoPieces = (gameState, player) => {
  if (!gameState.diceRolled || !gameState.dice) return [];
  const valid = [];
  const pieces = gameState.pieces || gameState.positions;
  const playerPieces = pieces[player];
  
  playerPieces.forEach((pos, idx) => {
    if (pos === -1) {
      if (gameState.dice === 6) valid.push(idx);
    } else if (pos >= 0 && pos < 52) {
      const homeTile = LUDO_COLORS[player].home;
      const distToHome = (homeTile - pos + 52) % 52;
      
      if (distToHome < gameState.dice && distToHome !== 0) {
        const homeStretchTarget = 100 + (gameState.dice - distToHome) - 1;
        if (homeStretchTarget <= 105) valid.push(idx);
      } else {
        valid.push(idx);
      }
    } else if (pos >= 100) {
      if (pos + gameState.dice <= 105) valid.push(idx);
    }
  });
  return valid;
};

export const executeLudoMoveWithDetails = (gameState, player, pieceIndex) => {
  const newState = JSON.parse(JSON.stringify(gameState));
  const piecesArray = newState.pieces || newState.positions;
  const dice = newState.dice;
  let pos = piecesArray[player][pieceIndex];
  let notation = '';
  let captured = false;

  if (pos === -1 && dice === 6) {
    piecesArray[player][pieceIndex] = LUDO_COLORS[player].start;
    notation = `Spawned piece ${pieceIndex + 1}`;
  } else {
    let newPos = pos;
    if (pos < 100) {
      const homeTile = LUDO_COLORS[player].home;
      const distToHome = (homeTile - pos + 52) % 52;
      
      if (distToHome < dice && distToHome !== 0) {
        newPos = 100 + (dice - distToHome) - 1;
      } else {
        newPos = (pos + dice) % 52;
      }
    } else {
      newPos = pos + dice;
    }

    if (newPos < 100 && !SAFE_ZONES.some(z => z.r === TRACK_PATH[newPos]?.r && z.c === TRACK_PATH[newPos]?.c)) {
      for (let p = 0; p < 4; p++) {
        if (p !== player) {
          for (let i = 0; i < 4; i++) {
            if (piecesArray[p][i] === newPos) {
              piecesArray[p][i] = -1; 
              captured = true;
              notation = `Captured ${LUDO_COLORS[p].name}'s piece!`;
            }
          }
        }
      }
    }

    piecesArray[player][pieceIndex] = newPos;
    if (!notation) notation = `Moved piece ${pieceIndex + 1} by ${dice}`;
  }

  newState.pieces = piecesArray;
  newState.positions = piecesArray;

  if (piecesArray[player].every(p => p === 105)) {
    newState.winner = player;
    newState.status = 'completed';
  }

  if (dice === 6 && !captured) {
    newState.consecutiveSixes += 1;
    if (newState.consecutiveSixes === 3) {
      newState.turn = (newState.turn + 1) % 4;
      newState.consecutiveSixes = 0;
    }
  } else if (captured) {
    newState.consecutiveSixes = 0;
  } else {
    newState.turn = (newState.turn + 1) % 4;
    newState.consecutiveSixes = 0;
  }

  newState.dice = null;
  newState.diceRolled = false;

  return { newState, notation };
};

export const executeLudoMove = (state, color, pieceIndex, diceValue) => {
  const tempState = { ...state };
  if (diceValue !== undefined) {
    tempState.dice = diceValue;
    tempState.diceRolled = true;
  }
  const { newState } = executeLudoMoveWithDetails(tempState, color, pieceIndex);
  return newState;
};
