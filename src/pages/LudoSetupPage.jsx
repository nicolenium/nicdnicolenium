import GameSetup from '@/components/GameSetup'

export default function LudoSetupPage() {
  return (
    <GameSetup 
      gameId="ludo"
      gameName="Ludo"
      hasAI={true}
      hasOnline={true}
    />
  )
}
