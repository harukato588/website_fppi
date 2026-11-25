/**
 * Validasi URL aman — hanya mengizinkan http://, https://, atau path relatif (/).
 * Mencegah skema berbahaya seperti javascript:, data:, atau vbscript:.
 */
export function isValidHttpOrRelativeUrl(url: string): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * Membersihkan spasi berlebih dan membatasi panjang string tanpa HTML-entity double-encoding.
 */
export function sanitizeInput(input: string, maxLength = 300): string {
  return input.trim().slice(0, maxLength);
}
