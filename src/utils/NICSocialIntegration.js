
export const generateShareLink = (gameId) => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/live-games/${gameId}`;
};

export const getSocialShareUrl = (platform, gameLink) => {
  const text = encodeURIComponent("Watch my live game on NICD NICOLENIUM!");
  const url = encodeURIComponent(gameLink);
  
  switch (platform) {
    case 'twitter':
      return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case 'linkedin':
      return `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;
    default:
      return gameLink;
  }
};

export const initiatePeerConnection = (peerId) => {
  console.log(`Initiating WebRTC connection with ${peerId}`);
  // Placeholder for actual WebRTC implementation
  return new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });
};

export const subscribeToLiveUpdates = (gameId, callback) => {
  console.log(`Subscribing to live updates for game ${gameId}`);
  // Placeholder for actual subscription logic
  return () => console.log(`Unsubscribed from ${gameId}`);
};
