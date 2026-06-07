
import React from 'react';
import { Helmet } from 'react-helmet';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-24 bg-background">
      <Helmet><title>Terms of Service | NICD PRODUCTIONS LLC</title></Helmet>
      <div className="container max-w-4xl mx-auto px-4 prose prose-invert prose-green">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground text-lg mb-12 font-medium">Last Updated: June 1, 2026</p>

        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using the NICOLENIUM gaming platform provided by NICD PRODUCTIONS LLC ("Company", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the platform or use any services.</p>

        <h2>2. Company Information</h2>
        <p>
          <strong>NICD PRODUCTIONS LLC</strong><br />
          600 Mamaroneck Avenue #400<br />
          Harrison, NY, 10528<br />
          Contact: contact@nicdnicolenium.com
        </p>

        <h2>3. Governing Law and Venue</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law principles. Any legal action or proceeding arising under these Terms shall be brought exclusively in the state or federal courts located in Westchester County, New York.</p>

        <h2>4. Dispute Resolution & Arbitration</h2>
        <p>Any dispute arising out of or relating to these Terms or the breach thereof shall be finally resolved by arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. The arbitration shall take place in Harrison, New York. <strong>CLASS ACTION WAIVER:</strong> You agree that any proceedings will be conducted only on an individual basis and not in a class, consolidated, or representative action. You may opt out of this arbitration agreement within 30 days of first accepting these terms by emailing nicolenium@nicdproductions.com.</p>

        <h2>5. Limitation of Liability</h2>
        <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, NICD PRODUCTIONS LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. IN NO EVENT SHALL OUR AGGREGATE LIABILITY EXCEED THE GREATER OF ONE HUNDRED U.S. DOLLARS ($100.00) OR THE AMOUNT YOU PAID US IN THE PAST THREE (3) MONTHS.</p>

        <h2>6. Intellectual Property</h2>
        <p>All content, features, and functionality on the NICOLENIUM platform, including but not limited to text, graphics, logos, icons, and software, are the exclusive property of NICD PRODUCTIONS LLC and are protected by United States and international copyright, trademark, and other intellectual property laws.</p>

        <h2>7. User Conduct</h2>
        <p>You agree not to use the platform to: (a) violate any laws; (b) harass, abuse, or harm others; (c) use cheats, exploits, automation software, bots, hacks, or any unauthorized third-party software designed to modify or interfere with the platform; (d) attempt to gain unauthorized access to our servers.</p>

        <h2>8. Accessibility Accommodations</h2>
        <p>NICD PRODUCTIONS LLC is committed to making our platform accessible. If you require accommodations, please contact us at nicd@nicolenium.com. We will respond to all requests within 5 business days.</p>

        <h2>9. Modifications to Terms</h2>
        <p>We reserve the right to modify these Terms at any time. We will notify users of any material changes. Continued use of the platform after changes constitutes acceptance of the new Terms.</p>
      </div>
    </div>
  );
}
