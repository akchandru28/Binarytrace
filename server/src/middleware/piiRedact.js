import { redactPII } from '../utils/pii.js';
export function piiRedact(req, _res, next) {
  if (req.body?.message) req.body.message = redactPII(req.body.message);
  next();
}
