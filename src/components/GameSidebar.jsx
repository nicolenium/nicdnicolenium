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
    onAction?.('share')
  }

  const handleResign = () => {
    if (confirm('Are you sure you want to resign?')) {
      onAction?.('resign')
    }
  }

  const handleUndo = () => {
    onAction?.('undo')
  }

  const toggleMic = () => {
    setMuted(!muted)
    onAction?.('mic',!muted)
  }

  const toggleVideo = () => {
    setVideoOff(!videoOff)
    onAction?.('video',!videoOff)
  }

  const panels = {
    chat: (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
          {chatMessages.map((msg, i) => (
            <div key={i}>
              <span className="font-semibold text-slate-300">{msg.user}: </span>
              <span className="text-slate-400">{msg.text}</span>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-slate-700 flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-slate-800 rounded px-2 py-1 text-sm text-slate-200 outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-3 rounded text-sm"
          >
            Send
          </button>
        </div>
      </div>
    ),
    players: (
      <div className="p-3">
        <div className="flex items-center gap-2 font-semibold mb-3">
          <Users size={16} /> Players
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-300">Player 1</span>
            <span className="text-green-400">{gameState?.player1Time || '10:00'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300">Player 2</span>
            <span className="text-red-400">{gameState?.player2Time || '10:00'}</span>
          </div>
        </div>
      </div>
    ),
    analysis: (
      <div className="p-3">
        <div className="flex items-center gap-2 font-semibold">
          <Crown size={16} /> Game Analysis
        </div>
        {config?.analysis? (
          <div className="mt-3 space-y-3 text-sm text-slate-400">
            <div>Available after game ends.</div>
            <div className="rounded-lg bg-slate-800 p-3">
              <div>• Engine evaluation graph</div>
              <div>• Accuracy %</div>
              <div>• Blunders/Mistakes/Inaccuracies</div>
              <div>• Key moments</div>
            </div>
          </div>
        ) : (
          <div className="mt-3 text-sm text-slate-500">
            Analysis disabled for this match
          </div>
        )}
      </div>
    ),
    settings: (
      <div className="p-3 text-sm">
        <div className="font-semibold">Game Settings</div>
        <div className="mt-3 space-y-2 text-slate-300">
          <div className="flex justify-between">
            <span>Time:</span>
            <span className="text-slate-400">{config?.timeControl || '10+0'}</span>
          </div>
          <div className="flex justify-between">
            <span>Rated:</span>
            <span className="text-slate-400">{config?.rated? 'Yes' : 'No'}</span>
          </div>
          <div className="flex justify-between">
            <span>Variant:</span>
            <span className="text-slate-400">{config?.variant || 'Standard'}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full text-white">
      <div className="flex border-b border-slate-800">
        {[
          { id: 'chat', icon: MessageCircle },
          { id: 'players', icon: Users },
          { id: 'analysis', icon: BarChart3 },
          { id: 'settings', icon: Settings }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={`flex-1 p-3 hover:bg-slate-800 ${
              activePanel === tab.id? 'bg-slate-800 text-blue-400' : 'text-slate-400'
            }`}
          >
            <tab.icon size={18} className="mx-auto" />
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {panels[activePanel]}
      </div>

      <div className="border-t border-slate-800 p-3 grid grid-cols-4 gap-2">
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 p-2 rounded hover:bg-slate-800 text-slate-400"
        >
          <Share2 size={16} />
          <span className="text-xs">Share</span>
        </button>
        <button
          onClick={handleResign}
          className="flex flex-col items-center gap-1 p-2 rounded hover:bg-slate-800 text-slate-400"
        >
          <Flag size={16} />
          <span className="text-xs">Resign</span>
        </button>
        <button
          onClick={handleUndo}
          className="flex flex-col items-center gap-1 p-2 rounded hover:bg-slate-800 text-slate-400"
        >
          <Undo size={16} />
          <span className="text-xs">Undo</span>
        </button>
        <button
          onClick={toggleMic}
          className="flex flex-col items-center gap-1 p-2 rounded hover:bg-slate-800 text-slate-400"
        >
          {muted? <MicOff size={16} /> : <Mic size={16} />}
          <span className="text-xs">Mic</span>
        </button>
      </div>
    </div>
  )
}
