import { useState } from 'react'
import { X, Clock, User, Swords, Globe, Settings, Volume2, Share2, MessageCircle, Eye, Undo, Flag, Bot, Palette, Crown, Trophy } from 'lucide-react'

export default function CombinedGameSetupModal({ game, mode, onClose, onStartGame }) {
  const [timeMode, setTimeMode] = useState('preset') // preset | custom
  const [presetTime, setPresetTime] = useState('10+0') // 10min + 0s increment
  const [customTime, setCustomTime] = useState({ hr: 0, min: 10, sec: 0, inc: 0 })
  const [options, setOptions] = useState({
    rated: true,
    allowUndo: false,
    allowSpectators: true,
    allowChat: true,
    sound: true,
    aiDifficulty: 'Pro',
    boardTheme: 'Classic',
    pieceStyle: '3D',
    tournament: false,
    voiceChat: true,
    analysis: true,
    preMoves: true
  })

  const presetTimes = [
    { label: 'Bullet', value: '1+0' },
    { label: 'Blitz', value: '3+2' },
    { label: 'Rapid', value: '10+0' },
    { label: 'Classic', value: '30+0' },
    { label: 'Marathon', value: '90+30' }
  ]

  const getFinalTime = () => {
    if (timeMode === 'preset') return presetTime
    const { hr, min, sec, inc } = customTime
    const totalMin = hr * 60 + min + sec / 60
    return `${totalMin}+${inc}`
  }

  const handleStart = () => {
    const config = {
      gameId: game?.id,
      mode, // solo | create | quick
      timeControl: getFinalTime(),
    ...options
    }
    onStartGame(config)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Setup: {game?.name}</h2>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-800"><X size={20} /></button>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm">
          {mode === 'solo' && <><User size={16} /> Play vs AI</>}
          {mode === 'create' && <><Swords size={16} /> Challenge Friend</>}
          {mode === 'quick' && <><Globe size={16} /> Quick Match Worldwide</>}
        </div>

        {/* Time Control */}
        <div className="mt-6">
          <div className="flex items-center gap-2 text-sm font-medium"><Clock size={16} /> Time Control</div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setTimeMode('preset')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm ${timeMode === 'preset'? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              Presets
            </button>
            <button
