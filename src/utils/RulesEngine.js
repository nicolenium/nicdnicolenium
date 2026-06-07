
export const RulesEngine = {
  checkers: {
    title: 'International Checkers (FMJD)',
    sections: [
      { id: 'board', title: 'Board Setup', content: 'Played on a 10x10 board with 20 pieces per player. The bottom-left square must be dark.' },
      { id: 'movement', title: 'Movement', content: 'Men move diagonally forward one square. Kings move any number of squares diagonally.' },
      { id: 'capturing', title: 'Capturing', content: 'Capturing is mandatory. You must take the maximum possible number of pieces (majority rule).' },
      { id: 'flying-king', title: 'Flying King', content: 'A King can fly over empty squares and capture pieces at a distance.' },
      { id: 'promotion', title: 'Promotion', content: 'A man reaching the farthest row immediately becomes a King.' }
    ]
  },
  ludo: {
    title: 'Ludo',
    sections: [
      { id: 'objective', title: 'Objective', content: 'Be the first to move all 4 tokens from the start to the home triangle.' },
      { id: 'rolling', title: 'Rolling', content: 'You must roll a 6 to move a token out of the starting area.' }
    ]
  }
};
