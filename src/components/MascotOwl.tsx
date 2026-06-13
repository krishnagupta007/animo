import React from 'react';

interface MascotOwlProps {
  message?: string;
  expression?: 'happy' | 'stressed' | 'focused' | 'cheering';
}

export const MascotOwl: React.FC<MascotOwlProps> = ({ message, expression = 'happy' }) => {
  const getMascotEmoji = () => {
    switch (expression) {
      case 'stressed': return '😰';
      case 'focused': return '🎯';
      case 'cheering': return '🎉';
      default: return '🦉';
    }
  };

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        backgroundColor: message ? 'var(--bg-card)' : 'transparent',
        border: message ? '2px solid var(--border-color)' : 'none',
        borderBottom: message ? '5px solid var(--border-color)' : 'none',
        borderRadius: 'var(--rounded-lg)',
        padding: message ? '20px 24px' : '0',
        marginBottom: message ? '24px' : '0',
        transition: 'border-color 0.2s, background-color 0.2s'
      }}
    >
      <div className="duo-mascot" style={{ fontSize: message ? '56px' : '64px' }} aria-hidden="true">
        {getMascotEmoji()}
      </div>
      {message && (
        <div className="duo-speech-bubble" style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)' }}>
            {message}
          </p>
        </div>
      )}
    </div>
  );
};
