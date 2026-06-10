import { Routes, Route } from 'react-router-dom'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={
        <div style={{background:'#020617',minHeight:'100vh',color:'white',padding:'40px'}}>
          <h1 style={{fontSize:'3rem',color:'#818cf8'}}>NicdNicolenium</h1>
          <p>Home works. Game coming soon.</p>
        </div>
      }/>
      <Route path="/game/:gameId" element={
        <div style={{background:'#020617',minHeight:'100vh',color:'white',padding:'40px'}}>
          <h1 style={{fontSize:'3rem',color:'#818cf8'}}>Chess</h1>
          <p>Game page works. Engine coming soon.</p>
        </div>
      }/>
    </Routes>
  )
}
