import React from 'react';

export const GlobalNav: React.FC = () => {
  return (
    <nav 
      aria-label="Global Navigation" 
      style={{
        backgroundColor: 'var(--color-surface-black)',
        height: '44px',
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 22px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
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
        {/* Brand Logo */}
        <a 
          href="#" 
          style={{
            color: 'var(--color-body-on-dark)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          className="focus-ring"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span>zenith</span>
        </a>

        {/* Links */}
        <div 
          style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center'
          }}
        >
          <a 
            href="#overview" 
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              fontSize: '12px',
              fontFamily: 'var(--font-text)',
              transition: 'color 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
            className="focus-ring"
          >
            Overview
          </a>
          <a 
            href="#journal" 
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              fontSize: '12px',
              fontFamily: 'var(--font-text)',
              transition: 'color 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
            className="focus-ring"
          >
            Journal
          </a>
          <a 
            href="#science" 
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              fontSize: '12px',
              fontFamily: 'var(--font-text)',
              transition: 'color 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}
            className="focus-ring"
          >
            Science
          </a>
        </div>

        {/* Action Callout */}
        <a 
          href="#journal"
          style={{
            backgroundColor: 'var(--color-primary-on-dark)',
            color: 'var(--color-surface-black)',
            fontSize: '11px',
            fontWeight: 600,
            textDecoration: 'none',
            padding: '4px 10px',
            borderRadius: '9999px',
            transition: 'background-color 0.15s ease'
          }}
          className="focus-ring btn-dark-hover"
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-on-dark)'}
        >
          Try Now
        </a>
      </div>
    </nav>
  );
};
