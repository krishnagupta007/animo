import React, { Suspense } from 'react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'vitest-axe';
import App from '../App';

// Global fetch is mocked in setup.ts
const mockedFetch = vi.mocked(global.fetch);

const renderWithSuspense = (component: React.ReactElement) => {
  return render(
    <Suspense fallback={<div>Loading...</div>}>
      {component}
    </Suspense>
  );
};

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
    const { container } = renderWithSuspense(<App />);
    await waitFor(() => expect(screen.queryByText(/calibrating/i)).not.toBeInTheDocument());
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('renders dashboard correctly with all interactive widgets', async () => {
    renderWithSuspense(<App />);
    await waitFor(() => expect(screen.queryByText(/calibrating/i)).not.toBeInTheDocument());
    
    expect(screen.getByTestId('dashboard-streak-count')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard-token-count')).toBeInTheDocument();
    
    // Check main widgets exist
    expect(screen.getByTestId('pomodoro-timer')).toBeInTheDocument();
    expect(screen.getByTestId('water-tracker')).toBeInTheDocument();
  });

  test('completing checklist items updates progress and tokens', async () => {
    renderWithSuspense(<App />);
    await waitFor(() => expect(screen.queryByText(/calibrating/i)).not.toBeInTheDocument());

    const moodCheckbox = screen.getByTestId('quest-mood-checkbox');

    // Click mood check
    fireEvent.click(moodCheckbox);
    expect(moodCheckbox).toHaveClass('checked');

    // Base tokens are 10. Completing a quest grants 10, bringing the count to 20.
    expect(screen.getByTestId('dashboard-token-count')).toHaveTextContent('🪙 20');
  });

  test('journal submission triggers success callback and completes checklist item', async () => {
    vi.useRealTimers();

    const mockResponse = { 
      escalate: false, 
      intervention: "Let's try a quick 4-7-8 breathing exercise." 
    };
    
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    renderWithSuspense(<App />);
    await waitFor(() => expect(screen.queryByText(/calibrating/i)).not.toBeInTheDocument());

    // Click Reflection bottom tab button
    const reflectionTabBtn = screen.getByRole('button', { name: /reflection/i });
    fireEvent.click(reflectionTabBtn);
    await waitFor(() => expect(screen.getByTestId('journal-input')).toBeInTheDocument());

    const input = screen.getByTestId('journal-input');
    const submitBtn = screen.getByRole('button', { name: /analyze/i });

    fireEvent.change(input, { target: { value: 'I feel anxious.' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByTestId('response-box')).toBeInTheDocument();
    }, { timeout: 4000 });

    const focusTabBtn = screen.getByRole('button', { name: /focus/i });
    fireEvent.click(focusTabBtn);

    const journalCheckbox = screen.getByTestId('quest-journal-checkbox');
    expect(journalCheckbox).toHaveClass('checked');
  });
});
