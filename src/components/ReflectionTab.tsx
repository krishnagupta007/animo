import React, { memo } from 'react';
import { BreathingGuide } from './BreathingGuide';

interface ReflectionTabProps {
  handleJournalSubmit: (e: React.FormEvent) => void;
  voiceActive: boolean;
  toggleVoiceMode: () => void;
  text: string;
  setText: (val: string) => void;
  setErrorMessage: (val: string | null) => void;
  errorMessage: string | null;
  journalLoading: boolean;
  loadingStep: string;
  analysisResponse: string | null;
  isEscalate: boolean;
  showBreathing: boolean;
  setShowBreathing: (val: boolean) => void;
  handleBreathingResetComplete: () => void;
}

export const ReflectionTab: React.FC<ReflectionTabProps> = memo(({
  handleJournalSubmit,
  voiceActive,
  toggleVoiceMode,
  text,
  setText,
  setErrorMessage,
  errorMessage,
  journalLoading,
  loadingStep,
  analysisResponse,
  isEscalate,
  showBreathing,
  setShowBreathing,
  handleBreathingResetComplete,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Sentiment journal space */}
      <div className="duo-card">
        <h3>Sentiment Journal Vent</h3>
        <p style={{ fontSize: '13px', marginBottom: '16px' }}>
          Vent your thoughts. Duo analyzes emotional valence loops anonymously.
        </p>

        <form onSubmit={handleJournalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={toggleVoiceMode}
              className={voiceActive ? 'duo-btn-red' : 'duo-btn-gray'}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              🎤 {voiceActive ? 'Capturing Speech...' : 'Simulate speech'}
            </button>
            {voiceActive && (
              <div className="soundwave active">
                <div className="soundwave-bar" />
                <div className="soundwave-bar" />
                <div className="soundwave-bar" />
              </div>
            )}
          </div>

          <textarea
            data-testid="journal-input"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setErrorMessage(null);
            }}
            placeholder="Share your exam concerns, stress blocks, or confidence logs..."
            style={{
              width: '100%',
              minHeight: '120px',
              borderRadius: '12px',
              border: '2px solid var(--border-color)',
              padding: '12px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'var(--font-duo)',
            }}
          />

          {errorMessage && (
            <div style={{ color: 'var(--duo-red)', fontSize: '13px', fontWeight: 800 }}>
              ⚠️ {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="duo-btn-teal" disabled={journalLoading}>
              Analyze Journal
            </button>
          </div>
        </form>

        {journalLoading && (
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                border: '3px solid var(--border-color)',
                borderTopColor: 'var(--duo-teal)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 8px auto',
              }}
            />
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{loadingStep}</span>
          </div>
        )}

        {analysisResponse && (
          <div
            data-testid="response-box"
            style={{
              marginTop: '20px',
              padding: '16px',
              borderRadius: '12px',
              backgroundColor: isEscalate ? 'rgba(231,111,81,0.1)' : 'rgba(0,168,150,0.05)',
              border: `2px solid ${isEscalate ? 'var(--duo-red)' : 'var(--duo-teal)'}`,
            }}
          >
            <h4
              style={{
                color: isEscalate ? 'var(--duo-red)' : 'var(--duo-teal)',
                fontSize: '14px',
                fontWeight: 800,
                marginBottom: '6px',
              }}
            >
              {isEscalate ? 'Immediate Support Flagged' : 'CBT Intervention Plan'}
            </h4>
            <p style={{ fontSize: '14px', margin: 0 }}>{analysisResponse}</p>
            {!isEscalate && (
              <button
                onClick={() => setShowBreathing(!showBreathing)}
                className="duo-btn-gray"
                style={{ padding: '6px 12px', fontSize: '11px', marginTop: '10px', boxShadow: 'none' }}
              >
                {showBreathing ? 'Hide Guided Breathing' : 'Start Guided Breathing'}
              </button>
            )}
          </div>
        )}
      </div>

      {showBreathing && (
        <BreathingGuide onClose={() => setShowBreathing(false)} onComplete={handleBreathingResetComplete} />
      )}

      {/* Micro-CBT Grounding Reset (Feature 4) */}
      <div className="duo-card">
        <h3>Micro-CBT Grounding Reset</h3>
        <p style={{ fontSize: '13px', marginBottom: '16px' }}>
          Reframing anxiety cycles into controllable study actions.
        </p>

        <div style={{ borderLeft: '4px solid var(--duo-teal)', paddingLeft: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>
            ANXIETY BLOCK:
          </span>
          <strong style={{ fontSize: '14px' }}>
            "I am going to fail the mock exam. My preparation is pointless."
          </strong>
        </div>

        <div style={{ borderLeft: '4px solid var(--duo-orange)', paddingLeft: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block' }}>
            REFRAMED ACTION:
          </span>
          <strong style={{ fontSize: '14px', color: 'var(--duo-orange-dark)' }}>
            "I have completed 3 spaced topics today. I will review only flashcards tonight to rest my mind."
          </strong>
        </div>
      </div>
    </div>
  );
});

ReflectionTab.displayName = 'ReflectionTab';
