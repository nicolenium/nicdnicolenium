
import React from 'react';

const GameBoard = ({ children, type = 'square' }) => {
  return (
    <div className="w-full flex items-center justify-center p-2 sm:p-4">
      <div className={type === 'connect4' ? 'connect4-board-shell' : 'game-board-wrapper'}>
        {children}
      </div>
    </div>
  );
};

export default GameBoard;
