
import React from 'react';

export default function TermsAndConditionsContent() {
  return (
    <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">1. Game Rules & Gameplay</h2>
        <p className="mb-2">By participating in any game on the NICD NICOLENIUM platform, you agree to abide by the official rulesets established for each specific game variant.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Fair play is strictly enforced. The use of external assistance, engines, or unauthorized software is prohibited.</li>
          <li>Exploiting bugs or glitches to gain an unfair advantage will result in immediate account suspension.</li>
          <li>All match results recorded by the server are final and binding.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">2. Player Responsibilities</h2>
        <p className="mb-2">Players are expected to maintain a high standard of conduct and sportsmanship.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Harassment, hate speech, or toxic behavior in chat or voice communications is strictly forbidden.</li>
          <li>Players must complete matches they initiate. Frequent abandonment may lead to matchmaking penalties.</li>
          <li>Account sharing or boosting is not allowed.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">3. Payment & Prizes</h2>
        <p className="mb-2">For games involving entry fees or prize pools:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Entry fees are non-refundable once a match or tournament has commenced.</li>
          <li>Prize distributions are handled automatically based on the final verified standings.</li>
          <li>Users are solely responsible for any taxes applicable to their winnings in their respective jurisdictions.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">4. Privacy & Data</h2>
        <p className="mb-2">We are committed to protecting your personal information.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Gameplay data, including move history and chat logs, may be recorded for moderation and anti-cheat analysis.</li>
          <li>We do not sell your personal data to third parties.</li>
          <li>You may adjust your profile visibility and data sharing preferences in your account settings.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">5. Liability & Disclaimers</h2>
        <p className="mb-2">The platform is provided "as is" without warranties of any kind.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>NICD NICOLENIUM is not liable for losses incurred due to technical issues, disconnects, or server downtime.</li>
          <li>We reserve the right to cancel or void matches if technical anomalies are detected.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">6. Account & Conduct</h2>
        <p className="mb-2">Your account is your responsibility.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>You must provide accurate information during registration.</li>
          <li>We reserve the right to suspend or terminate accounts that violate these terms without prior notice.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">7. Intellectual Property</h2>
        <p className="mb-2">All platform content, including logos, designs, and software, is the property of NICD NICOLENIUM.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Users are granted a limited, non-exclusive license to use the platform for personal entertainment.</li>
          <li>Unauthorized reproduction or distribution of platform assets is prohibited.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">8. Modifications & Updates</h2>
        <p className="mb-2">We reserve the right to modify these terms at any time.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Significant changes will be communicated via platform notifications or email.</li>
          <li>Continued use of the platform constitutes acceptance of the updated terms.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-foreground mb-3">9. Contact & Support</h2>
        <p className="mb-2">If you have questions or need to report an issue:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Contact our support team via the Help Center or support@nicd.com.</li>
          <li>Disputes regarding match outcomes must be filed within 24 hours of match completion.</li>
        </ul>
      </section>
    </div>
  );
}
