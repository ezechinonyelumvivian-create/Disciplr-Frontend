import { isSafeEvidenceUrl } from '../url';

describe('isSafeEvidenceUrl', () => {
  test('should return true for valid http URLs', () => {
    expect(isSafeEvidenceUrl('http://example.com')).toBe(true);
  });

  test('should return true for valid https URLs', () => {
    expect(isSafeEvidenceUrl('https://example.com')).toBe(true);
  });

  test('should return false for javascript: URLs', () => {
    expect(isSafeEvidenceUrl('javascript:alert(1)')).toBe(false);
  });

  test('should return false for data: URLs', () => {
    expect(isSafeEvidenceUrl('data:text/html,test')).toBe(false);
  });

  test('should return false for invalid URLs', () => {
    expect(isSafeEvidenceUrl('not-a-url')).toBe(false);
  });

  test('should handle trailing whitespace', () => {
    expect(isSafeEvidenceUrl('  https://example.com  ')).toBe(true);
  });

  test('should handle different casing for https', () => {
    expect(isSafeEvidenceUrl('HTTPS://example.com')).toBe(true);
  });
});
