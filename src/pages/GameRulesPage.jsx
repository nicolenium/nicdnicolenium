
import React from 'react';
import { Helmet } from 'react-helmet';

export default function GameRulesPage() {
  return (
    <div className="min-h-screen py-24 bg-background">
      <Helmet><title>Game Rules | NICD PRODUCTIONS LLC</title></Helmet>
      <div className="container max-w-4xl mx-auto px-4 prose prose-invert prose-green">
        <h1 className="text-4xl font-black mb-8">Game Rules & Fair Play</h1>
        <p className="text-muted-foreground mb-8">Last Updated: June 1, 2026</p>

        <h2>1. Fair Play Policy</h2>
        <p>NICD PRODUCTIONS LLC is committed to providing a fair, competitive environment. The use of external assistance, including but not limited to chess engines, checkers solvers, AI bots, or human assistance during rated matches or tournaments is strictly prohibited.</p>

        <h2>2. Anti-Cheating Enforcement</h2>
        <p>We employ advanced statistical analysis and behavioral tracking to detect cheating. If an account is found to be using unauthorized assistance, it will be immediately permanently banned, and all tournament prizes will be forfeited.</p>

        <h2>3. Code of Conduct</h2>
        <p>Players must treat each other with respect. The following behaviors are prohibited in chat, A/V communication, and usernames:</p>
        <ul>
          <li>Harassment, bullying, or threats.</li>
          <li>Hate speech, racism, sexism, or discrimination.</li>
          <li>Spamming or flooding the chat.</li>
          <li>Stalling (intentionally letting the clock run down in a lost position).</li>
        </ul>

        <h2>4. Violation Consequences</h2>
        <p>Violations of the Code of Conduct may result in:</p>
        <ol>
          <li>A formal warning.</li>
          <li>Temporary suspension of chat privileges.</li>
          <li>Temporary account suspension.</li>
          <li>Permanent account termination.</li>
        </ol>

        <h2>5. Dispute Resolution</h2>
        <p>If you believe an opponent has violated these rules, use the in-game reporting tool. Our moderation team reviews all reports. Decisions made by the moderation team regarding game outcomes and bans are final.</p>

        <h2>6. Refund Policy</h2>
        <p>Entry fees for tournaments are non-refundable once the tournament has begun. If a tournament is canceled by NICD PRODUCTIONS LLC, all entry fees will be refunded to the original payment method.</p>
      </div>
    </div>
  );
}
