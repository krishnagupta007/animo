/* eslint-disable */
import React, { memo, useState } from 'react';
import { startAmbientSound, stopAmbientSound, setAmbientVolume as changeEngineVolume } from '../utils/AudioEngine';

interface SpacedTopic {
  id: string;
  topicName: string;
  lastReviewed: string;
  nextReview: string;
  risk: 'high' | 'medium' | 'low';
}

interface SleepLog {
  id: string;
  userId: string;
  hours: number;
  quality: number;
  date: string;
}

interface ToolkitTabProps {
  audioPlaying: 'lofi' | 'binaural' | 'brown' | null;
  setAudioPlaying: (v: 'lofi' | 'binaural' | 'brown' | null) => void;
  ambientVolume: number; // Volume state (0 - 100)
  setAmbientVolume: (v: number) => void;
  spacedTopics: SpacedTopic[];
  handleReviewTopic: (topicId: string) => void;
  handleAddSpacedTopic: (topicName: string, day: number, risk: 'high' | 'medium' | 'low') => Promise<void>;
  forgettingAlert: string | null;
  sleepHoursInput: string;
  setSleepHoursInput: (val: string) => void;
  sleepQualityInput: number;
  setSleepQualityInput: (val: number) => void;
  handleLogSleep: (e: React.FormEvent) => void;
  sleepLogs: SleepLog[];
  simulatedDay: number;

  // Synced Pomodoro props
  pomodoroSeconds: number;
  pomodoroRunning: boolean;
  setPomodoroRunning: (v: boolean) => void;
  setPomodoroSeconds: (v: number) => void;
  setPomodoroMode: (v: 'focus' | 'break') => void;
  strictExamMode: boolean;
  setStrictExamMode: (v: boolean) => void;
  cognitiveScore: number;
  fastForwardPomodoro: () => void;
  formatTimerTime: (seconds: number) => string;
  completedPomodorosCount: number;
}

export const ToolkitTab: React.FC<ToolkitTabProps> = memo(({
  audioPlaying,
  setAudioPlaying,
  ambientVolume,
  setAmbientVolume,
  spacedTopics,
  handleReviewTopic,
  handleAddSpacedTopic,
  forgettingAlert,
  sleepHoursInput,
  setSleepHoursInput,
  sleepQualityInput,
  setSleepQualityInput,
  handleLogSleep,
  sleepLogs,
  simulatedDay,

  pomodoroSeconds,
  pomodoroRunning,
  setPomodoroRunning,
  setPomodoroSeconds,
  setPomodoroMode,
  strictExamMode,
  setStrictExamMode,
  formatTimerTime,
  completedPomodorosCount,
}) => {
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);

  const handleAmbientClick = (soundId: 'lofi' | 'binaural' | 'brown') => {
    if (audioPlaying === soundId) {
      setAudioPlaying(null);
      stopAmbientSound();
    } else {
      setAudioPlaying(soundId);
      startAmbientSound(soundId);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = Number(e.target.value);
    setAmbientVolume(vol);
    changeEngineVolume(vol / 100);
  };

  // Generate simple mock month grid calendar cells (June 2026)
  // Day 1 starts on Mon (1st). Month has 30 days.
  const totalDays = 30;
  const calendarCells = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Map simulated days: Day 1 of simulation = June 13, Day 2 = June 14, Day 3 = June 15
  const currentJuneDay = 12 + simulatedDay;

  // Determine actual day of the month (in June) from the nextReview ISO date
  const getRevisionDayForTopic = (topic: SpacedTopic) => {
    try {
      const d = new Date(topic.nextReview);
      if (!isNaN(d.getTime())) {
        return d.getDate();
      }
    } catch { }
    return 15;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Ambient Sound Deck */}
      <div className="duo-card">
        <h3>Ambient Sound Soundscape</h3>
        <p style={{ fontSize: '13px', marginBottom: '16px' }}>Select binaural study layers for focus blocks.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {[
            { id: 'lofi', label: 'Lo-Fi Focus', emoji: '🎵', desc: 'Relaxed chords' },
            { id: 'binaural', label: 'Alpha Beats', emoji: '🎧', desc: 'Cognitive focus' },
            { id: 'brown', label: 'Brown Noise', emoji: '🌊', desc: 'Calming waves' },
          ].map((sound) => {
            const active = audioPlaying === sound.id;
            return (
              <button
                key={sound.id}
                className={`duo-btn-gray ${active ? 'music-card-active' : ''}`}
                onClick={() => handleAmbientClick(sound.id as 'lofi' | 'binaural' | 'brown')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '16px',
                  height: '115px',
                  transition: 'all 0.2s ease',
                  borderWidth: '2px',
                }}
              >
                <span style={{ fontSize: '28px' }}>{sound.emoji}</span>
                <span style={{ fontWeight: 800, fontSize: '14px' }}>{sound.label}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{sound.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Volume Intensity Slider */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            backgroundColor: 'rgba(142,142,147,0.03)',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '2px dashed var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12.5px', fontWeight: 800 }}>🔊 Soundscape Intensity Volume</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--duo-teal)' }}>
              {ambientVolume}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={ambientVolume}
            onChange={handleVolumeChange}
            style={{
              width: '100%',
              accentColor: 'var(--duo-teal)',
              cursor: 'pointer',
              height: '6px',
              borderRadius: '99px',
            }}
          />
        </div>

        {audioPlaying && (
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--duo-teal)' }}>
              Playing Ambient Audioscape:
            </span>
            <div className="soundwave active">
              <div className="soundwave-bar" />
              <div className="soundwave-bar" />
              <div className="soundwave-bar" />
              <div className="soundwave-bar" />
              <div className="soundwave-bar" />
            </div>
          </div>
        )}
      </div>

      {/* Synced Pomodoro Widget with Apple Counter */}
      <div className="duo-card" data-testid="pomodoro-timer">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3>{strictExamMode ? '🚨 Strict Mock Exam block' : 'Pomodoro Study Sprint'}</h3>
          <button
            onClick={() => setStrictExamMode(!strictExamMode)}
            style={{
              backgroundColor: strictExamMode ? 'var(--duo-red)' : 'var(--duo-teal)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '4px 10px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {strictExamMode ? 'Standard Mode' : 'Strict Exam Mode'}
          </button>
        </div>

        {strictExamMode && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: 'rgba(231,111,81,0.1)',
              color: 'var(--duo-red)',
              borderRadius: '8px',
              fontSize: '12px',
              marginBottom: '16px',
              fontWeight: 800,
            }}
          >
            📝 STRICT CONDITIONS: Hides all stats, timer cannot be paused, and mandatory breaks will apply!
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '42px', fontWeight: 900, fontFamily: 'monospace' }}>
              {formatTimerTime(pomodoroSeconds)}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={() => setPomodoroRunning(!pomodoroRunning)}
                className="duo-btn-teal"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                {pomodoroRunning ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={() => {
                  setPomodoroRunning(false);
                  setPomodoroSeconds(25 * 60);
                  setPomodoroMode('focus');
                }}
                className="duo-btn-gray"
                style={{ padding: '8px 16px', fontSize: '13px', boxShadow: 'none' }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Cognitive Fatigue</div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 900,
                color: cognitiveScore >= 70 ? 'var(--duo-red)' : 'var(--duo-teal)',
              }}
            >
              {cognitiveScore}%
            </div>
            <button
              onClick={fastForwardPomodoro}
              className="duo-btn-gray"
              style={{
                padding: '6px 10px',
                fontSize: '11px',
                color: 'var(--duo-orange)',
                marginTop: '8px',
                boxShadow: 'none',
              }}
            >
              ⏩ Fast Demo
            </button>
          </div> */}
        </div>

        {/* Fun Harvest Apple Animation Area */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '2px solid var(--border-color)',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            🍎 Apple Focus Harvest (Completed Blocks Today)
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minHeight: '36px', flexWrap: 'wrap' }}>
            {completedPomodorosCount === 0 ? (
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                No apples harvested yet today. Complete a focus timer to harvest your first apple!
              </span>
            ) : (
              Array.from({ length: completedPomodorosCount }).map((_, idx) => (
                <span key={idx} className="apple-emoji" title={`Timer ${idx + 1} Done!`}>
                  🍎
                </span>
              ))
            )}
          </div>
          {completedPomodorosCount > 0 && (
            <span style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: 'var(--duo-orange-dark)', marginTop: '8px' }}>
              Awesome! You harvested {completedPomodorosCount} focus apple{completedPomodorosCount > 1 ? 's' : ''} today! 🦉🎉
            </span>
          )}
        </div>
      </div>

      {/* Visual Revision Calendar */}
      <div className="duo-card">
        <h3>Spaced Repetition Calendar</h3>
        <p style={{ fontSize: '13px', marginBottom: '16px' }}>Revision calendar mapping retention curves.</p>

        {forgettingAlert && (
          <div
            style={{
              backgroundColor: 'rgba(243,167,18,0.15)',
              border: '1px solid var(--duo-orange)',
              borderRadius: '8px',
              padding: '10px',
              color: 'var(--duo-orange)',
              fontSize: '13px',
              fontWeight: 800,
              marginBottom: '16px',
            }}
          >
            ⚠️ {forgettingAlert}
          </div>
        )}

        {/* Interactive Month Grid */}
        <div style={{ backgroundColor: 'rgba(142,142,147,0.02)', padding: '16px', borderRadius: '12px', border: '2px solid var(--border-color)', marginBottom: '16px' }}>
          <strong style={{ fontSize: '14px', display: 'block', textAlign: 'center', marginBottom: '8px' }}>June 2026</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', textAlign: 'center', fontSize: '11px', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '4px' }}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <span key={i}>{d}</span>)}
          </div>

          <div className="calendar-grid">
            {calendarCells.map((day) => {
              const isActive = day === currentJuneDay;
              const scheduledTopicIndices = spacedTopics
                .map((t) => ({ t, day: getRevisionDayForTopic(t) }))
                .filter((item) => item.day === day);

              const hasRevision = scheduledTopicIndices.length > 0;
              const isCompleted = hasRevision && scheduledTopicIndices.every(item => item.t.risk === 'low');

              let classes = 'calendar-cell';
              if (isActive) classes += ' active-day';
              else if (isCompleted) classes += ' completed-day';
              else if (hasRevision) classes += ' has-revision';

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedCalendarDay(day)}
                  className={classes}
                >
                  {day}
                  {hasRevision && !isCompleted && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--duo-orange)',
                      }}
                    />
                  )}
                  {isCompleted && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: '#4cd964',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Calendar Day Detail popout */}
        {selectedCalendarDay !== null && (
          <div
            style={{
              backgroundColor: 'rgba(142,125,190,0.05)',
              border: '2px solid var(--duo-purple)',
              borderRadius: '12px',
              padding: '12px',
              marginBottom: '16px',
              fontSize: '13px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>📅 June {selectedCalendarDay} Agenda:</strong>
              <button
                onClick={() => setSelectedCalendarDay(null)}
                style={{ border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 800 }}
              >
                Close
              </button>
            </div>
            {spacedTopics
              .map((t) => ({ t, day: getRevisionDayForTopic(t) }))
              .filter((item) => item.day === selectedCalendarDay).length === 0 ? (
              <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', display: 'block', marginBottom: '8px' }}>
                No active revisions scheduled on this date. Keep learning!
              </span>
            ) : (
              spacedTopics
                .map((t) => ({ t, day: getRevisionDayForTopic(t) }))
                .filter((item) => item.day === selectedCalendarDay)
                .map((item) => (
                  <div key={item.t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0' }}>
                    <span>📖 {item.t.topicName} (Retention Risk: {item.t.risk.toUpperCase()})</span>
                    {item.t.risk !== 'low' && (
                      <button
                        onClick={() => handleReviewTopic(item.t.id)}
                        className="duo-btn-teal"
                        style={{ padding: '4px 8px', fontSize: '10px' }}
                      >
                        Mark Reviewed
                      </button>
                    )}
                  </div>
                ))
            )}

            {/* Add Agenda Inline Form */}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed var(--border-color)' }}>
              <strong style={{ fontSize: '12.5px', display: 'block', marginBottom: '8px', color: 'var(--text-primary)' }}>➕ Add Agenda Topic:</strong>
              <form onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const nameInput = form.elements.namedItem('topicName') as HTMLInputElement;
                const riskSelect = form.elements.namedItem('risk') as HTMLSelectElement;
                if (nameInput && nameInput.value.trim()) {
                  handleAddSpacedTopic(nameInput.value.trim(), selectedCalendarDay, riskSelect.value as 'high' | 'medium' | 'low');
                  nameInput.value = '';
                }
              }} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  name="topicName"
                  placeholder="e.g. React Hooks Review"
                  required
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '2px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '12px',
                    flex: '2 1 150px',
                    fontFamily: 'var(--font-duo)'
                  }}
                />
                <select
                  name="risk"
                  defaultValue="medium"
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: '2px solid var(--border-color)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '12px',
                    flex: '1 1 80px',
                    fontFamily: 'var(--font-duo)',
                    fontWeight: 'bold'
                  }}
                >
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
                <button
                  type="submit"
                  className="duo-btn-teal"
                  style={{ padding: '6px 12px', fontSize: '11px', flex: '1 1 auto' }}
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Spaced Topics list */}
        <div>
          {spacedTopics.map((topic) => (
            <div
              key={topic.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                border: '2px solid var(--border-color)',
                borderRadius: '12px',
                marginBottom: '10px',
              }}
            >
              <div>
                <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)', display: 'block' }}>
                  {topic.topicName}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Risk Level:{' '}
                  <strong
                    style={{
                      color:
                        topic.risk === 'high'
                          ? 'var(--duo-red)'
                          : topic.risk === 'medium'
                            ? 'var(--duo-orange)'
                            : 'var(--duo-teal)',
                    }}
                  >
                    {topic.risk.toUpperCase()}
                  </strong>
                </span>
              </div>

              <button
                onClick={() => handleReviewTopic(topic.id)}
                className="duo-btn-teal"
                style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '8px' }}
              >
                Mark Reviewed
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sleep Correlator */}
      <div className="duo-card">
        <h3>Sleep-to-Study Correlator</h3>
        <p style={{ fontSize: '13px', marginBottom: '16px' }}>
          Log sleep durations to correlate cognitive retention curves.
        </p>

        <form onSubmit={handleLogSleep} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <input
            type="number"
            value={sleepHoursInput}
            onChange={(e) => setSleepHoursInput(e.target.value)}
            placeholder="Hours slept (e.g. 7.5)"
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '2px solid var(--border-color)',
              outline: 'none',
              flex: 1,
              fontFamily: 'var(--font-duo)',
            }}
          />
          <select
            value={sleepQualityInput}
            onChange={(e) => setSleepQualityInput(Number(e.target.value))}
            style={{
              padding: '10px',
              borderRadius: '8px',
              border: '2px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'var(--font-duo)',
              fontWeight: 'bold',
            }}
          >
            <option value="1">Quality: 1 (Poor)</option>
            <option value="2">Quality: 2 (Fair)</option>
            <option value="3">Quality: 3 (Good)</option>
            <option value="4">Quality: 4 (Very Good)</option>
            <option value="5">Quality: 5 (Excellent)</option>
          </select>
          <button type="submit" className="duo-btn-teal" style={{ padding: '8px 16px' }}>
            Log Sleep
          </button>
        </form>

        <div style={{ borderTop: '2px solid var(--border-color)', paddingTop: '16px' }}>
          <span style={{ fontSize: '13px', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
            Sleep Correlation Indicators (Logged: {sleepLogs.length} blocks):
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>8+ Hours Sleep (Peak focus)</span>
                <strong>95% memory</strong>
              </div>
              <div className="duo-progress-bar" style={{ height: '8px', marginTop: '4px' }}>
                <div className="duo-progress-fill" style={{ width: '95%' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>6-7 Hours Sleep (Fatigue load)</span>
                <strong>60% memory</strong>
              </div>
              <div className="duo-progress-bar" style={{ height: '8px', marginTop: '4px' }}>
                <div className="duo-progress-fill" style={{ width: '60%', backgroundColor: 'var(--duo-orange)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>&lt;6 Hours Sleep (Burnout threat)</span>
                <strong>30% memory</strong>
              </div>
              <div className="duo-progress-bar" style={{ height: '8px', marginTop: '4px' }}>
                <div className="duo-progress-fill" style={{ width: '30%', backgroundColor: 'var(--duo-red)' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ToolkitTab.displayName = 'ToolkitTab';
