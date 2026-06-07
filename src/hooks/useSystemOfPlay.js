
import { useState, useCallback, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';
import { systemOfPlayPresetsData } from '@/utils/systemOfPlayPresetsData.js';
import { toast } from 'sonner';

export function useSystemOfPlay() {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPresets = useCallback(async () => {
    try {
      setLoading(true);
      const records = await pb.collection('game_presets').getFullList({ $autoCancel: false });
      
      const merged = systemOfPlayPresetsData.map(localGame => {
        const dbRecord = records.find(r => r.gameName === localGame.gameName);
        return {
          ...localGame,
          id: dbRecord?.id || null, 
          selectedVariant: dbRecord?.selectedVariant || null,
          rules: dbRecord?.rules || null,
          regulations: dbRecord?.regulations || null,
          matchFormat: dbRecord?.matchFormat || null
        };
      });
      setPresets(merged);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load system of play presets from database');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  const savePreset = async (gameName, config) => {
    try {
      const localGame = systemOfPlayPresetsData.find(g => g.gameName === gameName);
      if (!localGame) throw new Error('Game definition not found');

      const existingRecordId = presets.find(p => p.gameName === gameName)?.id;
      
      const payload = {
        gameId: gameName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        gameName: gameName,
        selectedVariant: config.selectedVariant,
        rules: config.rules,
        regulations: config.regulations,
        matchFormat: config.matchFormat
      };

      if (existingRecordId) {
        await pb.collection('game_presets').update(existingRecordId, payload, { $autoCancel: false });
      } else {
        await pb.collection('game_presets').create(payload, { $autoCancel: false });
      }
      
      await fetchPresets(); 
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return { presets, loading, fetchPresets, savePreset };
}
