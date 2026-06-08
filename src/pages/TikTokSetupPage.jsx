import GameSetup from '@/components/GameSetup'

export default function TikTokSetupPage() {
  return (
    <GameSetup
      gameId="tiktok"
      gameName="TikTok"
      hasAI={true}
      hasOnline={true}
    />
  )
}
