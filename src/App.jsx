import React, { Suspense, lazy } from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext.jsx';
import { LanguageProvider } from '@/contexts/LanguageContext.jsx';
import { TimeControlProvider } from '@/contexts/TimeControlContext.jsx';
import { GameConfigProvider } from '@/contexts/GameConfigContext.jsx';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import ErrorBoundary from '@/components/ErrorBoundary.jsx';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute.jsx';
import OnboardingGuard from '@/components/OnboardingGuard.jsx';
import TermsAcceptanceGuard from '@/components/TermsAcceptanceGuard.jsx';
import { Loader2 } from 'lucide-react';

// Import HomePage statically to prevent dynamic import module resolution errors on the root route
import HomePage from '@/pages/HomePage.jsx';

const GameHubPage = lazy(() => import('@/pages/GameHubPage.jsx'));
const LearningCenterPage = lazy(() => import('@/pages/LearningCenterPage.jsx'));
const EducationalLibraryPage = lazy(() => import('@/pages/EducationalLibraryPage.jsx'));
const QuizCenterPage = lazy(() => import('@/pages/QuizCenterPage.jsx'));

const GameSelectionPage = lazy(() => import('@/pages/GameSelectionPage.jsx'));
const GameSetupPage = lazy(() => import('@/pages/GameSetupPage.jsx'));
const ChessSetupPage = lazy(() => import('@/pages/ChessSetupPage.jsx'));
const CheckersSetupPage = lazy(() => import('@/pages/CheckersSetupPage.jsx'));
const Checkers10x10SetupPage = lazy(() => import('@/pages/Checkers10x10SetupPage.jsx'));
const LudoSetupPage = lazy(() => import('@/pages/LudoSetupPage.jsx'));
const DominoSetupPage = lazy(() => import('@/pages/DominoSetupPage.jsx'));
const TikTokSetupPage = lazy(() => import('@/pages/TikTokSetupPage.jsx'));

const HowToLearnPage = lazy(() => import('@/pages/HowToLearnPage.jsx'));
const TermsAndConditionsPage = lazy(() => import('@/pages/TermsAndConditionsPage.jsx'));
const AttributionPage = lazy(() => import('@/pages/AttributionPage.jsx'));
const HostGamePage = lazy(() => import('@/pages/HostGamePage.jsx'));
const JoinGamePage = lazy(() => import('@/pages/JoinGamePage.jsx'));

const LoginPage = lazy(() => import('@/pages/LoginPage.jsx'));
const SignupPage = lazy(() => import('@/pages/SignupPage.jsx'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage.jsx'));
const TournamentsPage = lazy(() => import('@/pages/TournamentsPage.jsx'));
const TournamentPresetsPage = lazy(() => import('@/pages/TournamentPresetsPage.jsx'));
const CommunityPage = lazy(() => import('@/pages/CommunityPage.jsx'));
const ButtonVerificationPage = lazy(() => import('@/pages/ButtonVerificationPage.jsx'));
const PlayerProfilePage = lazy(() => import('@/pages/PlayerProfilePage.jsx'));
const MyAccountPage = lazy(() => import('@/pages/MyAccountPage.jsx'));
const GameHistoryPage = lazy(() => import('@/pages/GameHistoryPage.jsx'));

// Original Board Games
const CheckersGamePage = lazy(() => import('@/pages/CheckersGamePage.jsx'));
const Checkers10x10GamePage = lazy(() => import('@/pages/Checkers10x10GamePage.jsx'));
const ChessGamePage = lazy(() => import('@/pages/ChessGamePage.jsx'));
const LudoGamePage = lazy(() => import('@/pages/LudoGamePage.jsx'));
const TicTacToeGamePage = lazy(() => import('@/pages/TicTacToeGamePage.jsx'));
const DominoesGamePage = lazy(() => import('@/pages/DominoesGamePage.jsx'));
const ConnectFourGamePage = lazy(() => import('@/pages/ConnectFourGamePage.jsx'));

// Educational & Quiz
const MathGamesGamePage = lazy(() => import('@/pages/MathGamesGamePage.jsx'));
const QuizGamesGamePage = lazy(() => import('@/pages/QuizGamesGamePage.jsx'));
const QuizGamesSetupPage = lazy(() => import('@/pages/QuizGamesSetupPage.jsx'));
const PronunciationGamePage = lazy(() => import('@/pages/PronunciationGamePage.jsx'));
const LanguageLearningGamePage = lazy(() => import('@/pages/LanguageLearningGamePage.jsx'));
const SpeedQuizGamePage = lazy(() => import('@/pages/SpeedQuizGamePage.jsx'));
const GeographyQuizGamePage = lazy(() => import('@/pages/GeographyQuizGamePage.jsx'));
const HistoryQuizGamePage = lazy(() => import('@/pages/HistoryQuizGamePage.jsx'));
const ScienceChallengeGamePage = lazy(() => import('@/pages/ScienceChallengeGamePage.jsx'));
const MathPuzzleGamePage = lazy(() => import('@/pages/MathPuzzleGamePage.jsx'));
const LogicPuzzleGamePage = lazy(() => import('@/pages/LogicPuzzleGamePage.jsx'));
const MemoryChallengeGamePage = lazy(() => import('@/pages/MemoryChallengeGamePage.jsx'));
const SpellingBeeGamePage = lazy(() => import('@/pages/SpellingBeeGamePage.jsx'));
const VocabularyBuilderGamePage = lazy(() => import('@/pages/VocabularyBuilderGamePage.jsx'));
const TriviaMasterGamePage = lazy(() => import('@/pages/TriviaMasterGamePage.jsx'));
const BrainTeaserGamePage = lazy(() => import('@/pages/BrainTeaserGamePage.jsx'));

// Action Games
const Game2048Page = lazy(() => import('@/pages/Game2048Page.jsx'));
const FlappyBirdPage = lazy(() => import('@/pages/FlappyBirdPage.jsx'));
const SnakePage = lazy(() => import('@/pages/SnakePage.jsx'));
const PacManPage = lazy(() => import('@/pages/PacManPage.jsx'));
const BreakoutPage = lazy(() => import('@/pages/BreakoutPage.jsx'));

// Generic Game Template for missing games
const GenericGamePage = lazy(() => import('@/pages/GenericGamePage.jsx'));

// Admin Pages
const AdminLoginPage = lazy(() => import('@/pages/AdminLoginPage.jsx'));
const AdminLayout = lazy(() => import('@/pages/AdminLayout.jsx'));
const AdminDashboardHome = lazy(() => import('@/pages/AdminDashboardHome.jsx'));
const AdminProfilePage = lazy(() => import('@/pages/AdminProfilePage.jsx'));
const AdminSettingsPage = lazy(() => import('@/pages/AdminSettingsPage.jsx'));
const AdminActivityLogPage = lazy(() => import('@/pages/AdminActivityLogPage.jsx'));
const AdminAboutPage = lazy(() => import('@/pages/AdminAboutPage.jsx'));

// New Consolidated Admin Pages
const AdminTournamentManagement = lazy(() => import('@/pages/AdminTournamentManagement.jsx'));
const AdminUserManagement = lazy(() => import('@/pages/AdminUserManagement.jsx'));
const AdminGameManagement = lazy(() => import('@/pages/AdminGameManagement.jsx'));
const AdminReportsAnalytics = lazy(() => import('@/pages/AdminReportsAnalytics.jsx'));
const ComprehensiveWebsiteErrorReview = lazy(() => import('@/pages/ComprehensiveWebsiteErrorReview.jsx'));

// AI & System Debug
const AiDebugPanel = lazy(() => import('@/admin/AiDebugPanel.jsx'));
const GameTestSuite = lazy(() => import('@/admin/GameTestSuite.jsx'));
const AdminSystemPage = lazy(() => import('@/admin/AdminSystemPage.jsx'));

// Quick Access Targets
const MatchManagement = lazy(() => import('@/pages/MatchManagement.jsx'));
const ResultsManagement = lazy(() => import('@/pages/ResultsManagement.jsx'));
const LeaderboardManagement = lazy(() => import('@/pages/LeaderboardManagement.jsx'));
const SponsorshipManagement = lazy(() => import('@/pages/SponsorshipManagement.jsx'));
const MediaManagement = lazy(() => import('@/pages/MediaManagement.jsx'));

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground text-center px-4">
    <h1 className="text-6xl font-black text-primary mb-4">404</h1>
    <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
    <p className="text-muted-foreground mb-8">The page you are looking for does not exist or has been moved.</p>
    <a href="/" className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-colors">
      Back to Home
    </a>
  </div>
);

const LoadingFallback = () => (
  <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] bg-background">
    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
    <p className="text-muted-foreground font-medium animate-pulse">Loading content...</p>
  </div>
);

// Wrapper for all interactive games to ensure Onboarding and Terms are checked
const GameGuard = ({ children }) => (
  <OnboardingGuard>
    <TermsAcceptanceGuard>
      {children}
    </TermsAcceptanceGuard>
  </OnboardingGuard>
);

const AppContent = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground font-sans bg-background">
      <ScrollToTop />
      <main className="flex-1 flex flex-col w-full relative min-h-0">
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Main App Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<GameHubPage />} />
              <Route path="/games-hub" element={<Navigate to="/games" replace />} />
              <Route path="/library" element={<Navigate to="/educational-library" replace />} />
              <Route path="/educational-library" element={<EducationalLibraryPage />} />
              <Route path="/learning" element={<LearningCenterPage />} />
              <Route path="/quizzes" element={<QuizCenterPage />} />
              
              <Route path="/how-to-learn" element={<HowToLearnPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
              <Route path="/privacy" element={<Navigate to="/terms-and-conditions" replace />} />
              <Route path="/rules" element={<Navigate to="/terms-and-conditions" replace />} />
              <Route path="/attribution" element={<AttributionPage />} />
              <Route path="/contact" element={<Navigate to="/" replace />} />
              <Route path="/verify-buttons" element={<ButtonVerificationPage />} />
              
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<PlayerProfilePage />} />
              <Route path="/account" element={<MyAccountPage />} />
              <Route path="/history" element={<GameHistoryPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/tournaments" element={<TournamentsPage />} />
              <Route path="/tournaments/presets" element={<TournamentPresetsPage />} />
              <Route path="/community" element={<CommunityPage />} />

              {/* Game Setup Routes */}
              <Route path="/game-setup" element={<GameSetupPage />} />
              <Route path="/chess-setup" element={<ChessSetupPage />} />
              <Route path="/checkers-setup" element={<CheckersSetupPage />} />
              <Route path="/checkers-10x10-setup" element={<Checkers10x10SetupPage />} />
              <Route path="/ludo-setup" element={<LudoSetupPage />} />
              <Route path="/dominoes-setup" element={<DominoSetupPage />} />
              <Route path="/quiz-games-setup" element={<QuizGamesSetupPage />} />
              <Route path="/tiktaktok-setup" element={<TikTokSetupPage />} />

              <Route path="/host-game" element={<HostGamePage />} />
              <Route path="/join-game" element={<JoinGamePage />} />

              {/* Specific Games */}
              <Route path="/chess-game" element={<GameGuard><ChessGamePage /></GameGuard>} />
              <Route path="/chess" element={<Navigate to="/chess-game" replace />} />
              
              <Route path="/checkers-8x8" element={<GameGuard><CheckersGamePage /></GameGuard>} />
              <Route path="/checkers" element={<Navigate to="/checkers-8x8" replace />} />
              
              <Route path="/checkers-10x10" element={<GameGuard><Checkers10x10GamePage /></GameGuard>} />
              
              <Route path="/ludo-game" element={<GameGuard><LudoGamePage /></GameGuard>} />
              <Route path="/ludo" element={<Navigate to="/ludo-game" replace />} />
              
              <Route path="/tiktaktok" element={<GameGuard><TicTacToeGamePage /></GameGuard>} />
              <Route path="/connect-four" element={<GameGuard><ConnectFourGamePage /></GameGuard>} />
              <Route path="/dominoes" element={<GameGuard><DominoesGamePage /></GameGuard>} />
              
              {/* Quiz Games using specific template wrappers */}
              <Route path="/geography-quiz" element={<GameGuard><GeographyQuizGamePage /></GameGuard>} />
              <Route path="/history-quiz" element={<GameGuard><HistoryQuizGamePage /></GameGuard>} />
              <Route path="/science-challenge" element={<GameGuard><ScienceChallengeGamePage /></GameGuard>} />
              <Route path="/math-puzzle" element={<GameGuard><MathPuzzleGamePage /></GameGuard>} />

              <Route path="/speed-quiz" element={<GameGuard><SpeedQuizGamePage /></GameGuard>} />
              <Route path="/knowledge-quizzes" element={<GameGuard><GenericGamePage gameId="knowledge-quizzes" /></GameGuard>} />
              <Route path="/quiz-games" element={<Navigate to="/knowledge-quizzes" replace />} />
              
              {/* Educational Games */}
              <Route path="/language-learning" element={<GameGuard><LanguageLearningGamePage /></GameGuard>} />
              <Route path="/trivia-master" element={<GameGuard><TriviaMasterGamePage /></GameGuard>} />
              <Route path="/spelling-bee" element={<GameGuard><SpellingBeeGamePage /></GameGuard>} />
              <Route path="/vocabulary-builder" element={<GameGuard><VocabularyBuilderGamePage /></GameGuard>} />

              {/* Puzzle Games */}
              <Route path="/memory-challenge" element={<GameGuard><MemoryChallengeGamePage /></GameGuard>} />
              <Route path="/logic-puzzle" element={<GameGuard><LogicPuzzleGamePage /></GameGuard>} />
              <Route path="/brain-teaser" element={<GameGuard><BrainTeaserGamePage /></GameGuard>} />
              
              {/* Action Games */}
              <Route path="/game-2048" element={<GameGuard><Game2048Page /></GameGuard>} />
              <Route path="/flappy-bird" element={<GameGuard><FlappyBirdPage /></GameGuard>} />
              <Route path="/snake" element={<GameGuard><SnakePage /></GameGuard>} />
              <Route path="/pacman" element={<GameGuard><PacManPage /></GameGuard>} />
              <Route path="/breakout" element={<GameGuard><BreakoutPage /></GameGuard>} />

              {/* Catch-all for generic mapped games from config (covers Sudoku, Crossword, etc.) */}
              <Route path="/:gameId" element={<GameGuard><GenericGamePage gameId={window.location.pathname.substring(1)} /></GameGuard>} />

              {/* Admin Portal Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              
              {/* Protected Admin Shell */}
              <Route path="/admin" element={<ProtectedAdminRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminDashboardHome />} />
                  <Route path="dashboard" element={<AdminDashboardHome />} />
                  <Route path="activity" element={<AdminActivityLogPage />} />
                  <Route path="about" element={<AdminAboutPage />} />
                  
                  {/* Management & Features */}
                  <Route path="users" element={<AdminUserManagement />} />
                  <Route path="tournaments" element={<AdminTournamentManagement />} />
                  <Route path="matches" element={<MatchManagement />} />
                  <Route path="results" element={<ResultsManagement />} />
                  <Route path="leaderboard" element={<LeaderboardManagement />} />
                  <Route path="games" element={<AdminGameManagement />} />
                  <Route path="sponsorship" element={<SponsorshipManagement />} />
                  <Route path="media" element={<MediaManagement />} />
                  <Route path="reports" element={<AdminReportsAnalytics />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                  <Route path="error-review" element={<ComprehensiveWebsiteErrorReview />} />
                  <Route path="profile" element={<AdminProfilePage />} />
                  
                  {/* AI & System Monitoring */}
                  <Route path="ai-debug" element={<AiDebugPanel />} />
                  <Route path="test" element={<GameTestSuite />} />
                  <Route path="system" element={<AdminSystemPage />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Toaster toastOptions={{ className: 'bg-card text-foreground border-border font-bold' }} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <GameConfigProvider>
              <TimeControlProvider>
                <AppContent />
              </TimeControlProvider>
            </GameConfigProvider>
          </AdminAuthProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;