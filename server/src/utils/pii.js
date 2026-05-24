const PII_PATTERNS = [
  { pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, label: '[REDACTED_EMAIL]' },
  { pattern: /\b(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g, label: '[REDACTED_PHONE]' },
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/g, label: '[REDACTED_SSN]' },
  { pattern: /\b4[0-9]{12}(?:[0-9]{3})?\b/g, label: '[REDACTED_CARD]' },
];
export function redactPII(text) {
  if (!text || typeof text !== 'string') return text;
  return PII_PATTERNS.reduce((str, { pattern, label }) => str.replace(pattern, label), text);
}
