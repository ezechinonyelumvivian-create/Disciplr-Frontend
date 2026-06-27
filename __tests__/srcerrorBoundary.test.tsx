import { ErrorInfo } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ErrorBoundary from './ErrorBoundary'

function Bomb() {
  throw new Error('test explosion')
}

function Safe() {
  return <p>all good</p>
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('ErrorBoundary', () => {
  it('renders the fallback when a child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /refresh/i })).toBeInTheDocument()
  })

  it('calls the injected onError reporter with the error and info', () => {
    const reporter = vi.fn()

    render(
      <ErrorBoundary onError={reporter}>
        <Bomb />
      </ErrorBoundary>,
    )

    expect(reporter).toHaveBeenCalledOnce()

    const [error, info] = reporter.mock.calls[0] as [Error, ErrorInfo]
    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('test explosion')
    expect(info).toHaveProperty('componentStack')
  })

  it('calls console.error by default when no onError is provided', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    )

    expect(console.error).toHaveBeenCalled()
  })

  it('renders children normally when nothing throws', () => {
    render(
      <ErrorBoundary>
        <Safe />
      </ErrorBoundary>,
    )

    expect(screen.getByText('all good')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })
})
