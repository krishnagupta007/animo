import React, { useState, useEffect } from 'react';
import { playFailureSound } from '../utils/AudioEngine';

export interface Flashcard {
  id: string;
  subjectId: string;
  topic: string;
  book: string;
  front: string;
  back: string;
  reviewedCount: number;
  options?: string[];
  answerIndex?: number;
}

interface FlashcardViewerProps {
  flashcards: Flashcard[];
  onMaster: (id: string, e: React.MouseEvent) => void;
  onReviewLater: (id: string) => void;
}

export const FlashcardViewer: React.FC<FlashcardViewerProps> = ({ flashcards, onMaster, onReviewLater }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (currentIndex >= flashcards.length) {
      setCurrentIndex(0);
    }
  }, [flashcards.length, currentIndex]);

  const card = flashcards[currentIndex];

  if (!card) return null;

  const options = card.options && card.options.length === 4
    ? card.options
    : [card.back, 'Alternative Option A', 'Alternative Option B', 'Alternative Option C'];
  const answerIndex = card.answerIndex !== undefined ? card.answerIndex : 0;

  const handleOptionClick = (idx: number, e: React.MouseEvent) => {
    if (selectedIdx !== null) return;
    setSelectedIdx(idx);

    if (idx === answerIndex) {
      onMaster(card.id, e);
    } else {
      playFailureSound();
      onReviewLater(card.id);
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setSelectedIdx(null);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <div
        className="duo-card"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '24px',
          textAlign: 'left',
          marginBottom: '20px',
          position: 'relative'
        }}
        data-testid="flashcard-element"
      >
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--duo-purple)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          Book: {card.book || 'N/A'} • Topic: {card.topic || 'General'}
        </span>
        <h4 style={{ fontSize: '17px', fontWeight: 800, marginBottom: '20px', lineHeight: 1.4 }}>
          {card.front}
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = idx === answerIndex;

            let btnStyle: React.CSSProperties = {
              width: '100%',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '2px solid var(--border-color)',
              borderBottom: '4px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-duo)',
              fontWeight: 800,
              fontSize: '14px',
              textAlign: 'left',
              cursor: selectedIdx === null ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.15s ease'
            };

            if (selectedIdx !== null) {
              if (isCorrect) {
                btnStyle.borderColor = 'var(--duo-teal)';
                btnStyle.borderBottomColor = 'var(--duo-teal-dark)';
                btnStyle.backgroundColor = 'rgba(0, 168, 150, 0.08)';
                btnStyle.color = 'var(--duo-teal-dark)';
              } else if (isSelected) {
                btnStyle.borderColor = 'var(--duo-red)';
                btnStyle.borderBottomColor = 'var(--duo-red-dark)';
                btnStyle.backgroundColor = 'rgba(231, 111, 81, 0.08)';
                btnStyle.color = 'var(--duo-red)';
              }
            }

            return (
              <button
                key={idx}
                disabled={selectedIdx !== null}
                onClick={(e) => handleOptionClick(idx, e)}
                style={btnStyle}
                data-testid={isCorrect ? "mastered-flashcard-button" : `option-button-${idx}`}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: selectedIdx !== null && isCorrect ? 'var(--duo-teal)' : selectedIdx !== null && isSelected ? 'var(--duo-red)' : 'var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 900,
                  flexShrink: 0
                }}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span style={{ flex: 1 }}>{opt}</span>
                {selectedIdx !== null && isCorrect && <span style={{ fontSize: '18px', color: 'var(--duo-teal)' }}>✓</span>}
                {selectedIdx !== null && isSelected && !isCorrect && <span style={{ fontSize: '18px', color: 'var(--duo-red)' }}>✗</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%', maxWidth: '520px' }}>
        {selectedIdx !== null && (
          <button
            onClick={handleNext}
            className="duo-btn-teal"
            style={{ width: '100%', padding: '12px', fontSize: '14px' }}
            data-testid="continue-flashcard-button"
          >
            Continue / Next Card ➔
          </button>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
          <button
            onClick={handlePrev}
            className="duo-btn-gray"
            style={{ padding: '6px 12px', fontSize: '12px', boxShadow: 'none' }}
          >
            ◀ Prev
          </button>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-secondary)' }}>
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <button
            onClick={handleNext}
            className="duo-btn-gray"
            style={{ padding: '6px 12px', fontSize: '12px', boxShadow: 'none' }}
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
};
