import { Routes, Route } from 'react-router-dom'
import GamePage from './pages/GamePage'

function App() {
  return (
    <div className="bg-slate-950 min-h-screen">
      <Routes>
        <Route path="/" element={<div className="text-white p-8">Home - NicdNicolenium</div>} />
        <Route path="/game/:gameId" element={<GamePage />} />
        <Route path="/games" element={<div className="text-white p-8">Games list coming soon</div>} />
      </Routes>
    </div>
  )
}

export default App
