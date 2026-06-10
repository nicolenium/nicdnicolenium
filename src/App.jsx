import { Routes, Route } from 'react-router-dom'
import GamePage from './pages/GamePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div style={{background:'#020617',minHeight:'100vh',color:'white',padding:'40px'}}>
          <h1 style={{fontSize:'3rem',color:'#818cf8'}}>NicdNicolenium</h1>
          <p>Home Page</p>
        </div>
      }/>
      <Route path="/game/:gameId" element={<GamePage />}/>
    </Routes>
  )
}
