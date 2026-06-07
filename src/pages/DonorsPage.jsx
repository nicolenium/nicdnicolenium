
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Loader2, Sparkles } from 'lucide-react';

const DonorsPage = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const records = await pb.collection('donors').getFullList({
          filter: 'status = "active"',
          sort: '-contribution_amount,-created',
          $autoCancel: false
        });
        setDonors(records);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Community Donors - NICD</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Heart className="w-16 h-16 mx-auto text-destructive mb-6" />
          <h1 className="text-4xl md:text-5xl font-black mb-6">Community Donors</h1>
          <p className="text-lg text-muted-foreground">
            Honoring the individuals and organizations whose contributions keep our platform free and accessible to everyone.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-border border-dashed">
            <p className="text-muted-foreground">Be the first to donate and support our community!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {donors.map(donor => (
              <Card key={donor.id} className="card-base bg-gradient-to-br from-card to-card hover:from-card hover:to-muted/30 transition-colors border-border/50 hover:border-primary/30">
                <CardContent className="p-6 flex flex-col h-full items-center text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-inner ring-4 ring-background border border-primary/20">
                    {donor.logo ? (
                      <img src={pb.files.getUrl(donor, donor.logo)} alt={donor.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <Sparkles className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{donor.name}</h3>
                  {donor.contribution_amount > 0 && (
                    <div className="badge-base bg-green-500/10 text-green-500 border border-green-500/20 mb-4">
                      ${donor.contribution_amount.toLocaleString()}
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {donor.description || "Generous community supporter."}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default DonorsPage;
