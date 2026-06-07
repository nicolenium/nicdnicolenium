
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, HeartHandshake, Loader2, Link as LinkIcon } from 'lucide-react';

const SponsorsPage = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const records = await pb.collection('sponsors').getFullList({
          sort: '-tier,name',
          $autoCancel: false
        });
        setSponsors(records);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  const getTierColor = (tier) => {
    switch (tier) {
      case 'gold': return 'bg-amber-500/20 text-amber-500 border-amber-500/30';
      case 'silver': return 'bg-slate-400/20 text-slate-400 border-slate-400/30';
      case 'bronze': return 'bg-orange-700/20 text-orange-600 border-orange-700/30';
      default: return 'bg-primary/20 text-primary border-primary/30';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Our Sponsors - NICD</title></Helmet>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <HeartHandshake className="w-16 h-16 mx-auto text-primary mb-6" />
          <h1 className="text-4xl md:text-5xl font-black mb-6">Our Proud Sponsors</h1>
          <p className="text-lg text-muted-foreground">
            We are deeply grateful for the generous support of our sponsors who make our gaming platform and community events possible.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : sponsors.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-2xl border border-border border-dashed">
            <p className="text-muted-foreground">No sponsors listed yet. Check back soon!</p>
          </div>
        ) : (
          <div className="responsive-grid">
            {sponsors.map(sponsor => (
              <Card key={sponsor.id} className="card-base group hover:border-primary/50 transition-colors">
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="h-48 bg-muted/30 flex items-center justify-center p-6 border-b border-border/50 relative overflow-hidden rounded-t-2xl">
                    {sponsor.logo ? (
                      <img 
                        src={pb.files.getUrl(sponsor, sponsor.logo)} 
                        alt={`${sponsor.name} logo`}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="font-black text-3xl text-muted-foreground/30">{sponsor.name}</span>
                    )}
                    {sponsor.tier && (
                      <div className="absolute top-4 right-4">
                        <span className={`badge-base border ${getTierColor(sponsor.tier)}`}>
                          {sponsor.tier}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-2">{sponsor.name}</h3>
                    <p className="text-muted-foreground text-sm flex-1 leading-relaxed line-clamp-4 mb-6">
                      {sponsor.description || "Proud supporter of the NICD gaming community."}
                    </p>
                    {sponsor.website && (
                      <a 
                        href={sponsor.website} 
                        target="_blank" 
                        rel="norenoopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 mt-auto"
                      >
                        <Globe className="w-4 h-4" /> Visit Website
                      </a>
                    )}
                  </div>
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

export default SponsorsPage;
