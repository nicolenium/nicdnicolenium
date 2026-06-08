import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Bot, Users, Globe, Shield, Clock, Trophy } from 'lucide-react'

export default function GameSetup({ gameId, gameName, hasAI = true, hasOnline = true }) {
  const { user } = useAuth()
  const [gameMode, setGameMode] = useState(hasAI ? 'ai' : 'local')
  const [difficulty, setDifficulty] = useState('medium')
  const [timeControl, setTimeControl] = useState('rapid')
  const [privacy, setPrivacy] = useState('public')

  async function handleStartMatch() {
    const matchData = {
      game_id: gameId,
      time_control: timeControl,
      privacy: privacy,
      game_mode: gameMode,
      ai_difficulty: gameMode === 'ai' ? difficulty : null
    }

    if (gameMode === 'online') {
      if (!user) {
        alert('Please log in to play online')
        return
      }
      const { data, error } = await supabase
        .from('matches')
        .insert({ ...matchData, player1_id: user.id, status: 'waiting' })
     
      if (error) return console.error(error)
      // Redirect to /match/${data[0].id} for realtime gameplay
    }
    else if (gameMode === 'ai') {
      // Start local AI game: /play/${gameId}?mode=ai&difficulty=${difficulty}
      window.location.href = `/play/${gameId}?mode=ai&difficulty=${difficulty}&time=${timeControl}`
    }
    else {
      // Local 2-player: /play/${gameId}?mode=local&time=${timeControl}
      window.location.href = `/play/${gameId}?mode=local&time=${timeControl}`
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-2">{gameName}</h2>
      <p className="text-gray-600 mb-8">Configure your match settings before you start.</p>
     
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Game Mode */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Game Mode</h3>
          </div>
         
          <div className="grid sm:grid-cols-3 gap-4">
            {hasAI && (
              <button
                onClick={() => setGameMode('ai')}
                className={`p-4 rounded-lg border-2 text-left transition ${gameMode === 'ai' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
              >
                <Bot className="w-6 h-6 mb-2 text-green-600" />
                <div className="font-semibold">Play vs AI</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Challenge our engine</div>
              </button>
            )}
           
            <button
              onClick={() => setGameMode('local')}
              className={`p-4 rounded-lg border-2 text-left transition ${gameMode === 'local' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
            >
              <Users className="w-6 h-6 mb-2 text-blue-600" />
              <div className="font-semibold">Local Match</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Play with a friend here</div>
            </button>
           
            {hasOnline && (
              <button
                onClick={() => setGameMode('online')}
                className={`p-4 rounded-lg border-2 text-left transition ${gameMode === 'online' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
              >
                <Globe className="w-6 h-6 mb-2 text-purple-600" />
                <div className="font-semibold">Play Online</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Matchmake globally</div>
              </button>
            )}
          </div>

          {gameMode === 'ai' && hasAI && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">AI Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="easy">Easy (Beginner)</option>
                <option value="medium">Medium (Intermediate)</option>
                <option value="hard">Hard (Expert)</option>
                <option value="master">Master (FMJD Level)</option>
              </select>
            </div>
          )}
        </div>

        {/* Match Rules */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Match Rules</h3>
          </div>
         
          <label className="block text-sm font-medium mb-2">Time Control</label>
          <select
            value={timeControl}
            onChange={(e) => setTimeControl(e.target.value)}
            className="w-full p-3 border rounded-lg mb-4 bg-white dark:bg-gray-700"
          >
            <option value="casual">Casual (Unlimited)</option>
            <option value="blitz">Blitz (3 min)</option>
            <option value="rapid">Rapid (10 min)</option>
            <option value="classical">Classical (30 min)</option>
            <option value="custom">Custom Time</option>
          </select>

          {gameMode === 'online' && (
            <>
              <label className="block text-sm font-medium mb-2">Privacy</label>
              <select
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700"
              >
                <option value="public">Public (Live Games)</option>
                <option value="private">Private (Invite Only)</option>
              </select>
            </>
          )}

          <button
            onClick={handleStartMatch}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
          >
            ▶ Start Match
          </button>
        </div>
      </div>
    </div>
  )
}
