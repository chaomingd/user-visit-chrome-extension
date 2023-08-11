// 网站协议
const SCHEMAS = ['http:', 'https:'];

export function isWebsite(urlObj: URL) {
  if (!urlObj) return false;
  return SCHEMAS.includes(urlObj.protocol);
}