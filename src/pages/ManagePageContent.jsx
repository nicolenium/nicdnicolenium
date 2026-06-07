
import React from 'react';
import { Helmet } from 'react-helmet';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import Header from '@/components/Header.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ManagePageContent = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col bg-background admin-theme">
      <Helmet><title>{t('admin.managePage')} - Admin</title></Helmet>
      <Header />
      <main className="flex-1 p-6 lg:p-8 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-6 text-primary">{t('admin.managePage')}</h1>
        <Card className="border-primary/20 bg-card shadow-[0_0_30px_rgba(0,217,255,0.05)]">
          <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">Admin content interface...</p></CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ManagePageContent;
