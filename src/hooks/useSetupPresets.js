
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useSetupPresets(gameType) {
  const [presets, setPresets] = useState([]);
  const storageKey = `nicd_presets_${gameType}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setPresets(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load presets', e);
    }
  }, [storageKey]);

  const savePreset = (name, config) => {
    if (!name.trim()) {
      toast.error('Preset name cannot be empty.');
      return false;
    }
    
    if (presets.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      toast.error('A preset with this name already exists.');
      return false;
    }

    const newPreset = {
      id: Date.now().toString(),
      name: name.trim(),
      config,
      createdAt: new Date().toISOString()
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    toast.success(`Preset "${name}" saved successfully.`);
    return true;
  };

  const loadPreset = (id) => {
    const preset = presets.find(p => p.id === id);
    if (preset) {
      toast.success(`Loaded preset "${preset.name}".`);
      return preset.config;
    }
    toast.error('Preset not found.');
    return null;
  };

  const deletePreset = (id) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    toast.success('Preset deleted.');
  };

  return {
    presets,
    savePreset,
    loadPreset,
    deletePreset
  };
}
