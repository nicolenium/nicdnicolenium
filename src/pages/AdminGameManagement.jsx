
import React from 'react';
import { Helmet } from 'react-helmet';
import { Gamepad2, Search, Settings2, Power, Edit3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import AdminAccessControl, { PERMISSIONS } from '@/components/AdminAccessControl.jsx';
import { ALL_GAMES } from '@/config/gamePosterConfig.js';
import { toast } from 'sonner';

export default function AdminGameManagement() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredGames = ALL_GAMES.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminAccessControl requiredRoles={PERMISSIONS.MODERATOR}>
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
        <Helmet><title>Game Portfolio | Admin</title></Helmet>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-primary" /> Game Portfolio
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Manage metadata, settings, and availability for all 38 games.</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Filter games..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-2 rounded-xl bg-card"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map(game => (
            <Card key={game.id} className="rounded-2xl border-border bg-card shadow-sm hover:border-primary/50 transition-all duration-300">
              <div className="h-32 w-full bg-muted relative overflow-hidden rounded-t-2xl">
                <img src={game.image} alt={game.name} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-4 flex gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/20 px-2 py-1 rounded border border-primary/30 backdrop-blur-md">
                    {game.category.split(' ')[0]}
                  </span>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold leading-tight">{game.name}</h3>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" title="Published" />
                </div>
                <p className="text-sm font-medium text-muted-foreground line-clamp-2 mb-6 h-10">
                  {game.description}
                </p>
                
                <div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
                  <Button variant="outline" size="sm" className="font-bold border-2 rounded-lg" onClick={() => toast.info("Settings modal stub")}><Settings2 className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" className="font-bold border-2 rounded-lg" onClick={() => toast.info("Content editor stub")}><Edit3 className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" className="font-bold border-2 rounded-lg hover:text-amber-500 hover:border-amber-500" onClick={() => toast.success("Game availability toggled")}><Power className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminAccessControl>
  );
}
