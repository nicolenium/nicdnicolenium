
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { Trophy, Calendar, Users, Settings, Plus, Play, Search, Gift, Award, CheckCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const TournamentOrganizationPage = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchTournaments();
  }, [currentUser]);

  const fetchTournaments = async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      const records = await pb.collection('tournaments').getFullList({
        filter: `createdBy = "${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setTournaments(records);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    if (!currentUser) {
      toast.error('You must be logged in to create a tournament');
      return;
    }
    
    try {
      setIsLoading(true);
      await pb.collection('tournaments').create({
        name: data.name,
        description: data.description,
        gameType: data.gameType,
        maxPlayers: parseInt(data.maxPlayers) || 16,
        format: data.format,
        startDate: new Date(data.startDate).toISOString(),
        prizePool: parseInt(data.prizePool) || 0,
        status: 'upcoming',
        createdBy: currentUser.id,
        currentPlayers: 0
      }, { $autoCancel: false });
      
      toast.success('Tournament created successfully!');
      reset();
      setActiveTab('dashboard');
      fetchTournaments();
    } catch (error) {
      toast.error('Failed to create tournament. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Organize Tournaments | NICD</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Tournament <span className="text-primary">Command Center</span></h1>
          <p className="text-xl text-muted-foreground max-w-3xl">Create, manage, and monitor your competitive events across all NICD games.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-muted/50 p-1 rounded-2xl inline-flex flex-wrap h-auto gap-2 border">
            <TabsTrigger value="dashboard" className="rounded-xl px-6 py-3 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"><Trophy className="w-4 h-4 mr-2" /> Dashboard</TabsTrigger>
            <TabsTrigger value="create" className="rounded-xl px-6 py-3 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"><Plus className="w-4 h-4 mr-2" /> Create Event</TabsTrigger>
            <TabsTrigger value="brackets" className="rounded-xl px-6 py-3 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"><Calendar className="w-4 h-4 mr-2" /> Brackets</TabsTrigger>
            <TabsTrigger value="invites" className="rounded-xl px-6 py-3 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"><Users className="w-4 h-4 mr-2" /> Players & Invites</TabsTrigger>
            <TabsTrigger value="prizes" className="rounded-xl px-6 py-3 text-sm font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"><Gift className="w-4 h-4 mr-2" /> Prizes & Badges</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="rounded-2xl border shadow-sm bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" /> Active Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-extrabold tabular-nums">{tournaments.filter(t => t.status === 'active').length}</span>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                    <Users className="w-5 h-5" /> Total Participants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-extrabold tabular-nums">{tournaments.reduce((acc, t) => acc + (t.currentPlayers || 0), 0)}</span>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-muted-foreground flex items-center gap-2">
                    <Gift className="w-5 h-5" /> Total Prize Pool
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-4xl font-extrabold tabular-nums text-primary">${tournaments.reduce((acc, t) => acc + (t.prizePool || 0), 0)}</span>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Your Tournaments</CardTitle>
                  <Button size="sm" onClick={() => setActiveTab('create')} className="rounded-full"><Plus className="w-4 h-4 mr-1" /> New</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {tournaments.length === 0 ? (
                  <div className="p-12 text-center text-muted-foreground">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>No tournaments organized yet. Start your first event!</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead>Event Name</TableHead>
                        <TableHead>Game</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Players</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tournaments.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-semibold">{t.name}</TableCell>
                          <TableCell className="capitalize">{t.gameType?.replace('_', ' ')}</TableCell>
                          <TableCell>
                            <Badge variant={t.status === 'active' ? 'default' : t.status === 'completed' ? 'secondary' : 'outline'} className="capitalize">
                              {t.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{t.currentPlayers || 0} / {t.maxPlayers}</TableCell>
                          <TableCell>{new Date(t.startDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="rounded-full">Manage</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card className="rounded-2xl shadow-sm border max-w-3xl mx-auto">
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Create New Tournament</CardTitle>
                  <CardDescription>Configure rules, game type, and prize pools for your event.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-semibold">Tournament Name</Label>
                    <Input id="name" {...register('name', { required: true })} placeholder="e.g. Summer Checkers Championship" className="h-12 bg-muted/50 rounded-xl" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="gameType" className="font-semibold">Game Type</Label>
                      <Select onValueChange={(val) => register('gameType').onChange({ target: { value: val, name: 'gameType' } })}>
                        <SelectTrigger className="h-12 bg-muted/50 rounded-xl">
                          <SelectValue placeholder="Select Game" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="checkers">NICD Checkers</SelectItem>
                          <SelectItem value="math_games">Math Challenge</SelectItem>
                          <SelectItem value="quiz_games">Speed Quiz</SelectItem>
                          <SelectItem value="language_learning">Language Battle</SelectItem>
                          <SelectItem value="pronunciation">Pronunciation Master</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="format" className="font-semibold">Format</Label>
                      <Select onValueChange={(val) => register('format').onChange({ target: { value: val, name: 'format' } })}>
                        <SelectTrigger className="h-12 bg-muted/50 rounded-xl">
                          <SelectValue placeholder="Select Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single_elimination">Single Elimination</SelectItem>
                          <SelectItem value="double_elimination">Double Elimination</SelectItem>
                          <SelectItem value="round_robin">Round Robin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="maxPlayers" className="font-semibold">Max Players</Label>
                      <Input id="maxPlayers" type="number" {...register('maxPlayers')} defaultValue={16} className="h-12 bg-muted/50 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prizePool" className="font-semibold">Prize Pool ($)</Label>
                      <Input id="prizePool" type="number" {...register('prizePool')} defaultValue={0} className="h-12 bg-muted/50 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="font-semibold">Start Date</Label>
                      <Input id="startDate" type="datetime-local" {...register('startDate', { required: true })} className="h-12 bg-muted/50 rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-semibold">Description & Rules</Label>
                    <textarea 
                      id="description" 
                      {...register('description')} 
                      className="flex min-h-[120px] w-full rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter specific rules, eligibility requirements..."
                    ></textarea>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 p-6 border-t rounded-b-2xl flex justify-end gap-4">
                  <Button variant="outline" type="button" onClick={() => reset()} className="rounded-full">Cancel</Button>
                  <Button type="submit" disabled={isLoading} className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                    {isLoading ? 'Creating...' : 'Create Tournament'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="brackets">
            <Card className="rounded-2xl border shadow-sm text-center py-20 px-4">
              <Settings className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-2xl font-bold mb-2">Bracket Generator</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">Select an active tournament to auto-generate pairings, view the interactive bracket tree, and manage match progression.</p>
              <Button disabled className="rounded-full">Select Tournament First</Button>
            </Card>
          </TabsContent>

          <TabsContent value="invites">
             <Card className="rounded-2xl border shadow-sm">
              <CardHeader>
                <CardTitle>Player Invitations</CardTitle>
                <CardDescription>Search for players and send direct tournament invites.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 mb-8">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search username or email..." className="pl-10 h-12 rounded-xl" />
                  </div>
                  <Button className="h-12 rounded-xl px-8">Search</Button>
                </div>
                
                <div className="border rounded-xl p-8 text-center text-muted-foreground">
                  Search results will appear here.
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="prizes">
             <Card className="rounded-2xl border shadow-sm">
              <CardHeader>
                <CardTitle>Prize & Badge Distribution</CardTitle>
                <CardDescription>Award prizes and special profile badges to tournament winners.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((place) => (
                  <div key={place} className="border rounded-2xl p-6 flex flex-col items-center text-center relative overflow-hidden bg-card">
                    {place === 1 && <div className="absolute top-0 w-full h-1 bg-primary"></div>}
                    {place === 2 && <div className="absolute top-0 w-full h-1 bg-slate-400"></div>}
                    {place === 3 && <div className="absolute top-0 w-full h-1 bg-amber-600"></div>}
                    <Award className={`w-12 h-12 mb-4 ${place === 1 ? 'text-primary' : place === 2 ? 'text-slate-400' : 'text-amber-600'}`} />
                    <h3 className="font-bold text-lg mb-1">{place === 1 ? '1st Place' : place === 2 ? '2nd Place' : '3rd Place'}</h3>
                    <p className="text-sm text-muted-foreground mb-4">Champion Badge + Cash Prize</p>
                    <Button variant="outline" className="w-full mt-auto rounded-full">Configure</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default TournamentOrganizationPage;
