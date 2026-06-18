import React from 'react';
import { render, screen } from '@testing-library/react';
import { SafeLink } from '../SafeLink';

describe('SafeLink component', () => {
  test('renders as anchor tag for safe URLs', () => {
    const url = 'https://example.com';
    render(<SafeLink href={url}>Link</SafeLink>);
    const link = screen.getByRole('link', { name: /link/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', url);
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders as span for unsafe URLs', () => {
    const url = 'javascript:alert(1)';
    render(<SafeLink href={url}>Link</SafeLink>);
    const link = screen.queryByRole('link', { name: /link/i });
    expect(link).not.toBeInTheDocument();
    const span = screen.getByText('[Invalid Link]');
    expect(span).toBeInTheDocument();
    expect(span).toHaveAttribute('title', `Rejected URL: ${url}`);
  });
});
