import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
import App from '../App';

// Global fetch is mocked in setup.ts
const mockedFetch = vi.mocked(global.fetch);

describe('Zenith Dashboard Gamified MVP Suite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    if (typeof global.localStorage !== 'undefined') {
      global.localStorage.clear();
    }
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('should have no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('renders dashboard correctly with all interactive widgets', () => {
    render(<App />);
    
    // Check main widgets and sections exist using dashboard-specific testids
    expect(screen.getByTestId('dashboard-streak-count')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-token-count')).toBeInTheDocument();
    expect(screen.getByTestId('leaderboard')).toBeInTheDocument();
    expect(screen.getByTestId('pomodoro-timer')).toBeInTheDocument();
    expect(screen.getByTestId('water-tracker')).toBeInTheDocument();
  });

  test('completing checklist items updates progress and tokens', () => {
    render(<App />);

    const moodCheckbox = screen.getByTestId('quest-mood-checkbox');

    // Click mood check
    fireEvent.click(moodCheckbox);
    expect(moodCheckbox).toHaveTextContent('✓');

    // Base tokens are 10. Completing a quest grants 10, bringing the count to 20.
    expect(screen.getByTestId('dashboard-token-count')).toHaveTextContent('🪙 20');
  });

  test('journal submission triggers success callback and completes checklist item', async () => {
    // We use real timers here to prevent Vitest fake timers from stalling the fetch promise resolution
    vi.useRealTimers();

    const mockResponse = { 
      escalate: false, 
      intervention: "Let's try a quick 4-7-8 breathing exercise to reset your focus before moving to your next study block." 
    };
    
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    render(<App />);

    // Click Reflection bottom tab button to show journal elements
    const reflectionTabBtn = screen.getByRole('button', { name: /reflection/i });
    fireEvent.click(reflectionTabBtn);

    const input = screen.getByTestId('journal-input');
    const submitBtn = screen.getByRole('button', { name: /analyze/i });

    fireEvent.change(input, { target: { value: 'I feel slightly anxious about the upcoming UPSC, but I am trying.' } });
    fireEvent.click(submitBtn);

    // Wait for response display
    await waitFor(() => {
      expect(screen.getByTestId('response-box')).toBeInTheDocument();
    }, { timeout: 4000 });

    // Switch back to Focus tab to check checklist task
    const focusTabBtn = screen.getByRole('button', { name: /focus/i });
    fireEvent.click(focusTabBtn);

    // Verify journal task checkbox is now checked
    const journalCheckbox = screen.getByTestId('quest-journal-checkbox');
    expect(journalCheckbox).toHaveTextContent('✓');
  });

  test('navigates to academics tab, selects target, adds subject, and reviews flashcards', async () => {
    render(<App />);

    // Click Academics bottom tab button
    const academicsTabBtn = screen.getByRole('button', { name: /academics/i });
    fireEvent.click(academicsTabBtn);

    // Verify Academics sections are visible
    expect(screen.getByTestId('target-exam-card')).toBeInTheDocument();
    expect(screen.getByTestId('academic-resources-organizer')).toBeInTheDocument();
    expect(screen.getByTestId('flashcards-card')).toBeInTheDocument();

    // Verify target exam dropdown exists
    const select = screen.getByTestId('target-exam-select');
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue('UPSC');

    // Verify seeded flashcard exists
    const fcElement = screen.getByTestId('flashcard-element');
    expect(fcElement).toBeInTheDocument();
    expect(fcElement).toHaveTextContent('What is Part III of the Constitution?');

    // Click "Mastered!" button on active flashcard
    const masterBtn = screen.getByTestId('mastered-flashcard-button');
    fireEvent.click(masterBtn);

    // Tokens should increase by 5 (from 10 to 15)
    expect(screen.getByTestId('dashboard-token-count')).toHaveTextContent('🪙 15');
  });
});
