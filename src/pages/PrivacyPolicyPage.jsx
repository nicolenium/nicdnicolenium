
import React from 'react';
import { Helmet } from 'react-helmet';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-24 bg-background">
      <Helmet><title>Privacy Policy | NICD PRODUCTIONS LLC</title></Helmet>
      <div className="container max-w-4xl mx-auto px-4 prose prose-invert prose-green">
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground text-lg mb-12 font-medium">Last Updated: June 1, 2026</p>

        <h2>1. Data Controller</h2>
        <p><strong>NICD PRODUCTIONS LLC</strong> (operating the NICOLENIUM platform) is the data controller responsible for your personal information collected through this platform. Our registered address is 600 Mamaroneck Avenue #400, Harrison, NY, 10528.</p>

        <h2>2. Information We Collect</h2>
        <p>We collect the following types of information to provide the NICOLENIUM experience:</p>
        <ul>
          <li><strong>Account Information:</strong> Email address, username, password (encrypted).</li>
          <li><strong>Game Data:</strong> Match history, ELO ratings, moves, chat logs, and tournament participation.</li>
          <li><strong>Technical Data:</strong> IP addresses, browser type, device information, and cookies.</li>
        </ul>

        <h2>3. NY SHIELD Act Compliance</h2>
        <p>We implement and maintain reasonable administrative, technical, and physical safeguards to protect your personal information in compliance with the New York Stop Hacks and Improve Electronic Data Security (SHIELD) Act.</p>

        <h2>4. GDPR and CCPA Rights</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request deletion of your personal data.</li>
          <li>Opt-out of the sale of your personal data (Note: We do not sell your data).</li>
          <li>Correct inaccurate data.</li>
        </ul>
        <p>To exercise these rights, contact contact@nicdnicolenium.com.</p>

        <h2>5. Cookies and Tracking</h2>
        <p>We use cookies to maintain session state, remember your preferences (like language and theme), and analyze platform usage. You can control cookie preferences through your browser settings.</p>

        <h2>6. Data Retention</h2>
        <p>We retain your account information for as long as your account is active. Game statistics are retained indefinitely for leaderboard integrity but can be anonymized upon request. If you delete your account, your personal data will be removed within 30 days.</p>

        <h2>7. Third-Party Services</h2>
        <p>We may share data with trusted third-party service providers (e.g., secure payment processors, hosting, analytics) solely for the purpose of operating our platform. These providers are bound by strict confidentiality agreements and data processing addendums.</p>
        
        <h2>8. Contact Us</h2>
        <p>If you have questions about this Privacy Policy, please contact our Data Protection Officer at nicolenium@nicdproductions.com or write to us at our Harrison, NY address.</p>
      </div>
    </div>
  );
}
