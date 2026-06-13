import React from 'react';

export const SubNav: React.FC = () => {
  return (
    <div 
      style={{
        position: 'sticky',
        top: '44px',
        zIndex: 90,
        height: '52px',
        backgroundColor: 'rgba(245, 245, 247, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 22px',
        width: '100%'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '1024px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span 
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '21px',
            fontWeight: 600,
            color: 'var(--color-ink)',
            letterSpacing: '0.231px'
          }}
        >
          Zenith Companion
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span 
            style={{ 
              fontSize: '12px', 
              color: 'var(--color-ink-muted-48)',
              display: 'none' /* Will show up on larger screens if needed */
            }}
            className="md-show"
          >
            Empathetic Journaling Engine
          </span>
          <a 
            href="#journal"
            className="btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 400
            }}
          >
            Start Journal
          </a>
        </div>
      </div>
    </div>
  );
};
