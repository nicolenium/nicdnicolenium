
/**
 * Comprehensive Activity Log Recording System
 */

export const ActivityLogManager = {
  TYPES: {
    SYSTEM: 'system',
    GAME_START: 'game_start',
    GAME_END: 'game_end',
    MOVE: 'move',
    CHAT: 'chat',
    ERROR: 'error',
    SETTINGS: 'settings_change'
  },

  /**
   * Creates a standardized activity log entry
   */
  createLog: (type, player, description, metadata = {}) => {
    return {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      type,
      player: player || 'System',
      description,
      metadata
    };
  },

  /**
   * Filters logs by type
   */
  filterLogs: (logs, types = []) => {
    if (!types || types.length === 0) return logs;
    return logs.filter(log => types.includes(log.type));
  },

  /**
   * Export to JSON format for audit/debugging
   */
  exportToJSON: (logs) => {
    return JSON.stringify(logs, null, 2);
  },

  /**
   * Safe persistence to local storage fallback
   */
  saveToLocal: (sessionId, logs) => {
    try {
      localStorage.setItem(`activity_log_${sessionId}`, JSON.stringify(logs));
    } catch (e) {
      console.warn('Failed to save activity log to localStorage', e);
    }
  },

  loadFromLocal: (sessionId) => {
    try {
      const data = localStorage.getItem(`activity_log_${sessionId}`);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }
};
