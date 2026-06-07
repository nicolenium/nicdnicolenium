
export const GameRules = {
  ludo: {
    canEnterBoard: (diceRoll) => diceRoll === 6,
    isValidMove: (currentPos, diceRoll, pathLength = 52) => currentPos + diceRoll <= pathLength,
    isCapture: (pos1, pos2) => pos1 === pos2 && pos1 !== 0, // Simplified
    checkWin: (pieces) => pieces.every(p => p.isFinished)
  },
  ticTacToe: {
    checkWin: (board) => {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
        [0, 4, 8], [2, 4, 6]             // diagonals
      ];
      for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
      return null;
    },
    checkDraw: (board) => board.every(cell => cell !== null)
  },
  connectFour: {
    isValidMove: (board, col) => board[0][col] === null,
    getLowestEmptyRow: (board, col) => {
      for (let r = board.length - 1; r >= 0; r--) {
        if (board[r][col] === null) return r;
      }
      return -1;
    }
  },
  pacman: {
    isValidMove: (maze, x, y) => {
      if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) return false;
      return maze[y][x] !== 1; // 1 is wall
    }
  }
};
