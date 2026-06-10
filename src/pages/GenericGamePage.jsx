import { useParams } from 'react-router-dom'

export default function GenericGamePage({ gameId, settings }) {
  const params = useParams()
  const id = gameId || params.gameId
  const title = id ? id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Game"

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-indigo-400 mb-8">{title}</h1>
       
        <div className="bg-slate-900 rounded-xl border-2 border-slate-800 p-8">
          <h2 className="text-2xl font-bold mb-4">Game Settings</h2>
          <div className="bg-slate-950 rounded-lg p-4 mb-6">
            <pre className="text-sm text-slate-400">
              {JSON.stringify(settings || {
                mode: 'computer',
                timeControl: '10+0',
                rated: false
              }, null, 2)}
            </pre>
          </div>
         
          <p className="text-lg text-slate-300 mb-2">
            Welcome to {title}. The game is ready to play.
          </p>
          <p className="text-slate-500">
            Game engine coming soon...
          </p>
        </div>
      </div>
    </div>
  )
}
