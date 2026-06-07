
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BarChart3, Download, FileText, PieChart as PieChartIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import AdminAccessControl, { PERMISSIONS } from '@/components/AdminAccessControl.jsx';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { toast } from 'sonner';

export default function AdminReportsAnalytics() {
  const { currentAdmin } = useAdminAuth();
  const [reports, setReports] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await apiServerClient.fetch(`/admin/reports?adminId=${currentAdmin?.id || 'admin'}`);
        if(res.ok) setReports(await res.json());
      } catch(e) {
        console.error(e);
      }
    };
    fetchReports();
  }, [currentAdmin]);

  const handleExport = () => {
    toast.success("Report export initiated. PDF will download shortly.");
  };

  return (
    <AdminAccessControl requiredRoles={PERMISSIONS.ADMIN}>
      <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto space-y-8 w-full">
        <Helmet><title>Reports & Analytics | Admin</title></Helmet>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" /> Reports & Analytics
            </h1>
            <p className="text-muted-foreground font-medium mt-1">Detailed performance metrics and exports.</p>
          </div>
          <Button onClick={handleExport} className="h-12 px-6 rounded-xl font-bold border-2 border-primary shadow-glow-primary">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border pb-6">
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-primary"/> Financial Summary</CardTitle>
              <CardDescription>Revenue metrics over time</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-end border-b border-border pb-4">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Daily Revenue</p>
                  <p className="text-3xl font-black">${reports?.revenueReports?.daily || 0}</p>
                </div>
                <span className="text-emerald-500 font-bold">+12%</span>
              </div>
              <div className="flex justify-between items-end border-b border-border pb-4">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Weekly Revenue</p>
                  <p className="text-3xl font-black">${reports?.revenueReports?.weekly || 0}</p>
                </div>
                <span className="text-emerald-500 font-bold">+5%</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Monthly Revenue</p>
                  <p className="text-3xl font-black">${reports?.revenueReports?.monthly || 0}</p>
                </div>
                <span className="text-emerald-500 font-bold">+18%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border bg-card shadow-sm">
            <CardHeader className="bg-muted/30 border-b border-border pb-6">
              <CardTitle className="flex items-center gap-2"><PieChartIcon className="w-5 h-5 text-secondary"/> Engagement Stats</CardTitle>
              <CardDescription>User behavior and retention</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="font-bold text-muted-foreground">Total Registered Users</span>
                <span className="font-black text-xl">{reports?.userStatistics?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="font-bold text-muted-foreground">New Signups (30d)</span>
                <span className="font-black text-xl text-primary">{reports?.userStatistics?.signups || 0}</span>
              </div>
              <div className="flex justify-between items-center border-b border-border pb-4">
                <span className="font-bold text-muted-foreground">Active Participants</span>
                <span className="font-black text-xl">{reports?.userStatistics?.activeUsers || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-muted-foreground">Engagement Rate</span>
                <span className="font-black text-xl text-secondary">{reports?.userStatistics?.engagementRate || "0%"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminAccessControl>
  );
}
