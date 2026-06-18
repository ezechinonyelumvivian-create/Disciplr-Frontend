import { describe, expect, it } from 'vitest'
import { isSafeEvidenceUrl, normalizeEvidenceUrl } from '../url'

describe('evidence URL validation', () => {
  it('accepts http and https URLs', () => {
    expect(isSafeEvidenceUrl('https://github.com/org/repo/pull/42')).toBe(true)
    expect(isSafeEvidenceUrl('http://example.com/evidence')).toBe(true)
  })

  it('trims safe URLs before returning them', () => {
    expect(normalizeEvidenceUrl('  https://example.com/doc  ')).toBe('https://example.com/doc')
  })

  it('rejects unsafe and missing schemes', () => {
    expect(isSafeEvidenceUrl('javascript:alert(1)')).toBe(false)
    expect(isSafeEvidenceUrl('data:text/html,hello')).toBe(false)
    expect(isSafeEvidenceUrl('example.com/evidence')).toBe(false)
    expect(isSafeEvidenceUrl('')).toBe(false)
  })
})
