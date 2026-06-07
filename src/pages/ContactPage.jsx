
import React from 'react';
import { Helmet } from 'react-helmet';
import ContactForm from '@/components/ContactForm.jsx';
import ContactInfo from '@/components/ContactInfo.jsx';
import LocationMap from '@/components/LocationMap.jsx';
import SocialMediaLinks from '@/components/SocialMediaLinks.jsx';
import { motion } from 'framer-motion';

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Contact NICD NICOLENIUM | NICD PRODUCTIONS LLC</title>
        <meta name="description" content="Get in touch with NICD NICOLENIUM by NICD PRODUCTIONS LLC. We're here to help with any questions about our entertainment and gaming platform." />
      </Helmet>
      
      <main className="flex-1">
        <section className="bg-card border-b border-border py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background pointer-events-none"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest bg-secondary/10 text-secondary border border-secondary/20 mb-6 inline-block">
                Be Good And Do Good
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-6 text-balance text-foreground font-serif">
                Contact NICD NICOLENIUM
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-balance max-w-2xl mx-auto font-medium">
                Whether you have a question about our tournaments, need technical support, or want to explore partnership opportunities, our production team is ready to assist you.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="order-2 lg:order-1 h-full w-full">
                <ContactForm />
              </div>
              <div className="order-1 lg:order-2 h-full w-full">
                <ContactInfo />
              </div>
            </motion.div>

            <motion.div
              className="bg-card border border-border rounded-3xl p-8 lg:p-12 mb-16 shadow-lg text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4 font-serif">Connect With NICD NICOLENIUM</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Follow us on our social platforms to stay updated with the latest tournaments, events, and community news.</p>
              <div className="flex justify-center">
                <SocialMediaLinks layout="horizontal" size="lg" showLabels={true} className="justify-center" />
              </div>
            </motion.div>

            <motion.div 
              className="mt-12 rounded-3xl overflow-hidden shadow-lg border border-border"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="bg-card p-8 text-center border-b border-border">
                <h2 className="text-3xl font-bold text-foreground font-serif">Visit Our Headquarters</h2>
                <p className="text-muted-foreground mt-2">Located in the heart of Harrison, NY</p>
              </div>
              <LocationMap />
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;
