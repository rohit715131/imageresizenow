'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Mail, MessageSquare, Send, CheckCircle2, Star, Sparkles, AlertCircle, FileSpreadsheet, ShieldAlert } from 'lucide-react';

function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactPage() {
  // Contact Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [contactErrors, setContactErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
    form?: string;
  }>({});
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [isContactSubmitting, setIsContactSubmitting] = useState(false);

  // Rating Form state
  const [rating, setRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isRatingSubmitting, setIsRatingSubmitting] = useState(false);

  // Daily submission rate limit tracking (Max 2 forms per day)
  const [dailySubmissions, setDailySubmissions] = useState<number>(0);
  const [limitReached, setLimitReached] = useState<boolean>(false);

  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const stored = localStorage.getItem(`contact_forms_${today}`);
      const count = stored ? parseInt(stored, 10) : 0;
      setDailySubmissions(count);
      if (count >= 2) {
        setLimitReached(true);
      }
    } catch {}
  }, []);

  const recordSubmissionLocally = () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const newCount = dailySubmissions + 1;
      setDailySubmissions(newCount);
      localStorage.setItem(`contact_forms_${today}`, newCount.toString());
      if (newCount >= 2) {
        setLimitReached(true);
      }
    } catch {}
  };

  // Validate Contact Form
  const validateContactForm = (): boolean => {
    const errors: typeof contactErrors = {};

    if (limitReached) {
      errors.form = 'Daily submission limit reached. You cannot submit more than 2 forms in a single day from the same IP address.';
      setContactErrors(errors);
      return false;
    }

    // 1. Your Name should not be more than 50 words
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      errors.name = 'Please enter your name.';
    } else if (countWords(nameTrimmed) > 50) {
      errors.name = 'Your Name should not be more than 50 words.';
    }

    // 2. Email Address should be valid email and not more than 50 words
    const emailTrimmed = formData.email.trim();
    if (!emailTrimmed) {
      errors.email = 'Please enter your email address.';
    } else if (!EMAIL_REGEX.test(emailTrimmed)) {
      errors.email = 'Please enter a valid email address.';
    } else if (countWords(emailTrimmed) > 50) {
      errors.email = 'Email Address should not be more than 50 words.';
    }

    // 3. Message field:
    // Below 10 characters: "Please enter at least 10 characters."
    // Above 1,000 characters: "Message cannot exceed 1,000 characters."
    const msgTrimmed = formData.message.trim();
    if (msgTrimmed.length < 10) {
      errors.message = 'Please enter at least 10 characters.';
    } else if (formData.message.length > 1000) {
      errors.message = 'Message cannot exceed 1,000 characters.';
    }

    setContactErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateContactForm()) return;

    setIsContactSubmitting(true);
    setContactErrors({});

    try {
      const payload = {
        formType: 'contact',
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        timestamp: new Date().toISOString(),
      };

      const res = await fetch('/api/sheet-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429 || data.limitReached) {
          setLimitReached(true);
        }
        throw new Error(data.error || 'Failed to submit form');
      }

      recordSubmissionLocally();
      setContactSubmitted(true);
    } catch (err: any) {
      setContactErrors({ form: err.message || 'Error submitting message. Please try again.' });
    } finally {
      setIsContactSubmitting(false);
    }
  };

  // Validate Rating Form
  const validateRatingForm = (): boolean => {
    if (limitReached) {
      setRatingError('Daily submission limit reached. You cannot submit more than 2 forms in a single day from the same IP address.');
      return false;
    }
    if (feedbackComment.length > 1000) {
      setRatingError('Message cannot exceed 1,000 characters.');
      return false;
    }
    setRatingError(null);
    return true;
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRatingForm()) return;

    setIsRatingSubmitting(true);
    try {
      const payload = {
        formType: 'rating',
        rating,
        comment: feedbackComment.trim(),
        page: '/contact',
        timestamp: new Date().toISOString(),
      };

      const res = await fetch('/api/sheet-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429 || data.limitReached) {
          setLimitReached(true);
        }
        throw new Error(data.error || 'Failed to submit rating');
      }

      recordSubmissionLocally();
      setFeedbackSubmitted(true);
    } catch (err: any) {
      setRatingError(err.message || 'Error submitting rating.');
    } finally {
      setIsRatingSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <Breadcrumbs items={[{ name: 'Contact & Feedback', href: '/contact' }]} />

        <div className="my-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-3 border border-blue-200 dark:border-blue-800">
            <Mail className="w-3.5 h-3.5" />
            <span>Support & Feature Requests</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Contact & Feedback
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Have a suggestion, question, or need a custom preset added? We would love to hear from you.
          </p>
        </div>

        {/* IP Rate Limit Warning Banner if reached */}
        {limitReached && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">Daily Submission Limit Reached (2 of 2)</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                To prevent spam and abuse, a maximum of 2 submissions per day is allowed per IP address. Your quota will reset tomorrow.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {/* Contact Message Form */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span>Send Us a Message</span>
                </h2>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Max 2/day
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Fill out the form below and we will get back to you within 24 hours.
              </p>

              {contactSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-base">
                    Message Received!
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Thank you for reaching out. Your message has been recorded and we will reply within 2 business days.
                  </p>
                  {!limitReached && (
                    <button
                      type="button"
                      onClick={() => {
                        setContactSubmitted(false);
                        setFormData({ name: '', email: '', message: '' });
                      }}
                      className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-200 transition-colors"
                    >
                      Send Another Message
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} noValidate className="space-y-4">
                  {contactErrors.form && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{contactErrors.form}</span>
                    </div>
                  )}

                  {/* 1. Your Name Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Your Name
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {countWords(formData.name)}/50 words
                      </span>
                    </div>
                    <input
                      type="text"
                      disabled={limitReached}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (contactErrors.name) setContactErrors({ ...contactErrors, name: undefined });
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm focus:ring-2 outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                        contactErrors.name
                          ? 'border-rose-500 focus:ring-rose-400'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'
                      }`}
                      placeholder="Jane Doe"
                    />
                    {contactErrors.name && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{contactErrors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* 2. Email Address Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Email Address
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {countWords(formData.email)}/50 words
                      </span>
                    </div>
                    <input
                      type="email"
                      disabled={limitReached}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (contactErrors.email) setContactErrors({ ...contactErrors, email: undefined });
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm focus:ring-2 outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                        contactErrors.email
                          ? 'border-rose-500 focus:ring-rose-400'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'
                      }`}
                      placeholder="jane@example.com"
                    />
                    {contactErrors.email && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{contactErrors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* 3. Message Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Message
                      </label>
                      <span
                        className={`text-[10px] ${
                          formData.message.length > 1000
                            ? 'text-rose-600 font-bold'
                            : formData.message.trim().length < 10 && formData.message.length > 0
                            ? 'text-amber-500'
                            : 'text-slate-400'
                        }`}
                      >
                        {formData.message.length}/1,000 characters
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      disabled={limitReached}
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (contactErrors.message) setContactErrors({ ...contactErrors, message: undefined });
                      }}
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm focus:ring-2 outline-none resize-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                        contactErrors.message
                          ? 'border-rose-500 focus:ring-rose-400'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'
                      }`}
                      placeholder="How can we help you or improve the toolkit?"
                    />
                    {contactErrors.message && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{contactErrors.message}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isContactSubmitting || limitReached}
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isContactSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : limitReached ? (
                      <span>Daily Limit Reached (2/2)</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Tool Rating & Feedback Widget */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Rate Your Experience</span>
                </h2>
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                  Max 2/day
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Help us improve! How was your experience using our client-side image tools?
              </p>

              {feedbackSubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-200 text-base">
                    Thank You for Your Feedback!
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Your rating helps us keep ImageResizeNow fast, free, and private.
                  </p>
                  {!limitReached && (
                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackSubmitted(false);
                        setFeedbackComment('');
                      }}
                      className="mt-3 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900 dark:hover:bg-emerald-800 text-emerald-800 dark:text-emerald-200 transition-colors"
                    >
                      Submit Another Rating
                    </button>
                  )}
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} noValidate className="space-y-4">
                  {/* Star Rating */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Star Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          disabled={limitReached}
                          onClick={() => setRating(star)}
                          className="p-1 transition-transform hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-2">
                        {rating} of 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Optional Comment */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Optional Comment
                      </label>
                      <span
                        className={`text-[10px] ${
                          feedbackComment.length > 1000 ? 'text-rose-600 font-bold' : 'text-slate-400'
                        }`}
                      >
                        {feedbackComment.length}/1,000 characters
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      disabled={limitReached}
                      value={feedbackComment}
                      onChange={(e) => {
                        setFeedbackComment(e.target.value);
                        if (ratingError) setRatingError(null);
                      }}
                      placeholder="What did you like or what could we improve?"
                      className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white text-sm focus:ring-2 outline-none resize-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                        ratingError
                          ? 'border-rose-500 focus:ring-rose-400'
                          : 'border-slate-300 dark:border-slate-700 focus:ring-blue-500'
                      }`}
                    />
                    {ratingError && (
                      <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{ratingError}</span>
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isRatingSubmitting || limitReached}
                    className="w-full py-3 rounded-xl font-bold text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isRatingSubmitting ? 'Submitting...' : limitReached ? 'Daily Limit Reached (2/2)' : 'Submit Rating'}
                  </button>
                </form>
              )}
            </div>

            {/* Google Sheets Note & Anti-Spam protection note */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
              <div className="flex items-start gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Google Sheets Integration:</strong> Submissions are logged securely to your Google Sheet without database overhead.
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pl-6">
                🔒 Protected by daily IP rate limiting (maximum 2 submissions per day).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
