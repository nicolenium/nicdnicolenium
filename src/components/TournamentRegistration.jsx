
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, CheckCircle2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';

const TournamentRegistration = ({ tournamentId, onRegistrationChange }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRegistration = async () => {
      if (!pb.authStore.isValid) {
        setIsLoading(false);
        return;
      }

      try {
        const records = await pb.collection('tournament_registrations').getFullList({
          filter: `tournamentId = "${tournamentId}" && userId = "${pb.authStore.model.id}"`,
          $autoCancel: false
        });
        
        if (records.length > 0) {
          setIsRegistered(true);
          setRegistrationId(records[0].id);
        }
      } catch (error) {
        console.error("Error checking registration:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkRegistration();
  }, [tournamentId]);

  const handleRegister = async () => {
    if (!pb.authStore.isValid) {
      toast.error('You must be logged in to register.');
      return;
    }

    setIsLoading(true);
    try {
      const record = await pb.collection('tournament_registrations').create({
        tournamentId: tournamentId,
        userId: pb.authStore.model.id,
        status: 'registered'
      }, { $autoCancel: false });
      
      setIsRegistered(true);
      setRegistrationId(record.id);
      toast.success('Successfully registered for tournament!');
      if (onRegistrationChange) onRegistrationChange(true);
    } catch (error) {
      console.error("Registration error:", error);
      toast.error('Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!registrationId) return;
    
    setIsLoading(true);
    try {
      await pb.collection('tournament_registrations').delete(registrationId, { $autoCancel: false });
      setIsRegistered(false);
      setRegistrationId(null);
      toast.info('You have unregistered from the tournament.');
      if (onRegistrationChange) onRegistrationChange(false);
    } catch (error) {
      console.error("Unregister error:", error);
      toast.error('Failed to unregister.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!pb.authStore.isValid) {
    return (
      <Card className="bg-secondary text-secondary-foreground border-border">
        <CardContent className="p-6 text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">Join the Competition</h3>
          <p className="text-sm opacity-80 mb-4">Log in to register for this tournament.</p>
          <Button variant="outline" className="w-full border-border">Sign In</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm bg-card overflow-hidden">
      <div className={`h-2 w-full ${isRegistered ? 'bg-green-500' : 'bg-primary'}`}></div>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isRegistered ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <UserPlus className="w-5 h-5" />}
          {isRegistered ? 'Registration Confirmed' : 'Registration Open'}
        </CardTitle>
        <CardDescription>
          {isRegistered ? 'You are successfully enrolled.' : 'Secure your spot in the tournament.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRegistered ? (
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={handleUnregister}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Withdraw from Tournament'}
          </Button>
        ) : (
          <Button 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90" 
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Register Now'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentRegistration;
