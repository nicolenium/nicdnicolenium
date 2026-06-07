
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Trophy, Calendar, Flame, Target, Star, Brain, Globe, Mic, MapPin, Settings, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Label } from '@/components/ui/label.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian', 
  'Japanese', 'Chinese Mandarin', 'Korean', 'Arabic', 'Hindi', 'Turkish', 
  'Dutch', 'Swedish', 'Polish', 'Greek', 'Thai', 'Vietnamese', 'Indonesian'
];

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 
  'Japan', 'Brazil', 'India', 'South Africa', 'Mexico', 'Spain', 'Italy', 'Other'
];

const PlayerProfilePage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState(null);
  
  // Settings State
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [locationPrivacy, setLocationPrivacy] = useState('full');
  const [preferredLanguage, setPreferredLanguage] = useState('English');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setLocation(currentUser.location || '');
      setCity(currentUser.city || '');
      setLocationPrivacy(currentUser.locationPrivacy || 'full');
      setPreferredLanguage(currentUser.preferred_language || 'English');

      // Mock stats for demonstration
      setStats({
        checkers: { played: 142, wins: 89, losses: 40, draws: 13, elo: 1850 },
        math: { played: 56, highScore: 12400, accuracy: 94 },
        quiz: { played: 83, highScore: 8900, accuracy: 88 },
        language: { languages: ['Spanish', 'French'], vocab: 450, accuracy: 91 },
        pronunciation: { practiced: 120, avgScore: 86, best: 'Spanish' }
      });
    }
  }, [currentUser]);

  const handleSaveSettings = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      await pb.collection('users').update(currentUser.id, {
        location,
        city,
        locationPrivacy,
        preferred_language: preferredLanguage
      }, { $autoCancel: false });
      toast.success('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex-1 flex flex-col w-full">
        <main className="flex-1 flex items-center justify-center text-muted-foreground font-medium">
          Please log in to view your profile.
        </main>
      </div>
    );
  }

  const avatarUrl = currentUser.avatar 
    ? pb.files.getUrl(currentUser, currentUser.avatar) 
    : currentUser.profile_picture 
      ? pb.files.getUrl(currentUser, currentUser.profile_picture) 
      : null;

  return (
    <div className="flex-1 flex flex-col w-full bg-background">
      <Helmet><title>{currentUser.username}'s Profile | NICD</title></Helmet>
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        
        {/* Profile Header */}
        <div className="card-premium p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
          <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
            {avatarUrl ? (
              <AvatarImage src={avatarUrl} />
            ) : (
              <AvatarFallback className="text-4xl bg-primary/20 text-primary font-bold">
                {currentUser.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black mb-2">{currentUser.username}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {new Date(currentUser.created).toLocaleDateString()}</span>
              {locationPrivacy !== 'hidden' && (location || city) && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> 
                  {locationPrivacy === 'full' && city ? `${city}, ` : ''}{location}
                </span>
              )}
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {preferredLanguage}</span>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="px-4 py-2 bg-muted rounded-xl text-sm font-bold"><Trophy className="w-4 h-4 inline mr-2 text-primary" /> Overall Rank: #42</div>
              <div className="px-4 py-2 bg-muted rounded-xl text-sm font-bold"><Flame className="w-4 h-4 inline mr-2 text-orange-500" /> 14 Day Streak</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="checkers" className="space-y-8">
          <TabsList className="bg-muted p-1 rounded-2xl flex flex-wrap h-auto w-full justify-start gap-2">
            <TabsTrigger value="checkers" className="rounded-xl flex-1 md:flex-none"><Target className="w-4 h-4 mr-2" /> Checkers</TabsTrigger>
            <TabsTrigger value="math" className="rounded-xl flex-1 md:flex-none"><Brain className="w-4 h-4 mr-2" /> Math</TabsTrigger>
            <TabsTrigger value="language" className="rounded-xl flex-1 md:flex-none"><Globe className="w-4 h-4 mr-2" /> Languages</TabsTrigger>
            <TabsTrigger value="settings" className="rounded-xl flex-1 md:flex-none"><Settings className="w-4 h-4 mr-2" /> Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="checkers" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="card-premium">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Rating</p>
                  <p className="text-4xl font-black text-game-checkers">{stats?.checkers.elo}</p>
                </CardContent>
              </Card>
              <Card className="card-premium">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Played</p>
                  <p className="text-4xl font-black">{stats?.checkers.played}</p>
                </CardContent>
              </Card>
              <Card className="card-premium">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Win Rate</p>
                  <p className="text-4xl font-black text-green-500">{Math.round((stats?.checkers.wins / stats?.checkers.played) * 100)}%</p>
                </CardContent>
              </Card>
              <Card className="card-premium">
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Record</p>
                  <p className="text-2xl font-black mt-2">{stats?.checkers.wins}W - {stats?.checkers.losses}L - {stats?.checkers.draws}D</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="card-premium col-span-1">
                <CardHeader>
                  <CardTitle>Languages Studied</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats?.language.languages.map(lang => (
                    <div key={lang} className="flex justify-between items-center p-3 bg-muted/50 rounded-xl">
                      <span className="font-bold">{lang}</span>
                      <Badge variant="outline" className="border-game-language text-game-language">Intermediate</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">
                <Card className="card-premium">
                  <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Vocab Learned</p>
                    <p className="text-5xl font-black text-game-language">{stats?.language.vocab}</p>
                  </CardContent>
                </Card>
                <Card className="card-premium">
                  <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Avg Accuracy</p>
                    <div className="flex flex-col items-center gap-2 mt-2">
                      <span className="text-3xl font-black">{stats?.language.accuracy}%</span>
                      <Progress value={stats?.language.accuracy} className="w-full h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="math" className="text-center py-12 text-muted-foreground border rounded-3xl">Math stats detailed view</TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="card-premium max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="space-y-4">
                  <h3 className="text-lg font-bold border-b pb-2">Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Country / Region</Label>
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>City (Optional)</Label>
                      <Input 
                        placeholder="Enter city" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                        className="bg-background text-foreground"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Location Privacy</Label>
                    <Select value={locationPrivacy} onValueChange={setLocationPrivacy}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select Privacy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Show Full Location (City, Country)</SelectItem>
                        <SelectItem value="approximate">Show Approximate (Country Only)</SelectItem>
                        <SelectItem value="hidden">Hidden</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-bold border-b pb-2">Language Preferences</h3>
                  <div className="space-y-2">
                    <Label>Preferred Language</Label>
                    <Select value={preferredLanguage} onValueChange={setPreferredLanguage}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">This language will be used for your UI and game content.</p>
                  </div>
                </div>

                <Button onClick={handleSaveSettings} disabled={isSaving} className="w-full mt-6">
                  {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Settings</>}
                </Button>

              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

      </main>
    </div>
  );
};

export default PlayerProfilePage;
