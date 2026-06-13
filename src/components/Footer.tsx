import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer 
      style={{
        backgroundColor: 'var(--color-canvas-parchment)',
        color: 'var(--color-ink-muted-80)',
        fontFamily: 'var(--font-text)',
        fontSize: '12px',
        padding: '64px 22px 32px 22px',
        width: '100%',
        marginTop: 'auto',
        borderTop: '1px solid var(--color-hairline)'
      }}
    >
      <div 
        style={{
          maxWidth: '1024px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}
      >
        {/* Footnote Disclaimers */}
        <div 
          style={{ 
            color: 'var(--color-ink-muted-48)', 
            borderBottom: '1px solid var(--color-hairline)',
            paddingBottom: '20px',
            lineHeight: '1.5'
          }}
        >
          <p style={{ margin: '0 0 8px 0' }}>
            * Zenith Companion is a digital reflection and self-guided mindfulness toolkit. It is not a substitute for clinical psychiatric care, medical diagnosis, or professional therapy.
          </p>
          <p style={{ margin: 0 }}>
            If you are experiencing severe distress or thoughts of self-harm, please reach out to emergency resources or professional support hotlines immediately.
          </p>
        </div>

        {/* Link Columns Grid */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px'
          }}
        >
          {/* Col 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: '12px' }}>Explore Zenith</span>
            <a href="#overview" style={{ color: 'var(--color-ink-muted-80)', textDecoration: 'none' }}>Overview</a>
            <a href="#features" style={{ color: 'var(--color-ink-muted-80)', textDecoration: 'none' }}>Features</a>
            <a href="#science" style={{ color: 'var(--color-ink-muted-80)', textDecoration: 'none' }}>Science</a>
          </div>

          {/* Col 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: '12px' }}>Wellness Services</span>
            <a href="#journal" style={{ color: 'var(--color-ink-muted-80)', textDecoration: 'none' }}>Conversational Journal</a>
            <a href="#breathing" style={{ color: 'var(--color-ink-muted-80)', textDecoration: 'none' }}>Breathing Guides</a>
            <a href="#mindfulness" style={{ color: 'var(--color-ink-muted-80)', textDecoration: 'none' }}>Mindfulness Programs</a>
          </div>

          {/* Col 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: '12px' }}>Account & Support</span>
            <a href="#profile" style={{ color: 'var(--color-ink-muted-80)', textDecoration: 'none' }}>Manage Account</a>
            <a href="#privacy" style={{ color: 'var(--color-ink-muted-80)', textDecoration: 'none' }}>Privacy Policy</a>
            <a href="#terms" style={{ color: 'var(--color-ink-muted-80)', textDecoration: 'none' }}>Terms of Service</a>
          </div>

          {/* Col 4 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-ink)', fontSize: '12px' }}>Zenith Values</span>
            <a href="#accessibility" style={{ color: 'var(--color-ink-muted-80)', textDecoration: 'none' }}>Accessibility</a>
            <a href="#ethics" style={{ color: 'var(--color-ink-muted-80)', textDecoration: 'none' }}>Ethics & AI Safety</a>
            <a href="#transparency" style={{ color: 'var(--color-ink-muted-80)', textDecoration: 'none' }}>Transparency</a>
          </div>
        </div>

        {/* Copyright & Legal Row */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: 'var(--color-ink-muted-48)',
            marginTop: '16px',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <span>Copyright © 2026 Zenith Inc. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#privacy" style={{ color: 'var(--color-ink-muted-48)', textDecoration: 'none' }}>Privacy Policy</a>
            <span>|</span>
            <a href="#terms" style={{ color: 'var(--color-ink-muted-48)', textDecoration: 'none' }}>Terms of Use</a>
            <span>|</span>
            <a href="#sales" style={{ color: 'var(--color-ink-muted-48)', textDecoration: 'none' }}>Sales and Refunds</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
