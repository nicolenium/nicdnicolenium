
/**
 * Comprehensive Move History Recording System
 */

export const MoveHistoryManager = {
  /**
   * Creates a standardized move record
   */
  createMoveRecord: (moveData) => {
    return {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      moveNumber: moveData.moveNumber || 1,
      notation: moveData.notation || 'Unknown',
      player: moveData.player || 'System',
      timeSpent: moveData.timeSpent || 0,
      evalScore: moveData.evalScore !== undefined ? moveData.evalScore : null,
      consequences: {
        isCapture: !!moveData.isCapture || moveData.notation.includes('x'),
        isCheck: !!moveData.isCheck || moveData.notation.includes('+'),
        isCheckmate: !!moveData.isCheckmate || moveData.notation.includes('#'),
        isPromotion: !!moveData.isPromotion || moveData.notation.includes('='),
        isDraw: !!moveData.isDraw
      },
      rawMove: moveData.rawMove || null
    };
  },

  /**
   * Validates if a move is within the list of legally generated moves
   */
  validateMove: (proposedMove, validMoves, matchFn) => {
    if (!validMoves || validMoves.length === 0) return false;
    
    if (matchFn) {
      return validMoves.some(vm => matchFn(vm, proposedMove));
    }

    return validMoves.some(vm => JSON.stringify(vm) === JSON.stringify(proposedMove));
  },

  /**
   * Exports history to CSV
   */
  exportToCSV: (history, gameType) => {
    if (!history || history.length === 0) return null;
    
    const headers = ['Move Number', 'Time', 'Player', 'Notation', 'Capture', 'Check/Mate'];
    const rows = history.map(h => [
      h.moveNumber,
      new Date(h.timestamp).toLocaleTimeString(),
      `"${h.player}"`,
      `"${h.notation}"`,
      h.consequences?.isCapture ? 'Yes' : 'No',
      h.consequences?.isCheckmate ? 'Mate' : (h.consequences?.isCheck ? 'Check' : 'No')
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
};
