import { Routes, Route } from 'react-router-dom'
import GamesHubPage from './pages/GamesHubPage'
import GamePage from './pages/GamePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GamesHubPage />} />
      <Route path="/games" element={<GamesHubPage />} />
      <Route path="/game/:gameId" element={<GamePage />} />
    </Routes>
  )
}
