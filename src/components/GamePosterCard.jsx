
import React, { useState } from 'react';
import { Play, Users, Clock, ShieldAlert } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';

export default function GamePosterCard({ game, onClick }) {
  const [imgError, setImgError] = useState(false);
  
  const fallbackImage = 'https://images.unsplash.com/photo-1614315584058-3bfa462c8c65?auto=format&fit=crop&q=80&w=800';
  const displayImage = imgError ? fallbackImage : (game.image || fallbackImage);

  return (
    <Card 
      className="group relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-glow-primary hover:-translate-y-1 bg-card flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      <div className="w-full h-48 sm:h-52 overflow-hidden bg-muted relative">
        <img 
          src={displayImage} 
          alt={game.name || game.title} 
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border border-white/10">
          {game.category}
        </div>
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
          <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-glow-primary transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-6 h-6 ml-1" />
          </div>
        </div>
      </div>
      
      <CardContent className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-black mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {game.name || game.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-2 font-medium">
          {game.description || `Play ${game.name} online with friends or against AI.`}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
            {game.players && (
              <span className="flex items-center gap-1" title="Players">
                <Users className="w-3.5 h-3.5" /> {game.players}
              </span>
            )}
            {game.time && (
              <span className="flex items-center gap-1" title="Average Time">
                <Clock className="w-3.5 h-3.5" /> {game.time}
              </span>
            )}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
            game.difficulty === 'Hard' || game.difficulty === 'Expert' ? 'bg-destructive/10 text-destructive' :
            game.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
            'bg-emerald-500/10 text-emerald-500'
          }`}>
            {game.difficulty || 'Medium'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
