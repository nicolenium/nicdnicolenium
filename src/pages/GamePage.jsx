import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import GenericGamePage from './GenericGamePage'

export default function GamePage() {
  const { gameId } = useParams()
  const [gameStarted, setGameStarted] = useState(false)
  const [gameSettings, setGameSettings] = useState({
    mode: 'computer',
    timeControl: '10+0',
    rated: false,
    agreedToTerms: false
  })

  const gameName = gameId?.charAt(0).toUpperCase() + gameId?.slice(1) || 'Game'

  if (gameStarted) {
    return <GenericGamePage gameId={gameId} settings={gameSettings} />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet><title>{gameName} - Setup</title></Helmet>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">{gameName}</h1>
       
        <div className="space-y-4 mb-6">
          <div>
            <label className="block mb-2">Mode</label>
            <select
              value={gameSettings.mode}
              onChange={(e) => setGameSettings({...gameSettings, mode: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3"
            >
              <option value="computer">vs Computer</option>
              <option value="friend">vs Friend</option>
              <option value="online">Online Match</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Time Control</label>
            <select
              value={gameSettings.timeControl}
              onChange={(e) => setGameSettings({...gameSettings, timeControl: e.target.value})}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3"
            >
              <option value="1+0">1+0 Bullet</option>
              <option value="3+0">3+0 Blitz</option>
              <option value="5+0">5+0 Blitz</option>
              <option value="10+0">10+0 Rapid</option>
              <option value="30+0">30+0 Classical</option>
            </select>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={gameSettings.rated}
              onChange={(e) => setGameSettings({...gameSettings, rated: e.target.checked})}
            />
            Rated Game
          </label>
        </div>

        <div className="border border-slate-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Terms & Conditions</h3>
          <p className="text-sm text-slate-400 mb-4">
            By starting this game, you agree to fair play and our community guidelines.
            No cheating, engine use, or harassment.
          </p>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={gameSettings.agreedToTerms}
              onChange={(e) => setGameSettings({...gameSettings, agreedToTerms: e.target.checked})}
            />
            I agree to the Terms & Conditions
          </label>
        </div>

        <button
          onClick={() => setGameStarted(true)}
          disabled={!gameSettings.agreedToTerms}
          className="w-full bg-indigo-600 py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
        >
          Start Game
        </button>
      </div>
    </div>
  )
}
