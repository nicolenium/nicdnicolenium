import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Search, Users, Globe, User, Swords, Radio, MessageCircle, Eye, Flame } from 'lucide-react'
import { ALL_GAMES } from '@/config/gamePosterConfig'

const DIFFICULTY_COLORS = {
  Easy: 'text-green-400 bg-green-400/10',
  Medium: 'text-yellow-400 bg-yellow-400/10',
  Hard: 'text-red-400 bg-red-400/10',
  Expert: 'text-purple-400 bg-purple-400/10'
}

export default function GamesHubPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('games')
  const [category, setCategory] = useState('All')

  const categories = ['All', 'Board Games', 'Educational Games', 'Quiz Games', 'Card', 'Puzzle', 'Action', 'Strategy']

  const filteredGames = useMemo(() => {
    return ALL_GAMES.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || game.category === category
      return matchesSearch && matchesCategory
    })
  }, [search, category])

  const handlePlay = (game) => {
    navigate(`/game/${game.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet><title>Games Hub</title></Helmet>
     
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Games Hub</h1>
          <p className="text-slate-400">Play, compete, and have fun</p>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${category === cat ? 'bg-indigo-600' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredGames.map((game) => (
            <div key={game.id} className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 transition hover:border-indigo-500">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={game.image || game.poster} alt={game.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs backdrop-blur-sm">
                  <Globe size={12} className="text-green-400" />
                  <span>{game.online || 0}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold leading-tight">{game.name}</h3>
                  {game.difficulty && (
                    <span className={`rounded px-2 py-0.5 text-xs font-medium ${DIFFICULTY_COLORS[game.difficulty]}`}>
                      {game.difficulty}
                    </span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Users size={14} />{game.players || '1-2'}</span>
                  <span className="flex items-center gap-1">⏱ {game.time || '10m'}</span>
                </div>
                <button
                  onClick={() => handlePlay(game)}
                  className="mt-4 w-full rounded-lg bg-indigo-600 py-2 font-semibold hover:bg-indigo-700 transition"
                >
                  Play
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
