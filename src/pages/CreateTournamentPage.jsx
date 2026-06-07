
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Trophy, Settings, Calendar, CheckCircle2, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group.jsx';
import { Card, CardContent } from '@/components/ui/card.jsx';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';

const STEPS = [
  { id: 1, title: 'Basic Info', icon: Trophy },
  { id: 2, title: 'Game Rules', icon: Settings },
  { id: 3, title: 'Schedule', icon: Calendar },
  { id: 4, title: 'Review', icon: CheckCircle2 }
];

const CreateTournamentPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tournament_format: 'Public',
    gameType: 'checkers',
    maxPlayers: 16,
    format: 'single_elimination',
    startDate: '',
    timeControl: 'rapid',
    prizePool: 0
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.name.trim()) { toast.error('Tournament name is required'); return false; }
    }
    if (currentStep === 3) {
      if (!formData.startDate) { toast.error('Start date is required'); return false; }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    try {
      const record = await pb.collection('tournaments').create({
        ...formData,
        hostId: currentUser.id,
        createdBy: currentUser.id,
        status: 'upcoming',
        currentPlayers: 0
      }, { $autoCancel: false });
      
      toast.success('Tournament created successfully!');
      navigate(`/tournaments/${record.id}`);
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast.error('Failed to create tournament. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet><title>Create Tournament - NICD PRODUCTIONS</title></Helmet>
      
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/tournaments')} className="mb-4 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tournaments
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Create Tournament</h1>
          <p className="text-muted-foreground mt-2">Set up your custom tournament in a few easy steps.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full" />
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
          
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = currentStep >= step.id;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
                  isActive ? 'bg-primary border-primary text-primary-foreground' : 'bg-card border-muted text-muted-foreground'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs font-medium hidden sm:block ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        <Card className="bg-card border-border shadow-xl">
          <CardContent className="p-6 md:p-8">
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Tournament Name <span className="text-destructive">*</span></Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Summer Championship 2026" 
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">Description</Label>
                  <textarea 
                    id="description" 
                    rows={4}
                    placeholder="Describe your tournament..." 
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-foreground">Tournament Type</Label>
                  <RadioGroup 
                    value={formData.tournament_format} 
                    onValueChange={(val) => handleInputChange('tournament_format', val)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {['Public', 'Registered Users', 'Invite-Only', 'Friends/Family'].map(type => (
                      <div key={type} className="flex items-center space-x-2 border border-border p-4 rounded-lg bg-background hover:border-primary/50 transition-colors cursor-pointer">
                        <RadioGroupItem value={type} id={`type-${type}`} />
                        <Label htmlFor={`type-${type}`} className="cursor-pointer flex-1 text-foreground">{type}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-foreground">Game Type</Label>
                    <Select value={formData.gameType} onValueChange={(val) => handleInputChange('gameType', val)}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select game" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkers">Checkers</SelectItem>
                        <SelectItem value="chess">Chess</SelectItem>
                        <SelectItem value="ludo">Ludo</SelectItem>
                        <SelectItem value="trivia">Trivia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Max Players</Label>
                    <Select value={formData.maxPlayers.toString()} onValueChange={(val) => handleInputChange('maxPlayers', parseInt(val))}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select max players" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="4">4 Players</SelectItem>
                        <SelectItem value="8">8 Players</SelectItem>
                        <SelectItem value="16">16 Players</SelectItem>
                        <SelectItem value="32">32 Players</SelectItem>
                        <SelectItem value="64">64 Players</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Time Control</Label>
                    <Select value={formData.timeControl} onValueChange={(val) => handleInputChange('timeControl', val)}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select time control" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blitz">Blitz (Fast)</SelectItem>
                        <SelectItem value="rapid">Rapid (Normal)</SelectItem>
                        <SelectItem value="classical">Classical (Slow)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground">Prize Pool (Optional)</Label>
                    <Input 
                      type="number" 
                      min="0"
                      value={formData.prizePool}
                      onChange={(e) => handleInputChange('prizePool', parseInt(e.target.value) || 0)}
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-foreground">Start Date & Time <span className="text-destructive">*</span></Label>
                  <Input 
                    id="startDate" 
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="bg-background border-border text-foreground"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-foreground">Bracket Format</Label>
                  <RadioGroup 
                    value={formData.format} 
                    onValueChange={(val) => handleInputChange('format', val)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    {[
                      { id: 'single_elimination', label: 'Single Elimination', desc: 'Lose once and you are out.' },
                      { id: 'double_elimination', label: 'Double Elimination', desc: 'Lose twice to be eliminated.' },
                      { id: 'round_robin', label: 'Round Robin', desc: 'Everyone plays everyone.' },
                      { id: 'swiss', label: 'Swiss System', desc: 'Play against opponents with similar scores.' }
                    ].map(format => (
                      <div key={format.id} className="flex items-start space-x-3 border border-border p-4 rounded-lg bg-background hover:border-primary/50 transition-colors cursor-pointer">
                        <RadioGroupItem value={format.id} id={`format-${format.id}`} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={`format-${format.id}`} className="cursor-pointer font-semibold text-foreground block">{format.label}</Label>
                          <span className="text-xs text-muted-foreground">{format.desc}</span>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-muted/30 rounded-xl p-6 border border-border space-y-4">
                  <h3 className="text-xl font-bold text-foreground border-b border-border pb-2">Tournament Summary</h3>
                  
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div>
                      <span className="text-muted-foreground block mb-1">Name</span>
                      <span className="font-medium text-foreground">{formData.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Type</span>
                      <span className="font-medium text-foreground">{formData.tournament_format}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Game</span>
                      <span className="font-medium text-foreground capitalize">{formData.gameType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Format</span>
                      <span className="font-medium text-foreground capitalize">{formData.format.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Max Players</span>
                      <span className="font-medium text-foreground">{formData.maxPlayers}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block mb-1">Start Date</span>
                      <span className="font-medium text-foreground">{new Date(formData.startDate).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1 || isSubmitting}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button onClick={handleNext}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {isSubmitting ? 'Creating...' : 'Create Tournament'} <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTournamentPage;
