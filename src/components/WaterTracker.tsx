import React, { useState, useEffect } from 'react';

interface WaterTrackerProps {
  initialGlasses?: number;
  onTargetReached?: () => void;
  onGlassesChange?: (glasses: number) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({ 
  initialGlasses = 0, 
  onTargetReached,
  onGlassesChange
}) => {
  const [glasses, setGlasses] = useState(initialGlasses);

  useEffect(() => {
    setGlasses(initialGlasses);
  }, [initialGlasses]);

  const addGlass = () => {
    if (glasses >= 8) return;
    
    const newCount = glasses + 1;
    setGlasses(newCount);
    if (onGlassesChange) onGlassesChange(newCount);

    if (newCount === 8 && onTargetReached) {
      onTargetReached();
    }
  };

  const removeGlass = () => {
    if (glasses <= 0) return;
    const newCount = glasses - 1;
    setGlasses(newCount);
    if (onGlassesChange) onGlassesChange(newCount);
  };

  const fillPercentage = (glasses / 8) * 100;

  return (
    <div 
      style={{
        backgroundColor: 'var(--color-surface-tile-2)',
        borderRadius: 'var(--rounded-lg)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}
      data-testid="water-tracker"
    >
      <div style={{ flex: 1, textAlign: 'left' }}>
        <h3 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '4px' }}>Water Intake Tracker</h3>
        <p style={{ color: 'var(--color-body-muted)', fontSize: '12px', margin: 0 }}>
          Higher study hours demand proper hydration. Target: 8 glasses (2.0L) daily.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
          <button 
            onClick={addGlass}
            className="btn-primary"
            style={{
              padding: '6px 14px',
              fontSize: '13px',
              backgroundColor: '#5ac8fa'
            }}
          >
            ＋ Add Glass
          </button>
          {glasses > 0 && (
            <button 
              onClick={removeGlass}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff453a',
                fontSize: '13px',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              － Remove
            </button>
          )}
        </div>
      </div>

      {/* SVG animated water container */}
      <div style={{ position: 'relative', width: '60px', height: '90px' }}>
        {/* Glass container outline */}
        <div 
          style={{
            width: '100%',
            height: '100%',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
            position: 'absolute',
            bottom: 0,
            left: 0,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.03)'
          }}
        >
          {/* Water fill */}
          <div 
            style={{
              width: '100%',
              height: `${fillPercentage}%`,
              backgroundColor: 'rgba(90, 200, 250, 0.6)',
              position: 'absolute',
              bottom: 0,
              left: 0,
              transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Wave effect overlay */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '200%',
                height: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                transform: 'translateX(-50%)',
                animation: glasses > 0 ? 'wave 2s linear infinite' : 'none'
              }}
            />
          </div>
        </div>

        {/* Counter label overlay */}
        <span 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '13px',
            fontWeight: 700,
            color: glasses > 3 ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
            pointerEvents: 'none',
            textShadow: '0 1px 3px rgba(0,0,0,0.5)'
          }}
        >
          {glasses}/8
        </span>
      </div>

      <style>{`
        @keyframes wave {
          0% { transform: translateX(-50%) skewY(-3deg); }
          50% { transform: translateX(-25%) skewY(3deg); }
          100% { transform: translateX(0%) skewY(-3deg); }
        }
      `}</style>
    </div>
  );
};
