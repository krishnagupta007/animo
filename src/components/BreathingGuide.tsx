/* eslint-disable */
import React, { useState, useEffect, useRef } from 'react';

type Phase = 'ready' | 'inhale' | 'hold' | 'exhale' | 'holdPost' | 'done';

interface Technique {
  id: string;
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdPost?: number;
  description: string;
  emoji: string;
}

const TECHNIQUES: Technique[] = [
  { 
    id: 'relax', 
    name: '4-7-8 Relaxing Breath', 
    inhale: 4, 
    hold: 7, 
    exhale: 8, 
    description: 'Deep relaxation technique to ease anxiety and promote sleep.',
    emoji: '🍃'
  },
  { 
    id: 'box', 
    name: '4-4-4-4 Box Breathing', 
    inhale: 4, 
    hold: 4, 
    exhale: 4, 
    holdPost: 4, 
    description: 'Clear mind and boost focus. Used by Navy SEALs.',
    emoji: '📦'
  },
  { 
    id: 'calm', 
    name: '4-2-4 Calm Breath', 
    inhale: 4, 
    hold: 2, 
    exhale: 4, 
    description: 'Quick calming breath to reset during active study blocks.',
    emoji: '🌊'
  }
];

interface BreathingGuideProps {
  onClose?: () => void;
  onComplete?: () => void;
}

export const BreathingGuide: React.FC<BreathingGuideProps> = ({ onClose, onComplete }) => {
  const [selectedTechId, setSelectedTechId] = useState<string>('relax');
  const [phase, setPhase] = useState<Phase>('ready');
  const [secondsLeft, setSecondsLeft] = useState(3);
  const [cycle, setCycle] = useState(1);
  const [isActive, setIsActive] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const technique = TECHNIQUES.find(t => t.id === selectedTechId) || TECHNIQUES[0];

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition phases
          if (phase === 'ready') {
            setPhase('inhale');
            return technique.inhale;
          } else if (phase === 'inhale') {
            if (technique.hold > 0) {
              setPhase('hold');
              return technique.hold;
            } else {
              setPhase('exhale');
              return technique.exhale;
            }
          } else if (phase === 'hold') {
            setPhase('exhale');
            return technique.exhale;
          } else if (phase === 'exhale') {
            if (technique.holdPost && technique.holdPost > 0) {
              setPhase('holdPost');
              return technique.holdPost;
            } else {
              if (cycle >= 4) {
                setPhase('done');
                setIsActive(false);
                if (onComplete) onComplete();
                return 0;
              } else {
                setCycle((c) => c + 1);
                setPhase('inhale');
                return technique.inhale;
              }
            }
          } else if (phase === 'holdPost') {
            if (cycle >= 4) {
              setPhase('done');
              setIsActive(false);
              if (onComplete) onComplete();
              return 0;
            } else {
              setCycle((c) => c + 1);
              setPhase('inhale');
              return technique.inhale;
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, cycle, isActive, technique, onComplete]);

  const handleRestart = () => {
    setPhase('ready');
    setSecondsLeft(3);
    setCycle(1);
    setIsActive(true);
  };

  const togglePause = () => {
    setIsActive(!isActive);
  };

  const handleTechChange = (techId: string) => {
    setSelectedTechId(techId);
    setPhase('ready');
    setSecondsLeft(3);
    setCycle(1);
    setIsActive(true);
  };

  // Determine static/fallback scale values when paused or ready/done
  const getInlineScale = () => {
    if (!isActive) {
      if (phase === 'inhale') {
        const progress = (technique.inhale - secondsLeft) / technique.inhale;
        return 1 + progress * 0.8;
      }
      if (phase === 'exhale') {
        const progress = (technique.exhale - secondsLeft) / technique.exhale;
        return 1.8 - progress * 0.8;
      }
      if (phase === 'hold' || phase === 'holdPost') return 1.8;
      return 1;
    }
    if (phase === 'ready' || phase === 'done') return 1;
    return undefined; // Use CSS class animations
  };

  const inlineScale = getInlineScale();

  const getCircleClass = () => {
    if (!isActive) return '';
    if (phase === 'inhale') return 'breathing-ring-inhale';
    if (phase === 'hold' || phase === 'holdPost') return 'breathing-ring-hold';
    if (phase === 'exhale') return 'breathing-ring-exhale';
    return '';
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'ready': return 'Get Ready';
      case 'inhale': return 'Inhale Deeply';
      case 'hold': return 'Hold Breath';
      case 'exhale': return 'Exhale Slowly';
      case 'holdPost': return 'Hold Empty';
      case 'done': return 'Session Complete';
    }
  };

  const getPhaseDescription = () => {
    switch (phase) {
      case 'ready': return 'Find a comfortable posture. We will begin shortly.';
      case 'inhale': return 'Breathe in through your nose, letting your belly expand.';
      case 'hold': return 'Keep the air inside your lungs. Relax your shoulders.';
      case 'exhale': return 'Exhale completely through your mouth, releasing all tension.';
      case 'holdPost': return 'Keep your lungs empty before the next breath.';
      case 'done': return 'Well done! You have reset your focus. Ready to return to your day.';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'var(--duo-teal)';
      case 'hold': return 'var(--duo-orange)';
      case 'exhale': return '#5ac8fa';
      case 'holdPost': return '#e5a93c';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  };

  const ringStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: getPhaseColor(),
    opacity: 0.4,
    transform: inlineScale !== undefined ? `scale(${inlineScale})` : undefined,
    transition: phase === 'ready' || phase === 'done' ? 'transform 0.5s ease-in-out' : 'none',
    zIndex: 2,
    ['--inhale-duration' as any]: `${technique.inhale}s`,
    ['--exhale-duration' as any]: `${technique.exhale}s`
  };

  const outerRingStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: getPhaseColor(),
    opacity: 0.15,
    transform: inlineScale !== undefined ? `scale(${inlineScale * 1.25})` : undefined,
    transition: phase === 'ready' || phase === 'done' ? 'transform 0.5s ease-in-out' : 'none',
    zIndex: 1,
    ['--inhale-duration' as any]: `${technique.inhale}s`,
    ['--exhale-duration' as any]: `${technique.exhale}s`
  };

  return (
    <div 
      style={{
        backgroundColor: 'var(--bg-card)',
        borderRadius: '20px',
        border: '2px solid var(--border-color)',
        padding: '28px 24px',
        maxWidth: '520px',
        width: '100%',
        margin: '16px auto',
        textAlign: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      }}
      className="fade-in"
      data-testid="breathing-guide"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 800 }}>🦉 Breathing Center</h3>
        {onClose && (
          <button 
            onClick={onClose}
            aria-label="Close breathing session"
            style={{
              backgroundColor: 'rgba(142, 142, 147, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Technique Selector Tabs */}
      <div 
        style={{
          display: 'flex',
          backgroundColor: 'rgba(142, 142, 147, 0.05)',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '20px',
          border: '1px solid var(--border-color)'
        }}
      >
        {TECHNIQUES.map((tech) => {
          const selected = tech.id === selectedTechId;
          return (
            <button
              key={tech.id}
              onClick={() => handleTechChange(tech.id)}
              style={{
                flex: 1,
                border: 'none',
                background: selected ? 'var(--bg-card)' : 'none',
                color: selected ? 'var(--duo-teal)' : 'var(--text-secondary)',
                fontWeight: selected ? 800 : 600,
                fontSize: '11px',
                padding: '8px 4px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: selected ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                borderWidth: selected ? '1px' : '0px',
                borderColor: selected ? 'var(--border-color)' : 'transparent',
                borderStyle: 'solid'
              }}
            >
              <span style={{ marginRight: '4px' }}>{tech.emoji}</span>
              {tech.name.split(' ')[1]}
            </button>
          );
        })}
      </div>

      {/* Description text */}
      <div style={{ padding: '0 8px', marginBottom: '20px' }}>
        <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          "{technique.description}"
        </p>
      </div>

      {/* Cycle Indicator */}
      {phase !== 'done' && (
        <div 
          style={{ 
            fontSize: '12px', 
            color: 'var(--duo-teal)', 
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
          data-testid="cycle-indicator"
        >
          Cycle {cycle} of 4
        </div>
      )}

      {/* Smooth CSS Scaled Visual Rings */}
      <div 
        style={{
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          margin: '20px 0'
        }}
      >
        <div 
          className={getCircleClass()} 
          style={outerRingStyle} 
        />
        <div 
          className={getCircleClass()} 
          style={ringStyle} 
        />

        {/* Center core text */}
        <div 
          style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card)',
            border: '3px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}
        >
          <span 
            style={{ 
              fontSize: '28px', 
              fontWeight: 900, 
              color: 'var(--text-primary)',
              lineHeight: 1
            }}
            data-testid="timer-count"
          >
            {phase === 'done' ? '🎉' : secondsLeft}
          </span>
          {phase !== 'done' && (
            <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '2px' }}>
              sec
            </span>
          )}
        </div>
      </div>

      {/* Instructional text prompts */}
      <div style={{ minHeight: '72px', marginBottom: '20px' }}>
        <h4 
          style={{ 
            color: 'var(--text-primary)', 
            fontSize: '20px', 
            fontWeight: 800,
            margin: '0 0 4px 0'
          }}
          data-testid="breathing-state-text"
        >
          {getPhaseText()}
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', margin: 0, padding: '0 12px' }}>
          {getPhaseDescription()}
        </p>
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        {phase !== 'done' ? (
          <>
            <button 
              onClick={togglePause}
              className="duo-btn-teal"
              style={{
                fontSize: '13px',
                padding: '8px 20px'
              }}
            >
              {isActive ? 'Pause' : 'Resume'}
            </button>
            <button 
              onClick={handleRestart}
              className="duo-btn-gray"
              style={{
                fontSize: '13px',
                padding: '8px 20px',
                boxShadow: 'none'
              }}
            >
              Reset
            </button>
          </>
        ) : (
          <button 
            onClick={handleRestart}
            className="duo-btn-teal"
            style={{
              fontSize: '13px',
              padding: '8px 20px'
            }}
          >
            Practice Again
          </button>
        )}
      </div>
    </div>
  );
};
