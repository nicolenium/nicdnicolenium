
export const initializeGame = (difficulty = 'medium') => {
  const cardCounts = { easy: 8, medium: 12, hard: 18 };
  const pairCount = cardCounts[difficulty] || 12;
  
  const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎬', '🎤', '🎧', '🎸', '🎹', '🎺', '🎻', '🎼', '🎵', '🎶', '🏀', '⚽'];
  const cards = [];
  
  for (let i = 0; i < pairCount; i++) {
    const symbol = symbols[i % symbols.length];
    cards.push({ id: i * 2, symbol, isFlipped: false, isMatched: false });
    cards.push({ id: i * 2 + 1, symbol, isFlipped: false, isMatched: false });
  }
  
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  
  return {
    cards,
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    score: 0,
    startTime: Date.now()
  };
};

export const validateMove = (gameState, cardId) => {
  const card = gameState.cards.find(c => c.id === cardId);
  return card && !card.isFlipped && !card.isMatched && gameState.flippedCards.length < 2;
};

export const executeMove = (gameState, cardId) => {
  const newCards = gameState.cards.map(card =>
    card.id === cardId ? { ...card, isFlipped: true } : card
  );
  
  const newFlippedCards = [...gameState.flippedCards, cardId];
  let newMatchedPairs = gameState.matchedPairs;
  let newMoves = gameState.moves;
  let newScore = gameState.score;
  
  if (newFlippedCards.length === 2) {
    newMoves++;
    const [card1, card2] = newFlippedCards.map(id => newCards.find(c => c.id === id));
    
    if (card1.symbol === card2.symbol) {
      newCards.forEach(card => {
        if (card.id === card1.id || card.id === card2.id) {
          card.isMatched = true;
        }
      });
      newMatchedPairs++;
      newScore += 100;
    } else {
      newScore = Math.max(0, newScore - 10);
    }
  }
  
  return {
    ...gameState,
    cards: newCards,
    flippedCards: newFlippedCards,
    matchedPairs: newMatchedPairs,
    moves: newMoves,
    score: newScore
  };
};

export const resetFlippedCards = (gameState) => {
  const newCards = gameState.cards.map(card =>
    card.isMatched ? card : { ...card, isFlipped: false }
  );
  
  return {
    ...gameState,
    cards: newCards,
    flippedCards: []
  };
};

export const checkGameStatus = (gameState) => {
  const totalPairs = gameState.cards.length / 2;
  if (gameState.matchedPairs === totalPairs) {
    return { status: 'finished', winner: 'player' };
  }
  return { status: 'ongoing', winner: null };
};

export const calculateScore = (gameState) => {
  const timeBonus = Math.max(0, 1000 - Math.floor((Date.now() - gameState.startTime) / 1000));
  const movesPenalty = gameState.moves * 5;
  return Math.max(0, gameState.score + timeBonus - movesPenalty);
};
