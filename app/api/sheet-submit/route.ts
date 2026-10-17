import { NextRequest, NextResponse } from 'next/server';

function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// In-memory rate limiting map: Map<clientIp, { count: number; date: string }>
const ipSubmissions = new Map<string, { count: number; date: string }>();

// Helper to extract client IP address
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

// Clean up old entries from previous days periodically
function pruneOldEntries(today: string) {
  if (ipSubmissions.size > 5000) {
    ipSubmissions.forEach((entry, ip) => {
      if (entry.date !== today) {
        ipSubmissions.delete(ip);
      }
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    pruneOldEntries(today);

    // RATE LIMIT CHECK: Maximum 2 form submissions per day per IP
    const record = ipSubmissions.get(clientIp);
    if (record && record.date === today && record.count >= 2) {
      return NextResponse.json(
        {
          error:
            'Daily submission limit reached. You cannot submit more than 2 forms in a single day from the same IP address.',
          limitReached: true,
          dailyLimit: 2,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { formType } = body;

    if (formType === 'contact') {
      const { name, email, message } = body;

      // 1. Name validation: not more than 50 words
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Please enter your name.' },
          { status: 400 }
        );
      }
      if (countWords(name) > 50) {
        return NextResponse.json(
          { error: 'Your Name should not be more than 50 words.' },
          { status: 400 }
        );
      }

      // 2. Email validation: valid email & not more than 50 words
      if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
        return NextResponse.json(
          { error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }
      if (countWords(email) > 50) {
        return NextResponse.json(
          { error: 'Email Address should not be more than 50 words.' },
          { status: 400 }
        );
      }

      // 3. Message validation:
      // Below 10 characters: "Please enter at least 10 characters."
      // Above 1,000 characters: "Message cannot exceed 1,000 characters."
      if (!message || typeof message !== 'string' || message.trim().length < 10) {
        return NextResponse.json(
          { error: 'Please enter at least 10 characters.' },
          { status: 400 }
        );
      }
      if (message.length > 1000) {
        return NextResponse.json(
          { error: 'Message cannot exceed 1,000 characters.' },
          { status: 400 }
        );
      }
    } else if (formType === 'rating') {
      const { rating, comment } = body;

      if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: 'Please select a rating between 1 and 5 stars.' },
          { status: 400 }
        );
      }

      // Rating Form Comment validation: Max 1,000 characters
      if (comment && typeof comment === 'string' && comment.length > 1000) {
        return NextResponse.json(
          { error: 'Message cannot exceed 1,000 characters.' },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Invalid form submission type.' },
        { status: 400 }
      );
    }

    // Forward to Google Apps Script Web App if URL is configured
    const googleScriptUrl =
      process.env.GOOGLE_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

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
    } else {
      console.log(
        '[Google Sheets Integration] Submitted data received. Configure GOOGLE_SCRIPT_URL in .env.local:',
        payloadWithIp
      );
    }

    // Increment submission count for this IP upon successful submission
    if (!record || record.date !== today) {
      ipSubmissions.set(clientIp, { count: 1, date: today });
    } else {
      record.count += 1;
    }

    const currentCount = ipSubmissions.get(clientIp)?.count || 1;
    const remainingToday = Math.max(0, 2 - currentCount);

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      remainingToday,
    });
  } catch (err: any) {
    console.error('Submission error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error processing submission' },
      { status: 500 }
    );
  }
}
