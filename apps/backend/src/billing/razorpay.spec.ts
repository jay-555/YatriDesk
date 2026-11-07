import { createHmac } from 'node:crypto';
import { verifyRazorpaySignature } from './billing.service';

describe('Razorpay webhook signature', () => {
  it('accepts a matching HMAC and rejects a different one', () => {
    const body = '{"event":"subscription.charged"}';
    const secret = 'whsec_test';
    const good = createHmac('sha256', secret).update(body).digest('hex');
    expect(verifyRazorpaySignature(body, good, secret)).toBe(true);
    expect(verifyRazorpaySignature(body, good, 'other')).toBe(false);
    expect(verifyRazorpaySignature(body, undefined, secret)).toBe(false);
  });
});
