import GameSetup from '@/components/GameSetup'

export default function TriviaSetupPage() {
  return (
    <GameSetup
      gameId="trivia"
      gameName="Trivia"
      hasAI={false}
      hasOnline={true}
    />
  )
}
