import GameSetup from '@/components/GameSetup'

export default function DominoSetupPage() {
  return (
    <GameSetup
      gameId="dominoes"
      gameName="Dominoes"
      hasAI={true}
      hasOnline={true}
    />
  )
}
