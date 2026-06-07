
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { UserCheck, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import PlayerProfileCard from '@/components/PlayerProfileCard.jsx';
import { toast } from 'sonner';

export default function MyConnectionsPage() {
  const { currentUser } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!currentUser) return;
      try {
        const records = await pb.collection('player_connections').getFullList({
          filter: `userId="${currentUser.id}" || connectedUserId="${currentUser.id}"`,
          expand: 'userId,connectedUserId',
          $autoCancel: false
        });
        setConnections(records);
      } catch (err) {
        console.error("Error fetching connections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, [currentUser]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await pb.collection('player_connections').update(id, { status }, { $autoCancel: false });
      setConnections(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      toast.success(`Connection ${status}`);
    } catch (err) {
      console.error("Error updating connection:", err);
      toast.error("Failed to update connection.");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please log in to view connections</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pendingRequests = connections.filter(c => c.status === 'pending' && c.connectedUserId === currentUser.id);
  const activeConnections = connections.filter(c => c.status === 'accepted');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>My Connections | NICD Games</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-black font-serif mb-12 flex items-center gap-3">
          <Users className="w-10 h-10 text-primary" /> My Connections
        </h1>

        <div className="grid gap-8">
          {pendingRequests.length > 0 && (
            <Card className="border-2 border-yellow-500/20 shadow-md">
              <CardHeader className="bg-yellow-500/5 border-b border-yellow-500/10">
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <Clock className="w-5 h-5" /> Pending Requests ({pendingRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 grid gap-4">
                {pendingRequests.map(req => (
                  <div key={req.id} className="flex items-center justify-between bg-card border p-4 rounded-xl">
                    <PlayerProfileCard player={req.expand?.userId} compact />
                    <div className="flex gap-2 ml-4">
                      <Button variant="default" onClick={() => handleUpdateStatus(req.id, 'accepted')}>Accept</Button>
                      <Button variant="outline" onClick={() => handleUpdateStatus(req.id, 'declined')}>Decline</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="border-2 shadow-md">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-500" /> Active Connections ({activeConnections.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : activeConnections.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>You don't have any connections yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeConnections.map(conn => {
                    const friend = conn.userId === currentUser.id ? conn.expand?.connectedUserId : conn.expand?.userId;
                    return <PlayerProfileCard key={conn.id} player={friend} compact />;
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
