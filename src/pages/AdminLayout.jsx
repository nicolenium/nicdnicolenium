
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AdminSidebar from '@/components/AdminSidebar.jsx';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Helmet><title>Admin Panel | NICD PRODUCTIONS</title></Helmet>
      
      <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[250px] transition-all duration-300">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b border-border bg-card flex items-center px-4 shrink-0 sticky top-0 z-20 shadow-sm">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(true)} className="text-foreground">
            <Menu className="w-6 h-6" />
          </Button>
          <span className="ml-4 font-bold text-lg tracking-tight">Admin Portal</span>
        </header>

        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col min-h-0 relative z-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
