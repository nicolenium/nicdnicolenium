import GameSetup from '@/components/GameSetup'

export default function CheckersSetupPage() {
  return (
    <GameSetup
      gameId="checkers-8x8"
      gameName="Checkers 8x8"
      hasAI={true}
      hasOnline={true}
    />
  )
}
