// Cloudflare Worker entrypoint with Static Assets binding & /api/sheet-submit handler

export interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
  GOOGLE_SCRIPT_URL?: string;
  [key: string]: any;
}

function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory rate limiting map for worker instance
const ipSubmissions = new Map<string, { count: number; date: string }>();

function getClientIp(request: Request): string {
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

function pruneOldEntries(today: string) {
  if (ipSubmissions.size > 5000) {
    ipSubmissions.forEach((entry, ip) => {
      if (entry.date !== today) {
        ipSubmissions.delete(ip);
      }
    });
  }
}

async function handleSheetSubmit(request: Request, env: Env): Promise<Response> {
  const jsonHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  try {
    const clientIp = getClientIp(request);
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    pruneOldEntries(today);

    // RATE LIMIT CHECK: Maximum 2 form submissions per day per IP
    const record = ipSubmissions.get(clientIp);
    if (record && record.date === today && record.count >= 2) {
      return new Response(
        JSON.stringify({
          error:
            'Daily submission limit reached. You cannot submit more than 2 forms in a single day from the same IP address.',
          limitReached: true,
          dailyLimit: 2,
        }),
        { status: 429, headers: jsonHeaders }
      );
    }

    const body = (await request.json()) as any;
    const { formType } = body;

    if (formType === 'contact') {
      const { name, email, message } = body;

      // 1. Name validation: not more than 50 words
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Please enter your name.' }),
          { status: 400, headers: jsonHeaders }
        );
      }
      if (countWords(name) > 50) {
        return new Response(
          JSON.stringify({ error: 'Your Name should not be more than 50 words.' }),
          { status: 400, headers: jsonHeaders }
        );
      }

      // 2. Email validation: valid email & not more than 50 words
      if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
        return new Response(
          JSON.stringify({ error: 'Please enter a valid email address.' }),
          { status: 400, headers: jsonHeaders }
        );
      }
      if (countWords(email) > 50) {
        return new Response(
          JSON.stringify({ error: 'Email Address should not be more than 50 words.' }),
          { status: 400, headers: jsonHeaders }
        );
      }

      // 3. Message validation:
      // Below 10 characters: "Please enter at least 10 characters."
      // Above 1,000 characters: "Message cannot exceed 1,000 characters."
      if (!message || typeof message !== 'string' || message.trim().length < 10) {
        return new Response(
          JSON.stringify({ error: 'Please enter at least 10 characters.' }),
          { status: 400, headers: jsonHeaders }
        );
      }
      if (message.length > 1000) {
        return new Response(
          JSON.stringify({ error: 'Message cannot exceed 1,000 characters.' }),
          { status: 400, headers: jsonHeaders }
        );
      }
    } else if (formType === 'rating') {
      const { rating, comment } = body;

      if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
        return new Response(
          JSON.stringify({ error: 'Please select a rating between 1 and 5 stars.' }),
          { status: 400, headers: jsonHeaders }
        );
      }

      // Rating Form Comment validation: Max 1,000 characters
      if (comment && typeof comment === 'string' && comment.length > 1000) {
        return new Response(
          JSON.stringify({ error: 'Message cannot exceed 1,000 characters.' }),
          { status: 400, headers: jsonHeaders }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid form submission type.' }),
        { status: 400, headers: jsonHeaders }
      );
    }

    // Google Apps Script Web App URL from environment or fallback
    const googleScriptUrl =
      env.GOOGLE_SCRIPT_URL ||
      'https://script.google.com/macros/s/AKfycbwFr6uLQRNyKQVKb3QgcPUoyNblhRnmxGZocBVoO4TP-G05q2yEMU5ZOi25R02QF9Vs/exec';

    const payloadWithIp = {
      ...body,
      ip: clientIp,
    };

    if (googleScriptUrl) {
      try {
        const response = await fetch(googleScriptUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payloadWithIp),
          redirect: 'follow',
        });

        if (!response.ok) {
          console.warn('Google Script response was not OK:', response.status);
        }
      } catch (err) {
        console.error('Failed to forward to Google Apps Script:', err);
      }
    }

    // Increment submission count for this IP
    if (!record || record.date !== today) {
      ipSubmissions.set(clientIp, { count: 1, date: today });
    } else {
      record.count += 1;
    }

    const currentCount = ipSubmissions.get(clientIp)?.count || 1;
    const remainingToday = Math.max(0, 2 - currentCount);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        remainingToday,
      }),
      { status: 200, headers: jsonHeaders }
    );
  } catch (err: any) {
    console.error('Submission error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Server error processing submission' }),
      { status: 500, headers: jsonHeaders }
    );
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1. Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 2. Handle /api/sheet-submit endpoint
    if (url.pathname === '/api/sheet-submit' && request.method === 'POST') {
      return handleSheetSubmit(request, env);
    }

    // 3. Fallback to static assets in ./out
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not Found', { status: 404 });
  },
};
