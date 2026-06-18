/**
 * Validates if a URL is safe to render as a link.
 * Only allows http and https schemes.
 * Rejects javascript:, data:, and other potentially dangerous schemes.
 */
export const isSafeEvidenceUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url.trim());
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    // If it's not a valid absolute URL, we treat it as unsafe.
    return false;
  }
};
