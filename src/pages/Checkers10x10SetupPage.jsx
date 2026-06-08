import GameSetup from '@/components/GameSetup'

export default function Checkers10x10SetupPage() {
  return (
    <GameSetup
      gameId="checkers-10x10"
      gameName="International Checkers 10x10"
      hasAI={true}
      hasOnline={true}
    />
  )
}
