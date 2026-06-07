
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { Facebook, Instagram, Youtube, Gamepad2, Mail, ShieldCheck, MapPin, Phone, MessageSquare } from 'lucide-react';
import BackButton from '@/components/BackButton.jsx';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border pt-20 pb-10 mt-auto relative overflow-hidden text-card-foreground">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-primary transition-transform group-hover:scale-105 shrink-0">
                <span className="font-black text-primary-foreground text-2xl tracking-tighter">N</span>
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl text-primary tracking-tight uppercase leading-none mb-1">NICD NICOLENIUM</span>
                <span className="font-bold text-[10px] text-card-foreground tracking-widest uppercase opacity-80">NICD PRODUCTIONS LLC</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-base mb-8 max-w-md font-medium leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-1 transition-all duration-300" aria-label="Youtube">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-1 transition-all duration-300" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-1 transition-all duration-300" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-black mb-6 uppercase tracking-widest text-sm text-primary flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" /> {t('footer.platform')}
            </h3>
            <ul className="space-y-4 text-base text-muted-foreground font-medium">
              <li><Link to="/" className="hover:text-primary hover:translate-x-1 inline-block transition-all">{t('menu.home')}</Link></li>
              <li><Link to="/games" className="hover:text-primary hover:translate-x-1 inline-block transition-all">{t('menu.games')}</Link></li>
              <li><Link to="/tournaments" className="hover:text-primary hover:translate-x-1 inline-block transition-all">{t('menu.tournaments')}</Link></li>
              <li><Link to="/leaderboard" className="hover:text-primary hover:translate-x-1 inline-block transition-all">{t('menu.leaderboard')}</Link></li>
              <li><Link to="/community" className="hover:text-primary hover:translate-x-1 inline-block transition-all">{t('menu.community')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-black mb-6 uppercase tracking-widest text-sm text-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> {t('footer.legal')}
            </h3>
            <ul className="space-y-4 text-base text-muted-foreground font-medium">
              <li><Link to="/terms-and-conditions" className="hover:text-secondary hover:translate-x-1 inline-block transition-all">{t('menu.terms')}</Link></li>
              <li><Link to="/privacy" className="hover:text-secondary hover:translate-x-1 inline-block transition-all">Privacy Policy</Link></li>
              <li><Link to="/attribution" className="hover:text-secondary hover:translate-x-1 inline-block transition-all">Attribution & Licenses</Link></li>
              <li><Link to="/how-to-learn" className="hover:text-secondary hover:translate-x-1 inline-block transition-all">How to Learn</Link></li>
              <li><Link to="/contact" className="hover:text-secondary hover:translate-x-1 inline-block transition-all">{t('menu.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-black mb-6 uppercase tracking-widest text-sm text-primary flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> {t('footer.contactInfo')}
            </h3>
            <ul className="space-y-4 text-base text-muted-foreground font-medium">
              <li className="flex items-start gap-3 flex-col">
                <div className="flex items-center gap-2 text-primary">
                  <Mail className="w-5 h-5 shrink-0" /> <span className="font-bold text-card-foreground">Email Us</span>
                </div>
                <div className="flex flex-col ml-7 space-y-2">
                  <a href="mailto:contact@nicdnicolenium.com" className="hover:text-primary transition-colors text-sm break-all">contact@nicdnicolenium.com</a>
                </div>
              </li>
              <li className="flex items-start gap-3 mt-2">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <a href="tel:5167547113" className="hover:text-primary transition-colors">516-754-7113</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="leading-snug">600 Mamaroneck Ave<br/>STE 400<br/>Harrison NY 10528</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-medium">
          <p className="flex items-center gap-2 text-center md:text-left">
            &copy; {String(currentYear)} NICD PRODUCTIONS LLC. {t('footer.rights')} <span className="hidden sm:inline">|</span> All content properly licensed and attributed.
          </p>
          <div className="flex items-center gap-4">
            <BackButton variant="link" className="text-muted-foreground hover:text-primary p-0 h-auto" />
          </div>
        </div>
      </div>
    </footer>
  );
}
