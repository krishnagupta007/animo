import React, { useRef, useEffect } from 'react';
import { MascotOwl } from './MascotOwl';

/*
interface DistractionLog {
  id: string;
  app: string;
  minutes: number;
  subject: string;
}
*/

interface ChatTabProps {
  chatHistory: Array<{ sender: 'user' | 'ai'; text: string }>;
  chatInput: string;
  setChatInput: (val: string) => void;
  handleChatSubmit: (e?: React.FormEvent, customMsg?: string) => void;
  cognitiveScore: number;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  chatHistory,
  chatInput,
  setChatInput,
  handleChatSubmit,
  cognitiveScore,
}) => {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Premium Markdown & Highlight Parser
  const parseMessageText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\[.*?\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span
            key={index}
            style={{
              padding: '2px 6px',
              borderRadius: '6px',
              backgroundColor: 'rgba(0,168,150,0.15)',
              color: 'var(--duo-teal-dark)',
              fontWeight: 800,
              fontSize: '11px',
              margin: '0 2px',
              display: 'inline-block',
            }}
          >
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="grid-container">
        {/* Left Side: Advisor Profile & Suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Coach Profile Card */}
          <div className="duo-card" style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ transform: 'scale(0.8)', margin: '-10px' }}>
              <MascotOwl expression={cognitiveScore >= 70 ? 'stressed' : 'happy'} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#4cd964',
                    display: 'inline-block',
                    boxShadow: '0 0 8px #4cd964',
                  }}
                />
                <strong style={{ fontSize: '15px' }}>Nia (AI Coach)</strong>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                Burnout Risk: {cognitiveScore}%
              </span>
            </div>
          </div>

          {/* Quick Keys Suggestions */}
          <div className="duo-card">
            <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Suggested Queries</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                {
                  label: '📊 What did I study?',
                  text: 'What did I do last week?',
                  desc: 'Inspect total duration & log summaries',
                },
                {
                  label: '🔥 Burnout Risk?',
                  text: 'How is my burnout risk?',
                  desc: 'Analyze active cognitive fatigue score',
                },
                {
                  label: '📅 Spaced Schedule?',
                  text: 'What is my spaced revision schedule?',
                  desc: 'Fetch agenda revision list',
                },
                {
                  label: '📱 Distractions Report',
                  text: 'Show me my distractions report',
                  desc: 'Audits recent app focus leakage',
                },
              ].map((btn, i) => (
                <button
                  key={i}
                  onClick={() => handleChatSubmit(undefined, btn.text)}
                  className="duo-btn-gray"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '2px',
                    padding: '10px 14px',
                    textAlign: 'left',
                    boxShadow: 'none',
                    textTransform: 'none',
                    letterSpacing: 'normal',
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '13px', color: 'var(--text-primary)' }}>
                    {btn.label}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    {btn.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Chat Window */}
        <div
          className="duo-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '480px',
            padding: '16px',
            backgroundColor: 'var(--bg-card)',
          }}
        >
          {/* Messages Frame */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingBottom: '16px',
              paddingRight: '4px',
            }}
          >
            {chatHistory.map((chat, idx) => {
              const isUser = chat.sender === 'user';
              return (
                <div
                  key={idx}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-end',
                    maxWidth: '85%',
                  }}
                >
                  {!isUser && (
                    <span
                      style={{
                        fontSize: '20px',
                        backgroundColor: 'var(--border-color)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      🦉
                    </span>
                  )}
                  <div
                    style={{
                      backgroundColor: isUser ? 'var(--duo-teal)' : 'var(--border-color)',
                      color: isUser ? '#ffffff' : 'var(--text-primary)',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      padding: '10px 14px',
                      fontSize: '13.5px',
                      lineHeight: '1.45',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                    }}
                  >
                    {parseMessageText(chat.text)}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Form Bar */}
          <form
            onSubmit={handleChatSubmit}
            style={{
              display: 'flex',
              gap: '10px',
              borderTop: '2px solid var(--border-color)',
              paddingTop: '12px',
            }}
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Animo advisor..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '12px',
                border: '2px solid var(--border-color)',
                outline: 'none',
                fontFamily: 'var(--font-duo)',
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
            <button type="submit" className="duo-btn-teal" style={{ padding: '10px 16px', fontSize: '13px' }}>
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Daily Distraction Report */}
      {/* <div className="duo-card" data-testid="distractions-report">
        <h3>Diagnostic Distraction Report</h3>
        <p style={{ fontSize: '13px', marginBottom: '16px' }}>
          AI background distraction diagnostic statistics.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {distractions.map((d, i) => {
            const pct = Math.min((d.minutes / 45) * 100, 100);
            return (
              <div key={i}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    marginBottom: '4px',
                  }}
                >
                  <span>
                    Distracted by <strong>{d.app}</strong> during {d.subject}
                  </span>
                  <strong style={{ color: 'var(--duo-red)' }}>{d.minutes} min</strong>
                </div>
                <div className="duo-progress-bar" style={{ height: '6px' }}>
                  <div
                    className="duo-progress-fill"
                    style={{ width: `${pct}%`, backgroundColor: 'var(--duo-red)' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div> */}
    </div>
  );
};
