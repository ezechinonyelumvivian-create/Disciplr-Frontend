import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { EvidenceUpload } from '../EvidenceUpload'

describe('EvidenceUpload', () => {
  it('renders an accessible evidence URL field with empty-state guidance', () => {
    render(<EvidenceUpload />)

    expect(screen.getByLabelText('Evidence URL')).toBeInTheDocument()
    expect(screen.getByText(/Attach a public http or https link/)).toBeInTheDocument()
  })

  it('emits trimmed http or https evidence URLs', () => {
    const handleChange = vi.fn()
    render(<EvidenceUpload onChange={handleChange} />)

    fireEvent.change(screen.getByLabelText('Evidence URL'), {
      target: { value: '  https://github.com/org/repo/pull/42  ' },
    })

    expect(handleChange).toHaveBeenLastCalledWith('https://github.com/org/repo/pull/42')
    expect(screen.getByText(/Evidence link accepted/)).toBeInTheDocument()
  })

  it('rejects unsafe URL schemes and marks the field invalid after blur', () => {
    const handleChange = vi.fn()
    render(<EvidenceUpload onChange={handleChange} />)

    const input = screen.getByLabelText('Evidence URL')
    fireEvent.change(input, { target: { value: 'javascript:alert(1)' } })
    fireEvent.blur(input)

    expect(handleChange).toHaveBeenLastCalledWith(undefined)
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText(/starting with http:\/\/ or https:\/\//)).toBeInTheDocument()
  })

  it('submits only validated evidence URLs', () => {
    const handleSubmit = vi.fn()
    render(<EvidenceUpload onSubmit={handleSubmit} />)

    const button = screen.getByRole('button', { name: 'Attach Evidence' })
    expect(button).toBeDisabled()

    fireEvent.change(screen.getByLabelText('Evidence URL'), {
      target: { value: 'https://example.com/proof' },
    })
    fireEvent.click(button)

    expect(handleSubmit).toHaveBeenCalledWith('https://example.com/proof')
  })
})
