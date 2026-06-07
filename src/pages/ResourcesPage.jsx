
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ResourcesPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Resources - NICD</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-black text-primary mb-6">Learning Resources</h1>
      </main>
      <Footer />
    </div>
  );
};
export default ResourcesPage;
