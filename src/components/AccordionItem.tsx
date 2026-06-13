import React, { useState } from 'react';

interface AccordionItemProps {
  title: string;
  content: string;
  onOpen: () => void;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, content, onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      style={{
        border: '2px solid var(--border-color)',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '10px'
      }}
    >
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) onOpen();
        }}
        type="button"
        style={{
          width: '100%',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-card)',
          border: 'none',
          textAlign: 'left',
          fontFamily: 'var(--font-duo)',
          fontWeight: 800,
          fontSize: '14px',
          cursor: 'pointer',
          color: 'var(--text-primary)'
        }}
      >
        <span>{title}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: '2px solid var(--border-color)',
            fontSize: '13.5px',
            lineHeight: '1.5',
            backgroundColor: 'rgba(0,0,0,0.01)'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};
