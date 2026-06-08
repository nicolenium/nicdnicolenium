import GameSetup from '@/components/GameSetup'

export default function PronunciationSetupPage() {
  return (
    <GameSetup
      gameId="pronunciation"
      gameName="Pronunciation Master"
      hasAI={false}
      hasOnline={true}
    />
  )
}
