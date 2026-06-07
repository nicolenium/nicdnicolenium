
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Globe, Users, PlusCircle, LogIn } from 'lucide-react';

export const OnlineMultiplayerModeSelector = ({ onSelectMode }) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black font-serif mb-2 flex items-center justify-center gap-3">
          <Globe className="w-8 h-8 text-primary" /> Online Multiplayer
        </h2>
        <p className="text-muted-foreground">Play with friends or challengers around the world.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="h-full border-2 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden" onClick={() => onSelectMode('create')}>
            <div className="h-2 w-full bg-primary" />
            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <PlusCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Host Game</h3>
                <p className="text-sm text-muted-foreground mb-6">Create a new game room, set the rules, and invite a friend via link or code.</p>
              </div>
              <Button className="w-full rounded-xl mt-auto" size="lg">Create & Invite</Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
          <Card className="h-full border-2 hover:border-secondary/50 transition-colors cursor-pointer overflow-hidden" onClick={() => onSelectMode('join')}>
            <div className="h-2 w-full bg-secondary" />
            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <LogIn className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Join Game</h3>
                <p className="text-sm text-muted-foreground mb-6">Enter a game code or paste an invite link to join an existing match.</p>
              </div>
              <Button variant="secondary" className="w-full rounded-xl mt-auto" size="lg">Join Match</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
