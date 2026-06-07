
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { 
  ShieldAlert, ShieldCheck, Shield, AlertTriangle, XCircle, 
  Info, RefreshCw, ServerCrash, CheckCircle2, Activity 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Progress } from '@/components/ui/progress.jsx';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { toast } from 'sonner';

export default function ComprehensiveWebsiteErrorReview() {
  const { currentAdmin } = useAdminAuth();
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState(null);
  const [progress, setProgress] = useState(0);

  const runAudit = async () => {
    setIsAuditing(true);
    setProgress(10);
    setAuditResults(null);
    
    // Simulate multi-step progress for visual feedback
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 15, 90));
    }, 500);

    try {
      const response = await apiServerClient.fetch('/admin/error-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: currentAdmin?.id || 'admin' })
      });
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || "Audit failed");
      
      clearInterval(interval);
      setProgress(100);
      setAuditResults(data);
      toast.success("System audit completed successfully");
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      toast.error(err.message || "Failed to complete system audit");
    } finally {
      setTimeout(() => setIsAuditing(false), 500);
    }
  };

  useEffect(() => {
    // Auto-run on mount
    runAudit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case 'critical': return <ServerCrash className="w-5 h-5 text-destructive" />;
      case 'high': return <XCircle className="w-5 h-5 text-destructive" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'low': return <Info className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = (severity) => {
    switch(severity) {
      case 'critical': return "bg-destructive/10 text-destructive border-destructive/20";
      case 'high': return "bg-destructive/10 text-destructive border-destructive/20";
      case 'medium': return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case 'low': return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const calculateHealthScore = () => {
    if (!auditResults?.summary) return 100;
    const { critical = 0, high = 0, medium = 0, low = 0 } = auditResults.summary;
    const penalty = (critical * 20) + (high * 10) + (medium * 5) + (low * 1);
    return Math.max(0, 100 - penalty);
  };

  const healthScore = calculateHealthScore();

  return (
    <div className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <Helmet><title>System Audit & Error Review | NICOLENIUM</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" /> System Diagnostics
          </h1>
          <p className="text-muted-foreground font-medium mt-1">Automated infrastructure and application health review.</p>
        </div>
        <Button 
          onClick={runAudit} 
          disabled={isAuditing}
          className="h-12 px-6 rounded-xl font-bold shadow-glow-primary border-2 border-primary"
        >
          <RefreshCw className={`w-5 h-5 mr-2 ${isAuditing ? 'animate-spin' : ''}`} />
          {isAuditing ? 'Running Diagnostics...' : 'Run Full Audit'}
        </Button>
      </div>

      {isAuditing && (
        <Card className="rounded-2xl border-border bg-card shadow-sm">
          <CardContent className="p-8 text-center space-y-6">
            <Shield className="w-16 h-16 text-primary mx-auto animate-pulse" />
            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-bold">Auditing Systems</h3>
              <Progress value={progress} className="h-3 rounded-full" />
              <p className="text-sm font-medium text-muted-foreground">Checking endpoints, database integrity, and resources...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!isAuditing && auditResults && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="rounded-2xl border-border bg-card shadow-sm col-span-1 md:col-span-4 lg:col-span-1">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${healthScore > 90 ? 'bg-emerald-500/10 text-emerald-500' : healthScore > 70 ? 'bg-amber-500/10 text-amber-500' : 'bg-destructive/10 text-destructive'}`}>
                  {healthScore > 90 ? <ShieldCheck className="w-10 h-10" /> : <ShieldAlert className="w-10 h-10" />}
                </div>
                <h3 className="text-5xl font-black tabular-nums tracking-tighter">{healthScore}</h3>
                <p className="font-bold text-muted-foreground mt-1">System Health Score</p>
              </CardContent>
            </Card>

            <div className="col-span-1 md:col-span-4 lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="rounded-2xl border-border bg-card shadow-sm flex flex-col justify-center p-6">
                <div className="text-destructive mb-2"><ServerCrash className="w-6 h-6" /></div>
                <div className="text-3xl font-black">{auditResults.summary.critical || 0}</div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Critical</div>
              </Card>
              <Card className="rounded-2xl border-border bg-card shadow-sm flex flex-col justify-center p-6">
                <div className="text-destructive mb-2"><XCircle className="w-6 h-6" /></div>
                <div className="text-3xl font-black">{auditResults.summary.high || 0}</div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">High</div>
              </Card>
              <Card className="rounded-2xl border-border bg-card shadow-sm flex flex-col justify-center p-6">
                <div className="text-amber-500 mb-2"><AlertTriangle className="w-6 h-6" /></div>
                <div className="text-3xl font-black">{auditResults.summary.medium || 0}</div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Medium</div>
              </Card>
              <Card className="rounded-2xl border-border bg-card shadow-sm flex flex-col justify-center p-6">
                <div className="text-blue-500 mb-2"><Info className="w-6 h-6" /></div>
                <div className="text-3xl font-black">{auditResults.summary.low || 0}</div>
                <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Low</div>
              </Card>
            </div>
          </div>

          {/* Issues List */}
          <Card className="rounded-2xl border-border bg-card shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-border p-6">
              <CardTitle className="font-black text-xl">Detected Issues & Recommendations</CardTitle>
              <CardDescription className="font-medium text-base mt-1">Review items requiring attention below.</CardDescription>
            </CardHeader>
            <div className="divide-y divide-border">
              {auditResults.issues?.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                  <h3 className="text-2xl font-black">All Systems Nominal</h3>
                  <p className="text-muted-foreground font-medium mt-2 max-w-md">No significant issues or vulnerabilities were detected during the automated audit.</p>
                </div>
              ) : (
                auditResults.issues?.map((issue, idx) => (
                  <div key={idx} className="p-6 flex flex-col md:flex-row gap-6 hover:bg-muted/10 transition-colors">
                    <div className="flex-shrink-0 flex flex-col items-center md:w-32 gap-2 pt-1">
                      {getSeverityIcon(issue.severity)}
                      <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded-full border ${getSeverityBadge(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{issue.category.replace('_', ' ')}</span>
                          <span className="text-muted-foreground text-xs">•</span>
                          <span className="text-xs font-mono text-muted-foreground">{new Date(issue.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <h4 className="text-lg font-bold text-foreground leading-snug">{issue.issue}</h4>
                      </div>
                      
                      {issue.affectedItems && issue.affectedItems.length > 0 && (
                        <div className="bg-background rounded-lg border p-3">
                          <p className="text-xs font-bold uppercase text-muted-foreground mb-2 tracking-wider">Affected Components</p>
                          <div className="flex flex-wrap gap-2">
                            {issue.affectedItems.map((item, i) => (
                              <code key={i} className="text-xs bg-muted text-foreground px-2 py-1 rounded border">
                                {item}
                              </code>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="bg-primary/5 rounded-lg border border-primary/20 p-4">
                        <p className="text-sm font-bold text-primary mb-1 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" /> Recommended Action
                        </p>
                        <p className="text-sm font-medium text-foreground">{issue.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
