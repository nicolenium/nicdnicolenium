
export class GameEngine {
  constructor(gameType, initialState = {}) {
    this.gameType = gameType;
    this.state = {
      status: 'initializing', // initializing, playing, paused, game_over
      turn: 0,
      score: 0,
      scores: [],
      moveHistory: [],
      winner: null,
      ...initialState
    };
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  start() {
    this.setState({ status: 'playing' });
  }

  pause() {
    if (this.state.status === 'playing') {
      this.setState({ status: 'paused' });
    }
  }

  resume() {
    if (this.state.status === 'paused') {
      this.setState({ status: 'playing' });
    }
  }

  recordMove(move, points = 0) {
    const newHistory = [...this.state.moveHistory, { ...move, timestamp: Date.now() }];
    this.setState({
      moveHistory: newHistory,
      score: this.state.score + points
    });
  }

  nextTurn(totalPlayers = 2) {
    this.setState({ turn: (this.state.turn + 1) % totalPlayers });
  }

  endGame(winner = null) {
    this.setState({ status: 'game_over', winner });
  }

  reset(initialState = {}) {
    this.state = {
      status: 'initializing',
      turn: 0,
      score: 0,
      scores: [],
      moveHistory: [],
      winner: null,
      ...initialState
    };
    this.notify();
  }
}

export const createEngine = (gameType, initialState) => new GameEngine(gameType, initialState);
