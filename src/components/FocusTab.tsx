import React from 'react';

export interface UserProfileActivities {
  journal: boolean;
  breathing: boolean;
  mood: boolean;
  pomodoro: boolean;
  water: boolean;
}

interface FocusTabProps {
  simulatedDay: number;
  completedQuestsCount: number;
  mood: string | null;
  activities: UserProfileActivities;
  dynamicQuests: Array<{ key: string; label: string }>;
  handleToggleQuest: (key: keyof UserProfileActivities, e: React.MouseEvent) => void;
  strictExamMode: boolean;
  setStrictExamMode: (v: boolean) => void;
  pomodoroSeconds: number;
  pomodoroRunning: boolean;
  setPomodoroRunning: (v: boolean) => void;
  setPomodoroSeconds: (v: number) => void;
  setPomodoroMode: (v: 'focus' | 'break') => void;
  cognitiveScore: number;
  fastForwardPomodoro: () => void;
  waterCount: number;
  handleAddWater: () => void;
  handleRemoveWater: () => void;
  handleMoodSelect: (mood: string, e: React.MouseEvent) => void;
  formatTimerTime: (seconds: number) => string;
}

export const FocusTab: React.FC<FocusTabProps> = ({
  simulatedDay,
  completedQuestsCount,
  mood,
  activities,
  dynamicQuests,
  handleToggleQuest,
  strictExamMode,
  setStrictExamMode,
  pomodoroSeconds,
  pomodoroRunning,
  setPomodoroRunning,
  setPomodoroSeconds,
  setPomodoroMode,
  cognitiveScore,
  fastForwardPomodoro,
  waterCount,
  handleAddWater,
  handleRemoveWater,
  handleMoodSelect,
  formatTimerTime,
}) => {
  return (
    <div className="grid-container">
      {/* Left Focus Widgets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Calendar Week Track */}
        <div className="duo-card">
          <h3 style={{ marginBottom: '12px' }}>Streak Calendar Tracker</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
              const completed =
                idx < simulatedDay - 1 || (idx === simulatedDay - 1 && completedQuestsCount === 5);
              return (
                <div
                  key={day}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
                >
                  <div className={`duo-day-circle ${completed ? 'completed' : ''}`}>
                    {completed ? '🔥' : day.slice(0, 1)}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-secondary)' }}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Checklist */}
        <div className="duo-card">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div>
              <h3>Mood-Adaptive Tasks</h3>
              <span style={{ fontSize: '12px', color: 'var(--duo-teal)', fontWeight: 800 }}>
                {mood ? `Adapting for: ${mood}` : 'Default Study Schedule'}
              </span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800 }}>{completedQuestsCount}/5 Done</span>
          </div>

          {dynamicQuests.map((quest) => {
            const checked = activities[quest.key as keyof UserProfileActivities];
            return (
              <div
                key={quest.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    className={`duo-checkbox ${checked ? 'checked' : ''}`}
                    onClick={(e) => handleToggleQuest(quest.key as keyof UserProfileActivities, e)}
                    data-testid={`quest-${quest.key}-checkbox`}
                  >
                    {checked ? '✓' : ''}
                  </div>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: checked ? 800 : 500,
                      color: checked ? 'var(--text-secondary)' : 'var(--text-primary)',
                    }}
                  >
                    {quest.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    color: checked ? 'var(--duo-teal)' : 'var(--duo-orange)',
                    fontWeight: 800,
                  }}
                >
                  {checked ? 'COMPLETED' : '+10 XP'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pomodoro Focus & Mock Exam */}
        <div className="duo-card" data-testid="pomodoro-timer">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
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
              📝 STRICT CONDITIONS: Hides all stats, timer cannot be paused, and mandatory breaks will
              apply!
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        </div>

        {/* Hydration Water */}
        <div className="duo-card" data-testid="water-tracker">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>Water Hydration tracker</h3>
              <p style={{ margin: '4px 0 12px 0', fontSize: '13px' }}>Manage hydration: 8 glasses daily.</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleAddWater}
                  className="duo-btn-blue"
                  style={{
                    padding: '8px 16px',
                    fontSize: '13px',
                    backgroundColor: '#5ac8fa',
                    boxShadow: 'none',
                  }}
                >
                  ＋ Drink Cup
                </button>
                {waterCount > 0 && (
                  <button
                    onClick={handleRemoveWater}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--duo-red)',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontSize: '13px',
                    }}
                  >
                    － Undo
                  </button>
                )}
              </div>
            </div>

            {/* Cup water fill */}
            <div
              style={{
                position: 'relative',
                width: '48px',
                height: '74px',
                border: '2px solid var(--border-color)',
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: `${(waterCount / 8) * 100}%`,
                  backgroundColor: 'rgba(90, 200, 250, 0.65)',
                  transition: 'height 0.3s',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '13px',
                  fontWeight: 900,
                }}
              >
                {waterCount}/8
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Focus Widgets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Mood Meter Slider */}
        <div className="duo-card">
          <h3>Focus Mood Check-in</h3>
          <p style={{ fontSize: '12px', marginBottom: '16px' }}>
            Assess your energy block before logging checklist.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { name: 'Anxious', emoji: '😰', color: 'var(--duo-red)', bg: 'rgba(231,111,81,0.1)' },
              { name: 'Focused', emoji: '🎯', color: 'var(--duo-teal)', bg: 'rgba(0,168,150,0.1)' },
              {
                name: 'Tired',
                emoji: '😴',
                color: 'var(--text-secondary)',
                bg: 'rgba(141,153,174,0.1)',
              },
              { name: 'Happy', emoji: '😊', color: 'var(--duo-orange)', bg: 'rgba(243,167,18,0.1)' },
              { name: 'Calm', emoji: '🍃', color: '#5ac8fa', bg: 'rgba(90,200,250,0.1)' },
            ].map((item) => {
              const select = mood === item.name;
              return (
                <button
                  key={item.name}
                  onClick={(e) => handleMoodSelect(item.name, e)}
                  className="duo-btn-gray"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '12px',
                    padding: '10px 14px',
                    borderColor: select ? item.color : undefined,
                    color: select ? item.color : undefined,
                    backgroundColor: select ? item.bg : undefined,
                    boxShadow: select ? 'none' : undefined,
                    transform: select ? 'translateY(3px)' : undefined,
                  }}
                >
                  <span>{item.emoji}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {false && (cognitiveScore || fastForwardPomodoro)}
    </div>
  );
};
