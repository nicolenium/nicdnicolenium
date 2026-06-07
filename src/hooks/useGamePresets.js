
import { useState, useCallback, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { gamePresetsData } from '@/utils/gamePresetsData.js';
import { toast } from 'sonner';

export function useGamePresets() {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGamePresets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const records = await pb.collection('game_presets').getFullList({
        sort: 'gameName',
        $autoCancel: false,
      });
      
      // Merge DB records with local static preset rules
      const merged = records.map(record => {
        const localData = gamePresetsData.find(d => d.gameName === record.gameName);
        return {
          ...record,
          availablePresets: localData ? localData.presets : []
        };
      });
      
      setPresets(merged);
    } catch (err) {
      console.error("Error fetching game presets:", err);
      setError(err.message || "Failed to load game presets");
      toast.error("Failed to load game presets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGamePresets();
  }, [fetchGamePresets]);

  const loadPresetRules = useCallback((gameName, presetName) => {
    const game = gamePresetsData.find(g => g.gameName === gameName);
    if (!game) return null;
    const preset = game.presets.find(p => p.presetName === presetName);
    return preset ? preset.rules : null;
  }, []);

  const updateGamePreset = async (id, config) => {
    try {
      const data = {
        selectedPreset: config.selectedPreset,
        entryFee: config.entryFee,
        prizeAmount: config.prizeAmount,
        timeLimit: config.timeLimit,
        rules: config.rules // Saved as JSON object
      };

      const updatedRecord = await pb.collection('game_presets').update(id, data, {
        $autoCancel: false
      });

      // Update local state
      setPresets(prev => prev.map(p => p.id === id ? { ...p, ...updatedRecord } : p));
      return updatedRecord;
    } catch (err) {
      console.error("Error updating preset:", err);
      throw err;
    }
  };

  return {
    presets,
    loading,
    error,
    fetchGamePresets,
    updateGamePreset,
    loadPresetRules
  };
}
