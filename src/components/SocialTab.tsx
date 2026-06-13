import React from 'react';

interface LeaderboardItem {
  id: string;
  name: string;
  avatar: string;
  streak: number;
  score: number;
  isUser?: boolean;
}

interface SocialTabProps {
  leaderboardData: LeaderboardItem[];
}

export const SocialTab: React.FC<SocialTabProps> = ({ leaderboardData }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Global Leaderboard - Disabled by User Request */}
      <div className="duo-card" data-testid="leaderboard" style={{ padding: '24px', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '8px' }}>🏆 Leaderboard</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '16px' }}>
          The Global Division League ladder is currently paused. Keep building your daily study streaks!
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' }}>
          {leaderboardData.map((user, idx) => (
            <div
              key={user.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                backgroundColor: user.isUser ? 'rgba(142,125,190,0.1)' : 'rgba(142,142,147,0.02)',
                borderRadius: '12px',
                border: user.isUser ? '2px solid var(--duo-purple)' : '1px solid var(--border-color)',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: user.isUser ? 800 : 600,
                  color: 'var(--text-primary)',
                }}
              >
                {idx + 1}. {user.avatar} {user.name} {user.isUser && '(You)'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 800 }}>
                🔥 {user.streak} days • {user.score} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Virtual Body Double (Feature 10) */}
      <div className="duo-card">
        <h3>Accountability Partner (Body Double)</h3>
        <p style={{ fontSize: '13px', marginBottom: '16px' }}>Simulated study matches to keep you focused.</p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            padding: '12px',
            backgroundColor: 'rgba(142,142,147,0.05)',
            borderRadius: '12px',
          }}
        >
          <span style={{ fontSize: '40px' }}>🦉</span>
          <div>
            <strong style={{ display: 'block', fontSize: '15px' }}>Companion: Nia</strong>
            <span style={{ fontSize: '12px', color: 'var(--duo-teal)', fontWeight: 800 }}>
              Active Study Block: Chemistry revision...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
