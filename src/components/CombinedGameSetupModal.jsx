import { useState } from 'react'
import { X, User, Swords, Globe, Clock, Users } from 'lucide-react'

export default function CombinedGameSetupModal({ game, mode, onClose, onStart }) {
  const [timeMode, setTimeMode] = useState('preset')
  const [selectedTime, setSelectedTime] = useState('10+0')
  const [customMinutes, setCustomMinutes] = useState(10)
  const [customIncrement, setCustomIncrement] = useState(0)
  const [rated, setRated] = useState(true)
  const [isPrivate, setIsPrivate] = useState(false)

  const timePresets = [
    { label: '1+0', time: 1, inc: 0 },
    { label: '3+0', time: 3, inc: 0 },
    { label: '3+2', time: 3, inc: 2 },
    { label: '5+0', time: 5, inc: 0 },
    { label: '10+0', time: 10, inc: 0 },
    { label: '15+10', time: 15, inc: 10 },
    { label: '30+0', time: 30, inc: 0 },
  ]

  const handleStart = () => {
    const timeControl = timeMode === 'preset'
      ? selectedTime
      : `${customMinutes}+${customIncrement}`
   
    onStart?.({
      game: game?.id,
      mode,
      timeControl,
      rated,
      isPrivate
    })
    onClose?.()
  }
return (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    onClick={onClose}
  >
    <div
      className="w-full max-w-md rounded-xl bg-slate-900 p-6 text-white shadow-xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Setup: {game?.name}</h2>
        <button onClick={onClose} className="rounded-lg p-1 hover:bg-slate-800">
          <X className="w-5 h-5" />
        </button>
        
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm">
          {mode === 'solo' && <><User size={16} /> Play vs AI</>}
          {mode === 'create' && <><Swords size={16} /> Challenge Friend</>}
          {mode === 'quick' && <><Globe size={16} /> Quick Match Worldwide</>}
        </div>

        {/* Time Control */}
        <div className="mt-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock size={16} /> Time Control
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => setTimeMode('preset')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm ${timeMode === 'preset' ? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              Presets
            </button>
            <button
              onClick={() => setTimeMode('custom')}
              className={`flex-1 rounded-lg px-3 py-2 text-sm ${timeMode === 'custom' ? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              Custom
            </button>
          </div>

          {timeMode === 'preset' ? (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {timePresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setSelectedTime(preset.label)}
                  className={`rounded-lg px-2 py-2 text-sm ${
                    selectedTime === preset.label
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              <div>
                <label className="text-sm text-slate-400">Minutes</label>
                <input
                  type="number"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400">Increment</label>
                <input
                  type="number"
                  value={customIncrement}
                  onChange={(e) => setCustomIncrement(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Options */}
        <div className="mt-6 space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={rated}
              onChange={(e) => setRated(e.target.checked)}
              className="rounded"
            />
            Rated game
          </label>
          {mode === 'create' && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="rounded"
              />
              Private challenge
            </label>
          )}
        </div>

        <button
          onClick={handleStart}
          className="mt-6 w-full rounded-lg bg-green-600 py-3 font-semibold hover:bg-green-700"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}
