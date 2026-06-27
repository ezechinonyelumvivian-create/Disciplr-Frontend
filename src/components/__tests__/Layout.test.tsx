import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Layout from '../Layout';

vi.mock('../Wallet/WalletConnectButton', () => ({
  WalletConnectButton: () => <button type="button">Connect wallet</button>,
}));

describe('Layout component navigation', () => {
  test('transactions link receives active class and aria-current when on /transactions', () => {
    render(
      <MemoryRouter initialEntries={['/transactions']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /transactions/i });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('active');
  });

  test('transactions link is not active on other routes', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /transactions/i });
    expect(link).not.toHaveAttribute('aria-current');
    expect(link).not.toHaveClass('active');
  });

  test('verifier link receives active class and aria-current when on /verifier', () => {
    render(
      <MemoryRouter initialEntries={['/verifier']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /verifier/i });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('active');
  });

  test('verifier link is active on verifier subroutes', () => {
    render(
      <MemoryRouter initialEntries={['/verifier/queue']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /verifier/i });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('active');
  });

  test('analytics link receives active class and aria-current when on /analytics', () => {
    render(
      <MemoryRouter initialEntries={['/analytics']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );
    const link = screen.getByRole('link', { name: /analytics/i });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass('active');
  });

  test('verifier and analytics links are not active on home route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Layout>
          <div>Content</div>
        </Layout>
      </MemoryRouter>
    );
    const verifierLink = screen.getByRole('link', { name: /verifier/i });
    expect(verifierLink).not.toHaveAttribute('aria-current');
    expect(verifierLink).not.toHaveClass('active');

    const analyticsLink = screen.getByRole('link', { name: /analytics/i });
    expect(analyticsLink).not.toHaveAttribute('aria-current');
    expect(analyticsLink).not.toHaveClass('active');
  });
});
