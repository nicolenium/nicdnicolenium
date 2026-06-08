import GameSetup from '@/components/GameSetup'

export default function ConnectFourSetupPage() {
  return (
    <GameSetup
      gameId="connect-four"
      gameName="Connect Four"
      hasAI={true}
      hasOnline={true}
    />
  )
}
