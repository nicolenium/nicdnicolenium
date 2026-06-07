
import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';

export default function GameCard({ title, description, icon: Icon, difficulty, players, path, image }) {
  return (
    <Card className="group relative overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-glow-primary hover:-translate-y-1 bg-card flex flex-col h-full">
      {image && (
        <div className="w-full h-48 sm:h-52 overflow-hidden bg-muted relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      )}
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-muted-foreground text-sm mb-6 flex-grow">{description}</p>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{difficulty}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{players}</span>
          </div>
          <Button asChild size="sm" className="rounded-full font-bold">
            <Link to={path} aria-label={`Play ${title}`}>Play <Play className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
