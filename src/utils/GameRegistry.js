
import { GAME_POSTERS } from '../config/gamePosterConfig.js';

class GameRegistry {
  constructor() {
    this.games = new Map();
    this.initializeRegistry();
  }

  initializeRegistry() {
    // Sync registry with the comprehensive GAME_POSTERS configuration (40 games)
    GAME_POSTERS.forEach(gameConfig => {
      this.registerGame({
        ...gameConfig,
        hasAI: gameConfig.modes.includes('single_player'),
        aiProIntelligence: gameConfig.difficulty === 'Hard' || gameConfig.difficulty === 'Expert',
        infiniteKnowledge: gameConfig.category === 'Quiz Games' || gameConfig.category === 'Educational Games'
      });
    });
  }

  registerGame(gameConfig) {
    this.games.set(gameConfig.id, {
      ...gameConfig,
      image: gameConfig.image || 'https://images.unsplash.com/photo-1614315584058-3bfa462c8c65?auto=format&fit=crop&q=80&w=800'
    });
  }

  getGame(id) {
    return this.games.get(id);
  }

  getAllGames() {
    return Array.from(this.games.values());
  }

  getGamesByCategory(category) {
    return this.getAllGames().filter(game => game.category === category);
  }
  
  getGamesByTier(tier) {
    return this.getAllGames().filter(game => game.tier === tier);
  }
}

export const gameRegistry = new GameRegistry();
