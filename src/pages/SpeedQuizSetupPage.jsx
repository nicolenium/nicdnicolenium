import GameSetup from '@/components/GameSetup'

export default function SpeedQuizSetupPage() {
  return (
    <GameSetup
      gameId="speed-quiz"
      gameName="Speed Quiz"
      hasAI={false}
      hasOnline={true}
    />
  )
}
