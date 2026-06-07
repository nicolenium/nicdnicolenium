
import React from 'react';
import { Button } from '@/components/ui/button.jsx';

export default function ShopManagement() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto text-center py-20">
      <h1 className="text-3xl font-black font-serif uppercase tracking-wider mb-4">Shop Management</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">External shop integration. Please manage products via your external e-commerce provider.</p>
      <a href="https://www.nicdproductions.com/home-old" target="_blank" rel="noopener noreferrer">
        <Button size="lg" className="font-bold bg-primary text-primary-foreground">Open Store Admin</Button>
      </a>
    </div>
  );
}
