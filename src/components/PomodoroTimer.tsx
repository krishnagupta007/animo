import React, { useState, useEffect, useRef } from 'react';

interface PomodoroTimerProps {
  onComplete?: () => void;
}

type TimerMode = 'focus' | 'break';

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onComplete }) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleTimerFinish();
            return mode === 'focus' ? 5 * 60 : 25 * 60; // reset to next mode
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const handleTimerFinish = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      setSessionsCompleted((s) => s + 1);
      if (onComplete) onComplete();
      alert('Focus session complete! Time for a short break.');
      setMode('break');
      setSecondsLeft(5 * 60);
    } else {
      alert('Break complete! Back to focus.');
      setMode('focus');
      setSecondsLeft(25 * 60);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode('focus');
    setSecondsLeft(25 * 60);
  };

  // Debug fast-forward to test completion easily
  const fastForward = () => {
    setSecondsLeft(3); // 3 seconds remaining
    setIsRunning(true);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = mode === 'focus' 
    ? ((25 * 60 - secondsLeft) / (25 * 60)) * 100 
    : ((5 * 60 - secondsLeft) / (5 * 60)) * 100;

  return (
    <div 
      style={{
        backgroundColor: 'var(--color-surface-tile-2)',
        borderRadius: 'var(--rounded-lg)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px',
        textAlign: 'center'
      }}
      data-testid="pomodoro-timer"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ color: '#ffffff', fontSize: '18px' }}>Pomodoro Study Timer</h3>
        <span 
          style={{ 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            color: mode === 'focus' ? 'var(--color-primary-on-dark)' : '#34c759',
            backgroundColor: mode === 'focus' ? 'rgba(41, 151, 255, 0.15)' : 'rgba(52, 199, 89, 0.15)',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontWeight: 600
          }}
        >
          {mode === 'focus' ? 'Focus Period' : 'Break Time'}
        </span>
      </div>

      <div style={{ margin: '24px 0' }}>
        {/* Visual Clock Display */}
        <div style={{ fontSize: '48px', fontWeight: 700, color: '#ffffff', fontFamily: 'monospace' }}>
          {formatTime(secondsLeft)}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--color-body-muted)', marginTop: '4px' }}>
          Sessions Completed Today: <strong>{sessionsCompleted}</strong>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ 
        width: '100%', 
        height: '6px', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '999px',
        overflow: 'hidden',
        marginBottom: '20px'
      }}>
        <div style={{ 
          width: `${progressPercent}%`, 
          height: '100%', 
          backgroundColor: mode === 'focus' ? 'var(--color-primary-on-dark)' : '#34c759',
          transition: 'width 0.2s linear'
        }} />
      </div>

      {/* Control Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'center' }}>
        <button 
          onClick={toggleTimer}
          className="btn-primary"
          style={{
            fontSize: '13px',
            padding: '8px 16px',
            backgroundColor: isRunning ? 'rgba(255,255,255,0.15)' : 'var(--color-primary)'
          }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button 
          onClick={resetTimer}
          className="btn-secondary"
          style={{
            fontSize: '13px',
            padding: '8px 16px',
            borderColor: 'rgba(255, 255, 255, 0.2)',
            color: '#ffffff'
          }}
        >
          Reset
        </button>
        <button 
          onClick={fastForward}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff9f0a',
            fontSize: '11px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
          title="Fast-forward timer to last 3 seconds for demonstration"
        >
          ⏩ Demo Fast
        </button>
      </div>
    </div>
  );
};
