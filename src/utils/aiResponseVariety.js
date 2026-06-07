
export const RESPONSE_POOLS = {
  chess: {
    move: [
      "Controlling the center.", "Developing my pieces.", "A solid positional move.", "Preparing for an attack.", "Securing my king.",
      "An unexpected maneuver.", "Challenging your structure.", "Improving my piece activity.", "A quiet but deadly setup.", "Seizing the initiative."
    ],
    capture: ["Taking advantage of your blunder.", "Material gain.", "A calculated exchange.", "Simplifying the position.", "Removing a key defender."]
  },
  checkers: {
    move: ["Advancing forward.", "Solidifying my back row.", "Controlling the diagonals.", "Setting a trap.", "A standard opening push.", "Moving to the flanks."],
    capture: ["A forced jump.", "Taking your piece.", "Clearing the board.", "A tactical sequence.", "Jumping ahead."]
  },
  ludo: {
    move: ["Moving closer to home.", "Getting out of the base.", "A lucky roll.", "Chasing your piece.", "Playing it safe."],
    capture: ["Sending you back to start!", "A perfect strike.", "Sorry, not sorry.", "Tactical elimination."]
  },
  tictactoe: {
    move: ["Taking the center.", "Blocking your line.", "Setting up a trap.", "A forced move.", "Playing the corners."]
  },
  dominoes: {
    move: ["Matching the ends.", "Playing my heaviest tile.", "Keeping my options open.", "A strategic placement.", "Forcing your hand."]
  },
  quiz_feedback: {
    correct: ["Spot on!", "Excellent!", "You got it right!", "Perfect answer.", "Brilliant deduction.", "Absolutely correct.", "Nailed it!", "Impressive knowledge."],
    incorrect: ["Not quite.", "Better luck next time.", "Incorrect.", "That's a miss.", "Close, but no.", "Let's review that one.", "A tricky question!"]
  },
  hints: ["Look at the patterns.", "Take your time.", "Consider all options.", "Eliminate the obvious wrong answers.", "Think outside the box."]
};

export const getRandomResponse = (pool) => {
  if (!pool || pool.length === 0) return "Thinking...";
  return pool[Math.floor(Math.random() * pool.length)];
};

export const getAIResponse = (gameType, actionType, difficulty) => {
  const gamePool = RESPONSE_POOLS[gameType] || RESPONSE_POOLS.chess;
  const actionPool = gamePool[actionType] || gamePool.move || ["Thinking..."];
  return getRandomResponse(actionPool);
};

export const varyResponseTone = (baseResponse, tone) => {
  switch (tone) {
    case 'encouraging': return `Great try! ${baseResponse}`;
    case 'challenging': return `Is that all you have? ${baseResponse}`;
    case 'neutral': default: return baseResponse;
  }
};

export const varyResponseTiming = (baseTimeMs) => {
  const variance = baseTimeMs * 0.2; // +/- 20%
  return baseTimeMs + (Math.random() * variance * 2 - variance);
};

export const addPersonality = (response, personality) => {
  const quirks = {
    Aggressive: "!", Defensive: "...", Balanced: ".", Unpredictable: "?!", Strategic: " - precisely planned."
  };
  return `${response}${quirks[personality] || "."}`;
};
