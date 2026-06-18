import { type ChangeEvent, useEffect, useId, useMemo, useState } from 'react'
import { Field } from './Field'
import { Text } from './Text'
import { normalizeEvidenceUrl } from '../utils/url'

type EvidenceUploadStatus = 'empty' | 'invalid' | 'valid'

interface EvidenceUploadProps {
  id?: string
  label?: string
  value?: string
  required?: boolean
  onChange?: (evidenceUrl: string | undefined) => void
  onSubmit?: (evidenceUrl: string) => void
}

export function EvidenceUpload({
  id,
  label = 'Evidence URL',
  value = '',
  required = false,
  onChange,
  onSubmit,
}: EvidenceUploadProps) {
  const generatedId = useId()
  const fieldId = id || `evidence-upload-${generatedId}`
  const [rawValue, setRawValue] = useState(value)
  const [touched, setTouched] = useState(false)
  const normalizedUrl = useMemo(() => normalizeEvidenceUrl(rawValue), [rawValue])
  const hasInput = rawValue.trim().length > 0
  const status: EvidenceUploadStatus = !hasInput ? 'empty' : normalizedUrl ? 'valid' : 'invalid'
  const error = touched && status === 'invalid'
    ? 'Enter a safe evidence URL starting with http:// or https://.'
    : undefined

  useEffect(() => {
    setRawValue(value)
  }, [value])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value
    const nextUrl = normalizeEvidenceUrl(nextValue)

    setRawValue(nextValue)
    onChange?.(nextUrl ?? undefined)
  }

  const handleSubmit = () => {
    setTouched(true)

    if (normalizedUrl) {
      onSubmit?.(normalizedUrl)
    }
  }

  return (
    <div
      data-status={status}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-2)',
      }}
    >
      <Field
        id={fieldId}
        label={label}
        type="url"
        inputMode="url"
        value={rawValue}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        placeholder="https://github.com/org/repo/pull/42"
        required={required}
        error={error}
        hint={status === 'empty' ? 'Attach a public http or https link to milestone evidence.' : undefined}
      />
      {status === 'valid' && normalizedUrl && (
        <Text
          role="caption"
          as="span"
          style={{
            color: 'var(--success)',
          }}
        >
          Evidence link accepted: {normalizedUrl}
        </Text>
      )}
      {onSubmit && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!normalizedUrl}
          style={{
            alignSelf: 'flex-start',
            background: normalizedUrl ? 'var(--accent)' : 'var(--surface-raised)',
            border: 'var(--border-width-1) solid var(--border)',
            borderRadius: 'var(--radius)',
            color: normalizedUrl ? 'var(--bg)' : 'var(--muted)',
            cursor: normalizedUrl ? 'pointer' : 'not-allowed',
            fontWeight: 600,
            minHeight: 'var(--touch-target)',
            padding: 'var(--spacing-2) var(--spacing-4)',
          }}
        >
          Attach Evidence
        </button>
      )}
    </div>
  )
}
