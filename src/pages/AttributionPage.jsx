
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import { CheckCircle, Video, Image as ImageIcon, Type, Music, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AttributionPage() {
  const licenseSummary = [
    { type: 'CC0 / Public Domain', usage: 'Images, Sound Effects, Select Videos', description: 'Free for commercial use, no attribution required. We attribute sources for full transparency.' },
    { type: 'CC-BY (Creative Commons Attribution)', usage: 'Educational Videos, Select Images', description: 'Requires credit to the original creator. Full attributions are listed below and inline.' },
    { type: 'CC-BY-SA (ShareAlike)', usage: 'Tutorial Videos', description: 'Requires credit and distribution under identical terms.' },
    { type: 'OFL (Open Font License)', usage: 'Typography (Google Fonts)', description: 'Free, open-source fonts embedded within our platform.' },
    { type: 'ISC / MIT', usage: 'Icons (Lucide), UI Components (shadcn)', description: 'Permissive open-source software licenses.' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet><title>Attribution & Licenses | NICD NICOLENIUM</title></Helmet>
      <Header />
      
      <main className="flex-1 container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 text-foreground">
            Attribution & Licenses
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            NICD Nicolenium is committed to respecting intellectual property. This page serves as our master compliance record for all third-party assets utilized on the platform.
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Compliance Statement */}
          <Card className="border-2 border-primary/20 bg-primary/5 shadow-none">
            <CardContent className="p-6 md:p-8 flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-xl mb-2 text-foreground">Compliance Statement</h3>
                <p className="text-muted-foreground font-medium leading-relaxed">
                  All media, including videos, images, fonts, icons, and audio assets, have been rigorously audited. Every piece of third-party content is distributed under valid permissive licenses (CC0, CC-BY, OFL, MIT). No copyrighted material is used without explicit permission or valid open-source licensing.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* License Summary */}
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-primary" /> License Types Used
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {licenseSummary.map((lic, idx) => (
                <Card key={idx} className="bg-card border-border">
                  <CardContent className="p-5">
                    <Badge variant="outline" className="mb-3 text-primary border-primary bg-primary/10">{lic.type}</Badge>
                    <h4 className="font-bold text-sm mb-1">Applied to: {lic.usage}</h4>
                    <p className="text-sm text-muted-foreground">{lic.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Video Attribution */}
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Video className="w-6 h-6 text-primary" /> Video Attribution
            </h2>
            <Card className="bg-card border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground font-bold uppercase tracking-wider text-xs">
                    <tr>
                      <th className="px-6 py-4">Source Platform</th>
                      <th className="px-6 py-4">Content Category</th>
                      <th className="px-6 py-4">License Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-medium">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-foreground">YouTube Creative Commons</td>
                      <td className="px-6 py-4 text-muted-foreground">Board Game Tutorials</td>
                      <td className="px-6 py-4"><Badge variant="secondary">CC-BY 4.0</Badge></td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-foreground">Archive.org / OER</td>
                      <td className="px-6 py-4 text-muted-foreground">Educational Lessons</td>
                      <td className="px-6 py-4"><Badge variant="secondary">CC-BY-SA 3.0</Badge></td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-foreground">Pixabay / Pexels Videos</td>
                      <td className="px-6 py-4 text-muted-foreground">Action Gameplay B-Roll</td>
                      <td className="px-6 py-4"><Badge variant="secondary">CC0</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <CardContent className="p-4 bg-muted/20 border-t border-border text-xs text-muted-foreground">
                Note: Individual video attributions (Creator, License, Source) are displayed inline beneath the Video Player component in the Learning Center.
              </CardContent>
            </Card>
          </section>

          {/* Image Attribution */}
          <section>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-primary" /> Image & Poster Attribution
            </h2>
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <ul className="space-y-4 font-medium">
                  <li className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/50">
                    <div>
                      <strong className="text-foreground block">Game Posters (3D Images)</strong>
                      <span className="text-sm text-muted-foreground">Sourced from Unsplash</span>
                    </div>
                    <Badge className="w-fit mt-2 sm:mt-0">Unsplash License (CC0-equivalent)</Badge>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border/50">
                    <div>
                      <strong className="text-foreground block">UI Patterns & Backgrounds</strong>
                      <span className="text-sm text-muted-foreground">SVGBackgrounds & CSS Gradients</span>
                    </div>
                    <Badge className="w-fit mt-2 sm:mt-0">CC0 / MIT</Badge>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center justify-between">
                    <div>
                      <strong className="text-foreground block">Avatars & Thumbnails</strong>
                      <span className="text-sm text-muted-foreground">Pixabay & Internally Generated</span>
                    </div>
                    <Badge className="w-fit mt-2 sm:mt-0">CC0</Badge>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Typography & Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <Type className="w-6 h-6 text-primary" /> Fonts
              </h2>
              <Card className="bg-card border-border h-full">
                <CardContent className="p-6 space-y-4 font-medium">
                  <div>
                    <strong className="text-foreground block">Geist / Inter</strong>
                    <span className="text-sm text-muted-foreground block mb-2">Google Fonts</span>
                    <Badge variant="outline">SIL Open Font License</Badge>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <strong className="text-foreground block">Cabinet Grotesk / Playfair</strong>
                    <span className="text-sm text-muted-foreground block mb-2">Display Typography</span>
                    <Badge variant="outline">SIL Open Font License</Badge>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                <Music className="w-6 h-6 text-primary" /> Audio & Icons
              </h2>
              <Card className="bg-card border-border h-full">
                <CardContent className="p-6 space-y-4 font-medium">
                  <div>
                    <strong className="text-foreground block">Sound Effects</strong>
                    <span className="text-sm text-muted-foreground block mb-2">Freesound.org</span>
                    <Badge variant="outline">CC0 1.0 Universal</Badge>
                  </div>
                  <div className="pt-4 border-t border-border/50">
                    <strong className="text-foreground block">Lucide Icons</strong>
                    <span className="text-sm text-muted-foreground block mb-2">lucide-react library</span>
                    <Badge variant="outline">ISC License</Badge>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
