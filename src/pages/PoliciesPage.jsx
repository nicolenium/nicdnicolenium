
import React from 'react';
import { Helmet } from 'react-helmet';

export default function PoliciesPage() {
  return (
    <div className="min-h-screen py-24 bg-background">
      <Helmet><title>Platform Policies | NICD PRODUCTIONS LLC</title></Helmet>
      <div className="container max-w-4xl mx-auto px-4 prose prose-invert prose-green">
        <h1 className="text-4xl font-black mb-8">Platform Policies</h1>
        <p className="text-muted-foreground mb-8">Last Updated: June 1, 2026</p>

        <h2>1. Acceptable Use Policy</h2>
        <p>Users must utilize the NICD PRODUCTIONS LLC platform solely for its intended purpose: playing games and participating in the community. Any attempt to reverse engineer, scrape, or disrupt the platform infrastructure is a violation of this policy.</p>

        <h2>2. Anti-Harassment Policy</h2>
        <p>We maintain a zero-tolerance policy for harassment. This includes targeted abuse, doxxing, swatting, or encouraging others to engage in abusive behavior. Violators will be permanently banned and reported to relevant authorities if necessary.</p>

        <h2>3. Cookie Policy</h2>
        <p>We use essential cookies to keep you logged in and maintain your game state. We use analytical cookies to understand how our platform is used. You may opt-out of non-essential cookies via the cookie banner presented on your first visit.</p>

        <h2>4. Data Protection Policy</h2>
        <p>All user data is encrypted at rest and in transit. We conduct regular security audits and penetration testing to ensure the integrity of our systems. In the event of a data breach, affected users will be notified within 72 hours.</p>

        <h2>5. Accessibility Policy</h2>
        <p>NICD PRODUCTIONS LLC strives to conform to WCAG 2.1 AA standards. We continuously improve our color contrast, keyboard navigation, and screen reader compatibility. Feedback regarding accessibility can be directed to access@nicdproductions.com.</p>
      </div>
    </div>
  );
}
