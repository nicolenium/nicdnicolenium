import { useState, useMemo, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Search, Users, Globe, User, Swords, Radio, MessageCircle, Eye, Flame } from 'lucide-react'
import CombinedGameSetupModal from '@/components/CombinedGameSetupModal'
import { ALL_GAMES } from '@/config/gamePosterConfig'

const LIVE_ROOMS = [
  { id: 'r1', game: 'Master Chess', host: 'MagnusJr', players: '1/2', skill: 'Expert', viewers: 23, isLive: true },
  { id: 'r2', game: 'Classic Ludo', host: 'FamilyNight', players: '3/4', skill: 'Casual', viewers: 8, isLive: true },
  { id: 'r3', game: 'Dominoes Pro', host: 'TileKing', players: '2/4', skill: 'Ranked', viewers: 45, isLive: true },
]

const COMMUNITY_FEED = [
  { id: 1, user: 'ProGamer22', action: 'just won a ranked Chess match', time: '2m ago', type: 'win' },
  { id: 2, user: 'BoardQueen', action: 'is looking for Ludo players', time: '5m ago', type: 'lfg' },
  { id: 3, user: 'CasualMike', action: 'created a Dominoes tournament', time: '12m ago', type: 'event' },
]

const DIFFICULTY_COLORS = {
  Easy: 'text-green-400 bg-green-400/10',
  Medium: 'text-yellow-400 bg-yellow-400/10',
  Hard: 'text-red-400 bg-red-400/10',
  Expert: 'text-purple-400 bg-purple-400/10'
}

export default function GamesHubPage() {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('games')
  const [category, setCategory] = useState('All')
  const [onlineCount, setOnlineCount] = useState(2847)
  const [showModal, setShowModal] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedMode, setSelectedMode] = useState('solo')

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => prev + Math.floor(Math.random() * 10 - 5))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const categories = ['All', 'Board Games', 'Educational Games', 'Quiz Games', 'Card', 'Puzzle', 'Action', 'Strategy']
 
  const filteredGames = useMemo(() => {
    return ALL_GAMES.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'All' || game.category === category
      return matchesSearch && matchesCategory
    })
  }, [search, category])

  const handlePlay = (game, mode) => {
    setSelectedGame(game)
    setSelectedMode(mode)
    setShowModal(true)
  }
const handleStartGame = (config) => {
  // 1. Make sure we know which game was picked
  if (!selectedGame || !selectedGame.id) {
    console.error('No game selected:', selectedGame);
    alert('Error: No game selected. Pick a game first.');
    return;
  }
 
  // 2. Build the URL with all the settings from the modal
  const params = new URLSearchParams({
    time: config.timeControl,
    mode: config.mode,
    rated: config.rated,
    allowUndo: config.allowUndo,
    allowChat: config.allowChat,
    allowSpectators: config.allowSpectators,
    voiceChat: config.voiceChat,
    analysis: config.analysis,
    aiDifficulty: config.aiDifficulty,
    boardTheme: config.boardTheme,
    pieceStyle: config.pieceStyle
  })
 
  // 3. Debug logs so you can see what happens
  console.log('Starting game:', selectedGame.id, 'with config:', config);
  console.log('Redirecting to:', `/play/${selectedGame.id}?${params.toString()}`);
 
  // 4. Actually go to the game page
  window.location.href = `/play/${selectedGame.id}?${params.toString()}`
}


  

  const handleJoinRoom = (roomId) => {
    window.location.href = `/room/${roomId}`
  }

  return (
    <>
      <Helmet>
        <title>Game Hub - NicdNicolenium</title>
      </Helmet>
     
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
        <div className="border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Game Hub</h1>
                <div className="mt-2 flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    {onlineCount.toLocaleString()} players online
                  </span>
                  <span className="flex items-center gap-1.5"><Radio size={14} className="text-red-500" /> {LIVE_ROOMS.length} live matches</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-1 border-b border-slate-800">
              {[
                { id: 'games', label: 'All Games', icon: Swords },
                { id: 'rooms', label: 'Live Rooms', icon: Radio, badge: LIVE_ROOMS.length },
                { id: 'community', label: 'Community', icon: MessageCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
                    activeTab === tab.id? 'border-indigo-500 text-white' : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                  {tab.badge && <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white">{tab.badge}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {activeTab === 'games' && (
            <>
              <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text"
                    placeholder="Search 50+ games..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2.5 pl-10 pr-4 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="mb-8 flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                      category === cat? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {activeTab === 'games' && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredGames.map((game) => (
                  <div key={game.id} className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 transition-all hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={game.image || game.poster} alt={game.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                      <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs backdrop-blur">
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
                      <div className="mt-4 grid grid-cols-3 gap-2 opacity-0 transition group-hover:opacity-100">
                        <button onClick={() => handlePlay(game, 'solo')} className="flex items-center justify-center gap-1 rounded-md bg-slate-800 py-2 text-xs font-medium hover:bg-slate-700" title="Play Solo vs AI">
                          <User size={14} />
                        </button>
                        <button onClick={() => handlePlay(game, 'create')} className="flex items-center justify-center gap-1 rounded-md bg-slate-800 py-2 text-xs font-medium hover:bg-slate-700" title="Challenge Friend">
                          <Swords size={14} />
                        </button>
                        <button onClick={() => handlePlay(game, 'quick')} className="flex items-center justify-center gap-1 rounded-md bg-indigo-600 py-2 text-xs font-medium hover:bg-indigo-500" title="Quick Match">
                          <Globe size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Live Game Rooms</h2>
              {LIVE_ROOMS.map((room) => (
                <div key={room.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-indigo-500/50 transition">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-800"><Swords size={20} /></div>
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500"><Radio size={10} /></span>
                    </div>
                    <div>
                      <div className="font-semibold">{room.game}</div>
                      <div className="text-sm text-slate-400">Hosted by {room.host} • {room.skill}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-1 text-slate-300"><Users size={14} /> {room.players}</div>
                      <div className="flex items-center gap-1 text-slate-500"><Eye size={14} /> {room.viewers} watching</div>
                    </div>
                    <button onClick={() => handleJoinRoom(room.id)} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold hover:bg-indigo-500 transition">
                      Join Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'community' && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold">Community Feed</h2>
                {COMMUNITY_FEED.map((post) => (
                  <div key={post.id} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 font-semibold">{post.user[0]}</div>
                      <div className="flex-1">
                        <div><span className="font-semibold">{post.user}</span><span className="text-slate-400"> {post.action}</span></div>
                        <div className="mt-1 text-xs text-slate-500">{post.time}</div>
                      </div>
                      {post.type === 'lfg' && <button className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium hover:bg-slate-700">Join</button>}
                    </div>
                  </div>
                ))}
              </div>
             
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <h3 className="mb-3 flex items-center gap-2 font-semibold"><Flame size={18} className="text-orange-500" /> Hot Right Now</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>Classic Ludo</span><span className="text-green-400">891 online</span></div>
                    <div className="flex justify-between"><span>Master Chess</span><span className="text-green-400">342 online</span></div>
                    <div className="flex justify-between"><span>Dominoes Pro</span><span className="text-green-400">204 online</span></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
        {showModal && (
          <CombinedGameSetupModal
            game={selectedGame}
            mode={selectedMode}
            onClose={() => setShowModal(false)}
            onStartGame={handleStartGame}
          />
        )}
      </div>
    </>
  )
}
