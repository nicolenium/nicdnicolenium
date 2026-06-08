import GameSetup from '@/components/GameSetup'

export default function ChessSetupPage() {
  return (
    <GameSetup
      gameId="chess"
      gameName="Chess"
      hasAI={true}
      hasOnline={true}
    />
  )
}
