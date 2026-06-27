import { fireEvent, render, screen } from '@testing-library/react';
import ThemeToggle from '../ThemeToggle';

const toggleTheme = vi.fn();

vi.mock('../../context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'light', toggleTheme }),
}));

describe('ThemeToggle accessibility', () => {
  beforeEach(() => {
    toggleTheme.mockReset();
  });

  test('is reachable and activates on Enter and Space', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    button.focus();

    expect(button).toHaveFocus();
    expect(button).toHaveClass('theme-toggle');

    fireEvent.keyDown(button, { key: 'Enter' });

    expect(toggleTheme).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(button, { key: ' ' });

    expect(toggleTheme).toHaveBeenCalledTimes(2);
  });
});
