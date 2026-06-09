import { useState } from 'react'
import { MessageCircle, Users, Eye, BarChart3, Share2, Flag, Undo, Mic, MicOff, Video, VideoOff, Settings, Crown } from 'lucide-react'

export default function GameSidebar({ config, gameState, onAction }) {
  const [activePanel, setActivePanel] = useState('chat')
  const [muted, setMuted] = useState(true)
  const [videoOff, setVideoOff] = useState(true)
  const [chatMessages, setChatMessages] = useState([
    { user: 'System', text: 'Game started. Good luck!' }
  ])
  const [chatInput, setChatInput] = useState('')

  const sendMessage = () => {
    if (!chatInput.trim()) return
    setChatMessages([...chatMessages, { user: 'You', text: chatInput }])
    setChatInput('')
    // TODO: Hook to WebSocket/Supabase
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    onAction('share')
  }

  const panels = {
    chat: (
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-800 p-3 font-semibold">Game Chat</div>
        {config?.allowChat ? (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-3 text-sm">
              {chatMessages.map((msg, i) => (
                <div key={i}>
                  <span className={`font-semibold ${msg.user === 'You' ? 'text-indigo-400' : msg.user === 'System' ? 'text-yellow-400' : 'text-orange-400'}`}>{msg.user}:</span> {msg.text}
                </div>
              ))}
            </div>
            <div className="border-t border-slate-800 p-3">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Send message..."
                className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </>
        ) : <div className="p-3 text-sm text-slate-500">Chat disabled for this match</div>}
      </div>
    ),
    spectators: (
      <div className="p-3">
        <div className="font-semibold">Spectators • {gameState?.spectators?.length || 0}</div>
        {config?.allowSpectators ? (
          <div className="mt-3 space-y-2 text-sm">
            {gameState?.spectators?.length ? gameState.spectators.map(u => (
              <div key={u} className="flex items-center gap-2"><Eye size={14} className="text-slate-500" /> {u}</div>
            )) : <div className="text-slate-400">No one is watching yet. Share the game link!</div>}
          </div>
        ) : <div className="mt-3 text-sm text-slate-500">Spectators disabled</div>}
      </div>
    ),
    moves: (
      <div className="flex h-full flex-col">
        <div className="border-b border-slate-800 p-3 font-semibold">Move History</div>
        <div className="flex-1 overflow-y-auto p-2 text-sm">
          {gameState?.moves?.length ? gameState.moves.map((m, i) => (
            <div key={i} className="grid grid-cols-[30px_1fr_1fr] gap-1 rounded px-2 py-1 hover:bg-slate-800">
              <span className="text-slate-500">{i + 1}.</span>
              <span>{m.white || '...'}</span>
              <span>{m.black || ''}</span>
            </div>
          )) : <div className="p-3 text-slate-500">No moves yet</div>}
        </div>
      </div>
    ),
    analysis: (
      <div className="p-3">
        <div className="flex items-center gap-2 font-semibold"><Crown size={16} /> Game Analysis</div>
        {config?.analysis ? (
          <div className="mt-3 space-y-3 text-sm text-slate-400">
            <div>Available after game ends.</div>
            <div className="rounded-lg bg-slate-800 p-3">
              <div>• Engine evaluation graph</div>
              <div>• Accuracy %</div>
              <div>• Blunders/Mistakes/Inaccuracies</div>
              <div>• Key moments</div>
            </div>
          </div>
        ) : <div className="mt-3 text-sm text-slate-500">Analysis disabled for this match</div>}
      </div>
    ),
    settings: (
      <div className="p-3 text-sm">
        <div className="font-semibold">Game Settings</div>
        <div className="mt-3 space-y-2 text-slate-300">
          <div className="flex justify-between"><span>Time:</span> <span className
