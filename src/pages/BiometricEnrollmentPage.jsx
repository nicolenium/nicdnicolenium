
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBiometricAuth } from '@/contexts/BiometricAuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ShieldCheck, Fingerprint, Activity, CheckCircle2, ChevronRight, ScanFace, Mic } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ENROLLMENT_STEPS = [
  { id: 'intro', title: 'Security & Privacy' },
  { id: 'capture', title: 'Capture Data' },
  { id: 'complete', title: 'Verification' }
];

const BiometricEnrollmentPage = () => {
  const navigate = useNavigate();
  const { enrollBiometric } = useBiometricAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState('face'); // Default
  const [progress, setProgress] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const startCapture = () => {
    setIsCapturing(true);
    setProgress(0);
    
    // Simulate capture process filling up
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          finishCapture();
          return 100;
        }
        return p + 20;
      });
    }, 600);
  };

  const finishCapture = async () => {
    setIsCapturing(false);
    try {
      await enrollBiometric(selectedType, { mockTemplate: "0xABCDEF", points: 128 });
      setCurrentStep(2); // Move to complete
    } catch (err) {
      toast.error(err.message || "Failed to save enrollment.");
      setProgress(0);
    }
  };

  return (
    <>
      <Helmet><title>Biometric Enrollment - NICD</title></Helmet>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tight mb-2">Biometric Setup</h1>
            <p className="text-muted-foreground">Add passwordless authentication to your account.</p>
          </div>

          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[hsl(var(--biometric-primary))] -z-10 rounded-full transition-all duration-500" 
              style={{ width: `${(currentStep / (ENROLLMENT_STEPS.length - 1)) * 100}%` }}
            />
            
            {ENROLLMENT_STEPS.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors
                  ${idx < currentStep ? 'bg-[hsl(var(--biometric-primary))] border-[hsl(var(--biometric-primary))] text-white' : ''}
                  ${idx === currentStep ? 'border-[hsl(var(--biometric-primary))] text-[hsl(var(--biometric-primary))] bg-background' : ''}
                  ${idx > currentStep ? 'border-border text-muted-foreground bg-background' : ''}
                `}>
                  {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
            {currentStep === 0 && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-start gap-4 p-4 bg-[hsl(var(--biometric-primary))]/10 border border-[hsl(var(--biometric-primary))]/20 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-[hsl(var(--biometric-primary))] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground">Secure & Encrypted</h3>
                    <p className="text-sm text-muted-foreground mt-1">Your biometric data is mathematically hashed and encrypted. We do not store raw images or audio files.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="font-bold">Select Biometric Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[{id: 'face', i: ScanFace, label: 'Face ID'}, {id: 'fingerprint', i: Fingerprint, label: 'Touch ID'}, {id: 'voice', i: Mic, label: 'Voice Match'}].map(t => (
                      <button 
                        key={t.id}
                        onClick={() => setSelectedType(t.id)}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all
                          ${selectedType === t.id ? 'border-[hsl(var(--biometric-primary))] bg-[hsl(var(--biometric-primary))]/5 ring-1 ring-[hsl(var(--biometric-primary))]' : 'border-border hover:bg-accent/50'}
                        `}
                      >
                        <t.i className={`w-6 h-6 ${selectedType === t.id ? 'text-[hsl(var(--biometric-primary))]' : 'text-muted-foreground'}`} />
                        <span className="font-medium text-sm">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => setCurrentStep(1)} className="responsive-btn-md">
                    Continue <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in-95">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold capitalize">{selectedType} Capture</h2>
                  <p className="text-muted-foreground">Follow the on-screen instructions carefully.</p>
                </div>

                <div className="biometric-scanner-container w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-dashed border-border flex items-center justify-center relative bg-muted/20">
                  {isCapturing && <div className="biometric-scanner-line rounded-full" />}
                  {isCapturing && <div className="biometric-pulse-ring" />}
                  {selectedType === 'face' && <ScanFace className="w-20 h-20 text-muted-foreground/50" />}
                  {selectedType === 'fingerprint' && <Fingerprint className="w-20 h-20 text-muted-foreground/50" />}
                  {selectedType === 'voice' && <Mic className="w-20 h-20 text-muted-foreground/50" />}
                  
                  {isCapturing && (
                    <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-full flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-[hsl(var(--biometric-primary))]">{progress}%</span>
                    </div>
                  )}
                </div>

                <div className="w-full max-w-md space-y-2">
                  <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    <span>Quality</span>
                    <span>{progress === 100 ? 'Excellent' : isCapturing ? 'Analyzing...' : 'Waiting'}</span>
                  </div>
                  <Progress value={progress} className="h-2 [&>div]:bg-[hsl(var(--biometric-primary))]" />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(0)} disabled={isCapturing} className="responsive-btn-md">Back</Button>
                  <Button onClick={startCapture} disabled={isCapturing} className="responsive-btn-md min-w-[120px]">
                    {progress > 0 ? 'Recapture' : 'Start Capture'}
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="text-center space-y-6 py-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="w-20 h-20 bg-[hsl(var(--biometric-success))]/10 text-[hsl(var(--biometric-success))] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black">Enrollment Complete!</h2>
                <p className="text-muted-foreground max-w-md mx-auto text-balance">
                  Your biometric identity has been securely stored. You can now use it to log in and authorize sensitive actions.
                </p>
                <div className="pt-6">
                  <Button asChild className="responsive-btn-lg px-8 shadow-glow interactive-scale">
                    <Link to="/biometric-settings">Go to Security Settings</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default BiometricEnrollmentPage;
