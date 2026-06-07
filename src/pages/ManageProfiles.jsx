
import React from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import Header from '@/components/Header.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ManageProfiles = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-background admin-theme">
      <Helmet><title>{t('admin.manageProfiles')} - Admin</title></Helmet>
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-primary">{t('admin.manageProfiles')}</h1>
        <Card className="border-primary/20 bg-card shadow-[0_0_30px_rgba(0,217,255,0.05)]">
          <CardHeader><CardTitle>{t('admin.totalPlayers')}</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">User profile management interface placeholder...</p></CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ManageProfiles;
