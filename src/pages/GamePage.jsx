import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Clock, Swords, Globe, User, X, Shield } from 'lucide-react'

import ChessGame from '../games/ChessGame'
import CheckersGame from '../games/CheckersGame'

const GAMES = {
  chess: { component: ChessGame, name: 'Chess' },
  checkers: { component: CheckersGame, name: 'Checkers' },
}

export default function GamePage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [setupComplete, setSetupComplete] = useState(false)
  const [mode, setMode] = useState('solo')
  const [timeControl, setTimeControl] = useState('10+0')
  const [rated, setRated] = useState(true)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const game = GAMES[gameId]
  if (!game) return <div className="min-h-screen bg-slate-950 text-white p-8">Game not found</div>
  const GameComponent = game.component

  if (!setupComplete) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">{game.name}</h1>
            <button onClick={() => navigate('/games')} className="p-2 hover:bg-slate-800 rounded-lg">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 mb-4">
            <h2 className="text-lg font-semibold mb-4">Game Mode</h2>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => setMode('solo')} className={`p-4 rounded-lg flex flex-col items-center gap-2 ${mode === 'solo'? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
                <User className="w-6 h-6" /> vs AI
              </button>
              <button onClick={() => setMode('create')} className={`p-4 rounded-lg flex flex-col items-center gap-2 ${mode === 'create'? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
                <Swords className="w-6 h-6" /> Challenge
              </button>
              <button onClick={() => setMode('quick')} className={`p-4 rounded-lg flex flex-col items-center gap-2 ${mode === 'quick'? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
                <Globe className="w-6 h-6" /> Quick Match
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Time Control</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {['1+0', '3+0', '3+2', '5+0', '10+0', '15+10'].map(tc => (
                <button key={tc} onClick={() => setTimeControl(tc)} className={`py-3 rounded-lg ${timeControl === tc? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'}`}>
                  {tc}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={rated} onChange={e => setRated(e.target.checked)} className="w-5 h-5" />
              <span>Rated game</span>
            </label>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Terms & Conditions</h2>
            </div>
            <div className="h-32 overflow-y-auto text-sm text-slate-400 mb-4 p-3 bg-slate-800 rounded-lg">
              <p>1. Fair Play: No cheating, engine use, or external assistance.</p>
              <p className="mt-2">2. Conduct: No harassment, hate speech, or abusive behavior.</p>
              <p className="mt-2">3. Accounts: Violations may result in suspension or ban.</p>
              <p className="mt-2">4. Data: All games are logged and may be reviewed.</p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptedTerms} onChange={e => setAcceptedTerms(e.target.checked)} className="w-5 h-5" />
              <span>I accept the Terms & Conditions</span>
            </label>
          </div>

          <button
            onClick={() => setSetupComplete(true)}
            disabled={!acceptedTerms}
            className="w-full py-4 rounded-lg bg-green-600 font-bold text-lg hover:bg-green-700 disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            Start Game
          </button>
        </div>
      </div>
    )
  }

  return <GameComponent mode={mode} timeControl={timeControl} rated={rated} />
}
