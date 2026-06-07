
const VISITOR_PLAYS_KEY = 'nicd_visitor_plays';
export const FREE_PLAYS_LIMIT = 2;

export const VisitorAccessManager = {
  getPlaysData: () => {
    try {
      const data = localStorage.getItem(VISITOR_PLAYS_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  },

  getPlaysCount: (gameId) => {
    const data = VisitorAccessManager.getPlaysData();
    return data[gameId] || 0;
  },

  getRemainingPlays: (gameId) => {
    const count = VisitorAccessManager.getPlaysCount(gameId);
    return Math.max(0, FREE_PLAYS_LIMIT - count);
  },

  hasAccess: (gameId) => {
    return VisitorAccessManager.getPlaysCount(gameId) < FREE_PLAYS_LIMIT;
  },

  incrementPlay: (gameId) => {
    const data = VisitorAccessManager.getPlaysData();
    const current = data[gameId] || 0;
    data[gameId] = current + 1;
    localStorage.setItem(VISITOR_PLAYS_KEY, JSON.stringify(data));
    return data[gameId];
  }
};
