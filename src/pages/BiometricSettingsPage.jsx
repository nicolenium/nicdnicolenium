
import React from 'react';
import { Link } from 'react-router-dom';
import { useBiometricAuth } from '@/contexts/BiometricAuthContext.jsx';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, Plus, Trash2, Clock, History, AlertTriangle } from 'lucide-react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { formatDistanceToNow } from 'date-fns';

const BiometricSettingsPage = () => {
  const { enrollments, deleteBiometric, disableBiometric, loading } = useBiometricAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Biometric Settings - NICD</title></Helmet>
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[hsl(var(--biometric-primary))]" />
          <div>
            <h1 className="text-3xl font-black tracking-tight">Biometric Security</h1>
            <p className="text-muted-foreground font-medium">Manage your passwordless authenticators.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <CardTitle className="text-lg">Active Enrollments</CardTitle>
                  <CardDescription>Biometrics currently linked to your account.</CardDescription>
                </div>
                <Button asChild size="sm" className="bg-[hsl(var(--biometric-primary))] hover:bg-[hsl(var(--biometric-primary))]/90 text-white">
                  <Link to="/biometric-enrollment"><Plus className="w-4 h-4 mr-2" /> Add New</Link>
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : enrollments.length === 0 ? (
                  <div className="p-8 text-center space-y-3 border-b border-border/50">
                    <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto" />
                    <p className="font-medium">No biometrics enrolled.</p>
                    <p className="text-sm text-muted-foreground">Add one to enable fast, secure logins.</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-border/50">
                    {enrollments.map(enr => (
                      <li key={enr.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                        <div>
                          <p className="font-bold capitalize flex items-center gap-2">
                            {enr.biometricType} 
                            <span className={`w-2 h-2 rounded-full ${enr.isActive ? 'bg-[hsl(var(--biometric-success))]' : 'bg-muted-foreground'}`} />
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Enrolled {formatDistanceToNow(new Date(enr.created))} ago
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Used {enr.verificationCount || 0} times
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Switch 
                            checked={enr.isActive} 
                            onCheckedChange={() => disableBiometric(enr.id, enr.biometricType)}
                            title="Toggle active status"
                            className="data-[state=checked]:bg-[hsl(var(--biometric-primary))]"
                          />
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                              if(window.confirm("Remove this biometric completely?")) {
                                deleteBiometric(enr.id, enr.biometricType);
                              }
                            }}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><History className="w-5 h-5" /> Recent Activity Log</CardTitle>
                <CardDescription>Security events related to biometrics.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl border border-border/50">
                  <p>Audit logs are maintained for 90 days. Admins may review logs for security anomalies.</p>
                  {/* In full implementation, fetch from biometric_audit_log and map here */}
                  <Button variant="link" className="px-0 mt-2 text-[hsl(var(--biometric-primary))]">View full audit log &rarr;</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2"><Clock className="w-5 h-5" /> Global Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Require Re-auth After (Minutes)</label>
                  <select className="w-full bg-background border border-border rounded-lg p-2 text-sm">
                    <option value="15">15 Minutes</option>
                    <option value="30">30 Minutes</option>
                    <option value="60">1 Hour</option>
                    <option value="0">Never (Session End)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold">Max Retries</label>
                  <select className="w-full bg-background border border-border rounded-lg p-2 text-sm">
                    <option value="3">3 Attempts</option>
                    <option value="5">5 Attempts</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Falls back to password after max retries.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BiometricSettingsPage;
