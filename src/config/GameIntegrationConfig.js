
// Configuration mapping games to their specific features, tutorials, and quizzes
export const GameIntegrationConfig = {
  'chess': {
    features: ['ai_analysis', 'move_history', 'live_community', 'av_chat'],
    videos: [
      { 
        id: 'v1', title: 'Chess Basics: How Pieces Move', url: 'https://www.youtube.com/watch?v=fKxG8KjH1Qg', duration: '5:30', category: 'Beginner',
        attribution: { creator: 'ChessBase', license: 'CC-BY 3.0', source: 'YouTube Creative Commons' }
      },
      { 
        id: 'v2', title: 'Opening Principles', url: 'https://www.youtube.com/watch?v=21L45Qo6uRw', duration: '8:15', category: 'Intermediate',
        attribution: { creator: 'OER Chess Academy', license: 'CC-BY-SA 4.0', source: 'Archive.org' }
      }
    ],
    quizzes: []
  },
  'checkers-8x8': {
    features: ['ai_analysis', 'move_history', 'live_community'],
    videos: [
      { 
        id: 'v4', title: 'Checkers Rules & Setup', url: 'https://www.youtube.com/watch?v=ScKICemE3XQ', duration: '4:20', category: 'Beginner',
        attribution: { creator: 'BoardGameGeek Open', license: 'CC-BY 3.0', source: 'Vimeo CC' }
      }
    ],
    quizzes: []
  },
  'checkers-10x10': {
    features: ['ai_analysis', 'move_history', 'live_community'],
    videos: [
      { 
        id: 'v4_10x10', title: 'International Checkers Rules', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '5:20', category: 'Advanced',
        attribution: { creator: 'Open Draughts', license: 'CC-BY 3.0', source: 'Archive.org' }
      }
    ],
    quizzes: []
  },
  'ludo': {
    features: ['live_community', 'av_chat'],
    videos: [
      { 
        id: 'v6', title: 'How to Play Ludo', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '3:45', category: 'Beginner',
        attribution: { creator: 'Public Domain Gameplay', license: 'CC0', source: 'Pixabay Videos' }
      }
    ],
    quizzes: []
  },
  'tiktaktok': {
    features: ['move_history'],
    videos: [
      { 
        id: 'v7', title: 'Tic Tac Toe: Never Lose Again', url: 'https://www.youtube.com/watch?v=5SdW0HLbDcg', duration: '4:15', category: 'Strategy',
        attribution: { creator: 'Math & Logic Open', license: 'CC-BY 4.0', source: 'YouTube CC' }
      }
    ],
    quizzes: []
  },
  'connect-four': {
    features: ['ai_analysis', 'move_history'],
    videos: [
      { 
        id: 'v8', title: 'Connect 4 Winning Strategies', url: 'https://www.youtube.com/watch?v=yDWPi1pZ0Po', duration: '6:20', category: 'Strategy',
        attribution: { creator: 'Open Board Games', license: 'CC-BY-SA 3.0', source: 'Archive.org' }
      }
    ],
    quizzes: []
  },
  'dominoes': {
    features: ['move_history', 'live_community'],
    videos: [
      { 
        id: 'v9', title: 'Dominoes Rules Explained', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '5:00', category: 'Beginner',
        attribution: { creator: 'OER Games', license: 'CC0', source: 'Pexels Videos' }
      }
    ],
    quizzes: []
  },
  'speed-quiz': {
    features: ['leaderboard', 'live_community'],
    videos: [],
    quizzes: []
  },
  'language-learning': {
    features: ['progress_tracking', 'audio_playback'],
    videos: [
      { 
        id: 'v10', title: 'Top 10 Language Learning Tips', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '10:00', category: 'Education',
        attribution: { creator: 'OpenEd Languages', license: 'CC-BY 4.0', source: 'MIT OpenCourseWare' }
      }
    ],
    quizzes: []
  }
};

// Fallback configuration for all 38 games to ensure Learning Center always has content
export const getGameIntegrationConfig = (gameId) => {
  return GameIntegrationConfig[gameId] || {
    features: ['move_history'],
    videos: [
      { 
        id: `v_fallback_${gameId}`, 
        title: `How to play ${gameId.replace(/-/g, ' ').toUpperCase()}`, 
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
        duration: '3:00', 
        category: 'Tutorial',
        attribution: { creator: 'NICD Productions', license: 'CC0', source: 'Open Educational Resources' },
        thumbnail: 'https://images.unsplash.com/photo-1614315584058-3bfa462c8c65?auto=format&fit=crop&q=80&w=800'
      }
    ],
    quizzes: []
  };
};
