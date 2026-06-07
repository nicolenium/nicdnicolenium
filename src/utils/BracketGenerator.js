
/**
 * Utility for generating tournament brackets
 */

// Helper to get next power of 2
const nextPowerOf2 = (n) => Math.pow(2, Math.ceil(Math.log2(n)));

export const generateSingleElimination = (players) => {
  if (!players || players.length < 2) return null;
  
  const totalSlots = nextPowerOf2(players.length);
  const byes = totalSlots - players.length;
  
  // Create initial seeded array (simplified seeding)
  const seeded = [...players];
  for (let i = 0; i < byes; i++) {
    seeded.push(null); // null represents a BYE
  }
  
  const totalRounds = Math.log2(totalSlots);
  const rounds = [];
  
  // Generate Round 1
  const round1Matches = [];
  for (let i = 0; i < totalSlots; i += 2) {
    const p1 = seeded[i];
    const p2 = seeded[i + 1];
    round1Matches.push({
      id: `r1-m${i/2 + 1}`,
      round: 1,
      player1: p1,
      player2: p2,
      status: p2 === null ? 'completed' : 'scheduled',
      winner: p2 === null ? p1 : null, // Auto-advance if bye
    });
  }
  rounds.push({ round: 1, matches: round1Matches });
  
  // Generate subsequent rounds as placeholders
  for (let r = 2; r <= totalRounds; r++) {
    const numMatches = totalSlots / Math.pow(2, r);
    const roundMatches = [];
    for (let m = 0; m < numMatches; m++) {
      roundMatches.push({
        id: `r${r}-m${m + 1}`,
        round: r,
        player1: null,
        player2: null,
        status: 'draft',
        winner: null
      });
    }
    rounds.push({ round: r, matches: roundMatches });
  }
  
  return { format: 'single_elimination', rounds, totalRounds, totalMatches: totalSlots - 1 };
};

export const generateDoubleElimination = (players) => {
  // Simplified double elimination structure
  const winnersBracket = generateSingleElimination(players);
  if (!winnersBracket) return null;

  return {
    format: 'double_elimination',
    winnersBracket: winnersBracket.rounds,
    losersBracket: [], // Requires complex routing logic, placeholder for UI
    totalRounds: winnersBracket.totalRounds * 2,
    totalMatches: (winnersBracket.totalMatches * 2) + 1
  };
};

export const generateRoundRobin = (players) => {
  if (!players || players.length < 2) return null;
  
  const numPlayers = players.length;
  const isOdd = numPlayers % 2 !== 0;
  const participants = isOdd ? [...players, null] : [...players];
  const roundsCount = participants.length - 1;
  const matchesPerRound = participants.length / 2;
  
  const rounds = [];
  
  for (let r = 0; r < roundsCount; r++) {
    const roundMatches = [];
    for (let m = 0; m < matchesPerRound; m++) {
      const p1 = participants[m];
      const p2 = participants[participants.length - 1 - m];
      
      if (p1 !== null && p2 !== null) {
        roundMatches.push({
          id: `r${r+1}-m${m+1}`,
          round: r + 1,
          player1: p1,
          player2: p2,
          status: 'scheduled',
          winner: null
        });
      }
    }
    rounds.push({ round: r + 1, matches: roundMatches });
    
    // Rotate participants (keep index 0 fixed)
    participants.splice(1, 0, participants.pop());
  }
  
  return { format: 'round_robin', rounds, totalRounds: roundsCount, totalMatches: rounds.reduce((acc, r) => acc + r.matches.length, 0) };
};

export default {
  generateSingleElimination,
  generateDoubleElimination,
  generateRoundRobin
};
