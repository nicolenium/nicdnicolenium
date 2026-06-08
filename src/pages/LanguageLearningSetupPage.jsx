import GameSetup from '@/components/GameSetup'

export default function LanguageLearningSetupPage() {
  return (
    <GameSetup
      gameId="language-learning"
      gameName="Languages Learning"
      hasAI={false}
      hasOnline={true}
    />
  )
}
