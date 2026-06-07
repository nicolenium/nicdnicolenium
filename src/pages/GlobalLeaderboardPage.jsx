
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Trophy, Search, Medal, Globe2 } from 'lucide-react';

const MOCK_DATA = [
  { rank: 1, username: 'GrandmasterX', rating: 2850, wins: 1432, winRate: '68%', region: 'North America' },
  { rank: 2, username: 'CheckersKing', rating: 2790, wins: 1205, winRate: '65%', region: 'Europe' },
  { rank: 3, username: 'TacticalGenius', rating: 2750, wins: 980, winRate: '62%', region: 'Asia' },
  { rank: 4, username: 'BoardMaster99', rating: 2680, wins: 850, winRate: '59%', region: 'South America' },
  { rank: 5, username: 'NICD_Pro', rating: 2610, wins: 720, winRate: '58%', region: 'North America' },
];

export default function GlobalLeaderboardPage() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');

  const filteredData = MOCK_DATA.filter(p => 
    p.username.toLowerCase().includes(search.toLowerCase()) &&
    (region === 'all' || p.region === region)
  );

  return (
    <div className="min-h-screen py-12 bg-background">
      <Helmet><title>Global Leaderboards | NICD PRODUCTIONS</title></Helmet>
      
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">Global Leaderboards</h1>
          <p className="text-xl text-muted-foreground">See how you rank against the best players worldwide.</p>
        </div>

        <Card className="bg-card border-white/10 shadow-xl">
          <CardHeader className="border-b border-white/5 pb-0">
            <Tabs defaultValue="chess" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-white/10 rounded-none h-auto p-0">
                <TabsTrigger value="chess" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Chess</TabsTrigger>
                <TabsTrigger value="checkers" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Checkers 10x10</TabsTrigger>
                <TabsTrigger value="connect4" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3">Connect Four</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search player..." 
                  className="pl-9 bg-muted/50 border-white/10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger className="w-full md:w-[200px] bg-muted/50 border-white/10">
                  <Globe2 className="w-4 h-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Global</SelectItem>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia">Asia</SelectItem>
                  <SelectItem value="South America">South America</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg">Rank</th>
                    <th className="px-6 py-4">Player</th>
                    <th className="px-6 py-4">Rating (ELO)</th>
                    <th className="px-6 py-4">Wins</th>
                    <th className="px-6 py-4">Win Rate</th>
                    <th className="px-6 py-4 rounded-tr-lg">Region</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((player, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold">
                        {player.rank === 1 ? <Medal className="w-5 h-5 text-yellow-500" /> : 
                         player.rank === 2 ? <Medal className="w-5 h-5 text-gray-400" /> : 
                         player.rank === 3 ? <Medal className="w-5 h-5 text-amber-700" /> : 
                         `#${player.rank}`}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">{player.username}</td>
                      <td className="px-6 py-4 font-bold text-primary">{player.rating}</td>
                      <td className="px-6 py-4">{player.wins}</td>
                      <td className="px-6 py-4">{player.winRate}</td>
                      <td className="px-6 py-4 text-muted-foreground">{player.region}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredData.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No players found matching criteria.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
