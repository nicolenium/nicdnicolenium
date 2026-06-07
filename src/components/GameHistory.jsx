
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { History, Image as ImageIcon } from 'lucide-react';

const GameHistory = () => {
  const { currentUser } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const records = await pb.collection('game_sessions').getList(1, 10, {
          filter: `player1Id = "${currentUser.id}" || player2Id = "${currentUser.id}"`,
          sort: '-created',
          expand: 'player1Id,player2Id',
          $autoCancel: false
        });
        setGames(records.items);
      } catch (err) {
        console.error('Error fetching game history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser]);

  if (loading) return <Skeleton className="w-full h-64 rounded-xl" />;
  if (!currentUser) return null;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="w-5 h-5 mr-2" /> Recent Games
        </CardTitle>
        <CardDescription>Your latest matches and captured moments</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2">
        {games.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No games played yet. Start a match!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {games.map(game => {
              const isPlayer1 = game.player1Id === currentUser.id;
              const opponent = isPlayer1 ? game.expand?.player2Id : game.expand?.player1Id;
              const status = game.gameStatus || game.status;
              
              let resultLabel = "In Progress";
              let badgeVariant = "secondary";
              if (status === 'completed') {
                // Determine win/loss if data exists. Assuming 'winnerId' might exist, else fallback
                // For simplicity, we just mark completed.
                resultLabel = "Completed";
                badgeVariant = "default";
              }

              const photoUrls = (game.camera_photos || []).map(filename => 
                pb.files.getUrl(game, filename, { thumb: '100x100' })
              );

              return (
                <div key={game.id} className="border border-border rounded-lg p-4 bg-muted/30 transition-colors hover:bg-muted/50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium">
                      vs {opponent ? opponent.username : 'Local / AI'}
                    </div>
                    <Badge variant={badgeVariant}>{resultLabel}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    {formatDistanceToNow(new Date(game.created), { addSuffix: true })}
                    {game.location && ` • ${game.location}`}
                  </div>
                  
                  {photoUrls.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {photoUrls.map((url, i) => (
                        <div key={i} className="relative w-16 h-16 rounded-md overflow-hidden border border-border flex-shrink-0">
                          <img src={url} alt={`Game moment ${i+1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}
                  {photoUrls.length === 0 && game.camera_photos?.length > 0 && (
                     <div className="flex items-center text-xs text-muted-foreground">
                       <ImageIcon className="w-3 h-3 mr-1" /> Photos attached
                     </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GameHistory;
