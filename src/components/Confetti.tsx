/* eslint-disable */
import React from 'react';

interface ConfettiProps {
  active: boolean;
}

export const Confetti: React.FC<ConfettiProps> = ({ active }) => {
  if (!active) return null;
  const colors = ['#00a896', '#8e7dbe', '#f3a712', '#e76f51', '#5ac8fa'];
  return (
    <div className="confetti-holder" data-testid="confetti-container">
      {Array.from({ length: 50 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 2;
        const duration = 1.5 + Math.random() * 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              backgroundColor: color,
            }}
          />
        );
      })}
    </div>
  );
};
