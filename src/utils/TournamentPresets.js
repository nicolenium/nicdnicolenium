
export const TOURNAMENT_PRESETS = {
  chess: {
    id: 'chess',
    name: 'Chess Championship',
    format: 'Swiss System',
    timeControl: 'Blitz (5+0)',
    rules: {
      gameRules: 'FIDE Laws of Chess apply. Touch-move rule is strictly enforced.',
      timeControls: '5 minutes per player, no increment. Clock starts exactly on the round schedule.',
      pairingsSystem: 'Swiss System (Dutch variation). Players are paired based on equal or closest scores.',
      scoringSystem: '1 point for win, 0.5 for draw, 0 for loss.',
      tiebreakRules: '1. Buchholz (sum of opponents scores)\n2. Sonneborn-Berger\n3. Direct Encounter',
      eliminationRules: 'No elimination. All players play all rounds unless they withdraw.',
      prizeDistribution: '1st Place: 50%\n2nd Place: 30%\n3rd Place: 20%'
    }
  },
  checkers_8x8: {
    id: 'checkers_8x8',
    name: 'Classic Checkers 8x8',
    format: 'Round Robin',
    timeControl: 'Rapid (10+2)',
    rules: {
      gameRules: 'American Checkers / English Draughts rules. Forced capture is mandatory. Non-flying kings.',
      timeControls: '10 minutes per player with a 2-second increment per move.',
      pairingsSystem: 'Round Robin: Every player plays against every other player exactly once.',
      scoringSystem: '2 points for win, 1 point for draw, 0 for loss.',
      tiebreakRules: '1. Points\n2. Direct Encounter\n3. Number of Wins',
      eliminationRules: 'None. Complete Round Robin.',
      prizeDistribution: 'Winner-takes-all (100% to 1st Place)'
    }
  },
  checkers_10x10: {
    id: 'checkers_10x10',
    name: 'International Checkers 10x10',
    format: 'Swiss System',
    timeControl: 'Classical (30+5)',
    rules: {
      gameRules: 'FMJD (World Draughts Federation) rules. Flying kings, backward captures for men, majority capture rule applies.',
      timeControls: '30 minutes per player with a 5-second increment per move.',
      pairingsSystem: 'Swiss System.',
      scoringSystem: '2 points for win, 1 point for draw, 0 for loss.',
      tiebreakRules: '1. Solkoff (Buchholz)\n2. Median Solkoff\n3. Direct match result',
      eliminationRules: 'No elimination.',
      prizeDistribution: '1st Place: 60%\n2nd Place: 30%\n3rd Place: 10%'
    }
  },
  ludo: {
    id: 'ludo',
    name: 'Ludo Showdown',
    format: 'Knockout',
    timeControl: 'Turn Timer (30s)',
    rules: {
      gameRules: 'Standard Ludo rules. Must roll a 6 to enter the board. Three consecutive 6s skip the turn. Capturing opponents sends them to base.',
      timeControls: '30 seconds per turn. Missing 3 turns results in auto-forfeit.',
      pairingsSystem: 'Knockout bracket. Top 2 players from each 4-player board advance to the next round.',
      scoringSystem: 'Placement-based: 1st out advances as top seed, 2nd advances as lower seed.',
      tiebreakRules: 'Total pieces in home area when time/turns run out.',
      eliminationRules: 'Bottom 2 players of each 4-player match are eliminated.',
      prizeDistribution: '1st Place: 70%\n2nd Place: 30%'
    }
  },
  tictactoe: {
    id: 'tictactoe',
    name: 'Tic Tac Toe Series',
    format: 'Double Elimination',
    timeControl: 'Blitz (1+0)',
    rules: {
      gameRules: 'Best of 5 series per match. Standard Tic Tac Toe on 3x3 grid.',
      timeControls: '1 minute per player per game. Overtime results in a loss.',
      pairingsSystem: 'Double Elimination bracket. Winners advance in Winners Bracket, losers drop to Losers Bracket.',
      scoringSystem: 'First to 3 wins advances. Draws do not count toward the 3 wins.',
      tiebreakRules: 'Sudden death blitz game if series is tied 2-2 with multiple draws.',
      eliminationRules: 'A player is eliminated after losing two matches (series).',
      prizeDistribution: '1st Place: 50%\n2nd Place: 30%\n3rd Place: 20%'
    }
  }
};
