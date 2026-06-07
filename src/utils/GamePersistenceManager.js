
export const GamePersistenceManager = {
  saveLocal: (sessionId, data) => {
    if (!sessionId) return;
    try {
      localStorage.setItem(`game_state_${sessionId}`, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  },

  loadLocal: (sessionId) => {
    if (!sessionId) return null;
    try {
      const item = localStorage.getItem(`game_state_${sessionId}`);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error("Failed to load from local storage", e);
      return null;
    }
  },

  clearLocal: (sessionId) => {
    if (!sessionId) return;
    localStorage.removeItem(`game_state_${sessionId}`);
  },

  // Auto-save via beforeunload
  registerUnloadSave: (sessionId, getStateCallback) => {
    const handler = () => {
      const state = getStateCallback();
      if (state && sessionId) {
        GamePersistenceManager.saveLocal(sessionId, state);
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }
};
