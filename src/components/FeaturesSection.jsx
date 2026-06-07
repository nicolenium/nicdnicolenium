
import React from 'react';
import { Gamepad2, Globe2, Users, Trophy, TrendingUp, Zap, Volume2 } from 'lucide-react';

const features = [
  { icon: Gamepad2, title: "21 Amazing Games", desc: "A massive collection of board, puzzle, and educational games." },
  { icon: Globe2, title: "12 Languages Supported", desc: "Play and learn in your native language with full localization." },
  { icon: Users, title: "Multiplayer & Single Player", desc: "Challenge friends online or practice against advanced AI." },
  { icon: Trophy, title: "Leaderboards & Achievements", desc: "Climb the global ranks and earn exclusive badges." },
  { icon: TrendingUp, title: "Progressive Difficulty", desc: "Dynamic AI that adapts to your skill level as you improve." },
  { icon: Zap, title: "Real-time Gameplay", desc: "Lightning-fast multiplayer synchronization with zero lag." },
  { icon: Volume2, title: "Sound Effects & Animations", desc: "Immersive audio and visual feedback for every move." }
];

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30 border-y border-border">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">Premium Features</h2>
          <p className="text-muted-foreground text-lg">Everything you need for the ultimate gaming experience.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <f.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
