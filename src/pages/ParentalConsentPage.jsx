
import React from 'react';
import { Helmet } from 'react-helmet';

export default function ParentalConsentPage() {
  return (
    <div className="min-h-screen py-24 bg-background">
      <Helmet><title>Parental Consent | NICD PRODUCTIONS LLC</title></Helmet>
      <div className="container max-w-4xl mx-auto px-4 prose prose-invert prose-green">
        <h1 className="text-4xl font-black mb-8">Parental Consent & Minor Protection</h1>
        <p className="text-muted-foreground mb-8">Last Updated: June 1, 2026</p>

        <h2>1. Age Requirements</h2>
        <p>Users must be at least 18 years of age to create an account independently. Users under 18 must obtain verifiable parental consent before registering or playing on the NICD PRODUCTIONS LLC platform.</p>

        <h2>2. Verification Process</h2>
        <p>During registration, if a user indicates they are under 18, we require the email address of a parent or legal guardian. We will send a consent form to that email address. The account will remain restricted until the parent/guardian completes the verification process.</p>

        <h2>3. Data Collection for Minors</h2>
        <p>For users under 18, we collect only the minimum amount of information necessary to operate the games (username, password, game statistics). We do NOT collect precise geolocation data from minors.</p>

        <h2>4. Minor Protections</h2>
        <p>To protect our younger players, NICD PRODUCTIONS LLC enforces the following rules for minor accounts:</p>
        <ul>
          <li><strong>No Data Sharing:</strong> We do not share minor data with third parties for marketing purposes.</li>
          <li><strong>No Targeted Ads:</strong> Minor accounts will not receive behaviorally targeted advertising.</li>
          <li><strong>Chat Restrictions:</strong> Parents can opt to disable live A/V chat and text chat for their child's account.</li>
        </ul>

        <h2>5. Parental Rights</h2>
        <p>Parents have the right to review their child's personal information, request deletion, and refuse further collection. To exercise these rights, please email privacy@nicdproductions.com from the verified parent email address.</p>
      </div>
    </div>
  );
}
