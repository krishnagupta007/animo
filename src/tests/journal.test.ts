import { describe, test, expect } from 'vitest';
import Fastify from 'fastify';
import { journalRoutes } from '../../api/routes/journal.js';
import { sanitizeInput } from '../../api/utils/sanitize.js';

describe('Fastify Journal Route Integration Suite', () => {
  test('returns standard intervention for normal entries', async () => {
    const app = Fastify();
    await app.register(journalRoutes);

    const response = await app.inject({
      method: 'POST',
      url: '/api/journal/analyze',
      payload: {
        text: 'I am preparing for my upcoming UPSC test and trying my best to study regularly.'
      }
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.escalate).toBe(false);
    expect(body.intervention).toContain('4-7-8 breathing exercise');
  });

  test('triggers safety override for critical keyword entries', async () => {
    const app = Fastify();
    await app.register(journalRoutes);

    const response = await app.inject({
      method: 'POST',
      url: '/api/journal/analyze',
      payload: {
        text: 'I feel like giving up on UPSC exams, everything is pointless.'
      }
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.body);
    expect(body.escalate).toBe(true);
    expect(body.intervention).toContain('emergency support');
  });

  test('returns 400 Bad Request on empty or missing text', async () => {
    const app = Fastify();
    await app.register(journalRoutes);

    const response = await app.inject({
      method: 'POST',
      url: '/api/journal/analyze',
      payload: {
        text: ''
      }
    });

    expect(response.statusCode).toBe(400);
    const body = JSON.parse(response.body);
    expect(body.error).toBe('Bad Request');
  });
});

describe('Sanitization Utility Unit Test', () => {
  test('escapes HTML script tags and symbols', () => {
    const payload = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(payload);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
  });
});
