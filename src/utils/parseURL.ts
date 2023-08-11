export function parseURL(url?: string) {
  if (!url) return null;
  try {
    return new URL(url);
  } catch(e) {
    return null;
  }
}