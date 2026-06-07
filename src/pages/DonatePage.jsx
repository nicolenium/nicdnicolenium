
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import { Heart, Server, Code, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const PRESETS = [5, 10, 25, 50, 100];

export default function DonatePage() {
  const [amount, setAmount] = useState(25);
  const [customAmount, setCustomAmount] = useState('');
  const [type, setType] = useState('one-time');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDonate = (e) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (!finalAmount || finalAmount <= 0) return;

    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Thank you for your ${type} donation of $${finalAmount}!`);
      setCustomAmount('');
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 bg-background">
      <Helmet><title>Support Us | NICD PRODUCTIONS</title></Helmet>
      
      <div className="container max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6">Support NICD Productions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us keep the servers running, develop new games, and host bigger tournaments. Your support makes this community possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle>Make a Donation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDonate} className="space-y-6">
                  <div className="flex p-1 bg-muted rounded-lg">
                    <button type="button" className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'one-time' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setType('one-time')}>One-time</button>
                    <button type="button" className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${type === 'monthly' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} onClick={() => setType('monthly')}>Monthly</button>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {PRESETS.map(preset => (
                      <Button 
                        key={preset} 
                        type="button"
                        variant={amount === preset && !customAmount ? "default" : "outline"}
                        className={amount === preset && !customAmount ? "bg-primary text-primary-foreground" : "border-white/10"}
                        onClick={() => { setAmount(preset); setCustomAmount(''); }}
                      >
                        ${preset}
                      </Button>
                    ))}
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input 
                        type="number" 
                        placeholder="Custom" 
                        className="pl-7 bg-background border-white/10"
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setAmount(0); }}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-14 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90" disabled={isProcessing}>
                    {isProcessing ? "Processing..." : `Donate $${customAmount || amount}`}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment processing via Stripe. NICD Productions LLC is not a 501(c)(3) organization; donations are not tax-deductible.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold">Where your money goes</h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="flex items-center gap-2 font-medium"><Server className="w-4 h-4 text-primary" /> Server Infrastructure</span>
                  <span className="text-muted-foreground">75% Funded</span>
                </div>
                <Progress value={75} className="h-2 bg-muted" indicatorClassName="bg-primary" />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="flex items-center gap-2 font-medium"><Code className="w-4 h-4 text-blue-500" /> New Game Development</span>
                  <span className="text-muted-foreground">40% Funded</span>
                </div>
                <Progress value={40} className="h-2 bg-muted" indicatorClassName="bg-blue-500" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="flex items-center gap-2 font-medium"><Trophy className="w-4 h-4 text-yellow-500" /> Tournament Prize Pools</span>
                  <span className="text-muted-foreground">90% Funded</span>
                </div>
                <Progress value={90} className="h-2 bg-muted" indicatorClassName="bg-yellow-500" />
              </div>
            </div>

            <Card className="bg-muted/50 border-white/5 mt-8">
              <CardContent className="p-6">
                <h4 className="font-bold mb-4">Recent Top Supporters</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-center"><span className="font-medium">Alex M.</span> <span className="text-primary font-bold">$100</span></li>
                  <li className="flex justify-between items-center"><span className="font-medium">Sarah K.</span> <span className="text-primary font-bold">$50</span></li>
                  <li className="flex justify-between items-center"><span className="font-medium">Anonymous</span> <span className="text-primary font-bold">$25</span></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
