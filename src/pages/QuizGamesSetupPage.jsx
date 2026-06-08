import GameSetup from '@/components/GameSetup'

export default function QuizGamesSetupPage() {
  return (
    <GameSetup
      gameId="quiz-games"
      gameName="Quiz Games"
      hasAI={false}
      hasOnline={true}
    />
  )
}
