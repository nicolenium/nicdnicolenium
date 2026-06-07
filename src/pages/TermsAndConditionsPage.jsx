
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { ScrollArea } from '@/components/ui/scroll-area.jsx';

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Terms and Conditions | NICD NICOLENIUM</title>
        <meta name="description" content="Terms and Conditions of Use for NICD NICOLENIUM platform." />
      </Helmet>
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto bg-card rounded-3xl p-8 md:p-12 shadow-xl border border-border">
          <h1 className="text-4xl md:text-5xl font-black mb-8 text-primary">Terms & Conditions</h1>
          
          <ScrollArea className="h-[60vh] pr-6 text-muted-foreground space-y-6">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4 leading-relaxed">
                By accessing or using the NICD NICOLENIUM gaming platform, you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions, you must not access or use the platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">2. User Conduct & Fair Play</h2>
              <p className="mb-4 leading-relaxed">
                Users are expected to maintain fair play across all games. The use of external assistance, cheating software, automated bots (unless explicitly provided by the platform), or exploiting bugs to gain unfair advantages is strictly prohibited. Violations may result in account suspension or termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">3. Intellectual Property</h2>
              <p className="mb-4 leading-relaxed">
                All content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by NICD NICOLENIUM, its licensors, or other providers of such material.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">4. Privacy Policy</h2>
              <p className="mb-4 leading-relaxed">
                Your use of the platform is also governed by our Privacy Policy, which is incorporated into these terms by reference. We collect and process data in accordance with applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">5. Limitation of Liability</h2>
              <p className="mb-4 leading-relaxed">
                In no event shall NICD NICOLENIUM, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">6. Dispute Resolution</h2>
              <p className="mb-4 leading-relaxed">
                Any disputes arising out of or relating to these Terms or the Service will be resolved in accordance with the laws of the jurisdiction where NICD NICOLENIUM operates, without regard to its conflict of law provisions.
              </p>
            </section>
          </ScrollArea>
        </div>
      </main>

      <Footer />
    </div>
  );
}
