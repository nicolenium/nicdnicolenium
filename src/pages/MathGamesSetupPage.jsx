import GameSetup from '@/components/GameSetup'

export default function MathGamesSetupPage() {
  return (
    <GameSetup
      gameId="math-challenge"
      gameName="Math Challenge"
      hasAI={false}
      hasOnline={true}
    />
  )
}
