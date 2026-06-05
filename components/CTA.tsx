"use client";

import { useState } from "react";

export default function CTA() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <section id="waitlist" className="py-24 bg-sand-50">
      <div className="px-6 max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-sand-900 rounded-3xl p-8 md:p-16">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-blue-500/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-mint-500/10 to-transparent rounded-full blur-3xl" />

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div>
              <h2 className="font-[Lora] text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight">
                Stop Taking Notes.
                <br />
                <span className="italic text-sky-blue-400">Start Shipping.</span>
              </h2>
              <p className="text-lg text-sand-300 mb-8 leading-relaxed">
                Join 2,500+ project managers who've reclaimed their time. Get early access to ClearNotes and be the first to experience AI-powered meeting summaries built for PMs.
              </p>

              {/* Benefits list */}
              <ul className="space-y-3">
                {[
                  "Free during private beta",
                  "No credit card required",
                  "Cancel anytime",
                  "Personal onboarding call",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-sand-300">
                    <svg className="w-5 h-5 text-mint-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right content - Form */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              {!isSubmitted ? (
                <>
                  <h3 className="text-xl font-semibold text-sand-900 mb-2">Join the Waitlist</h3>
                  <p className="text-sand-600 mb-6">We'll notify you when your spot is ready.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="cta-email" className="block text-sm font-medium text-sand-700 mb-1">
                        Work email
                      </label>
                      <input
                        id="cta-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-sand-200 text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sky-blue-500/20 focus:border-sky-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-sand-700 mb-1">
                        Your role
                      </label>
                      <select
                        id="role"
                        className="w-full px-4 py-3 rounded-lg border border-sand-200 text-sand-900 focus:outline-none focus:ring-2 focus:ring-sky-blue-500/20 focus:border-sky-blue-500 transition-all bg-white"
                      >
                        <option value="">Select your role</option>
                        <option value="pm">Project Manager</option>
                        <option value="program">Program Manager</option>
                        <option value="product">Product Manager</option>
                        <option value="team-lead">Team Lead</option>
                        <option value="founder">Founder / Executive</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-sand-900 text-white font-medium rounded-lg hover:bg-sand-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Joining...
                        </>
                      ) : (
                        "Get Early Access"
                      )}
                    </button>
                  </form>

                  <p className="text-xs text-sand-400 mt-4 text-center">
                    By joining, you agree to our Terms and Privacy Policy.
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-mint-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-mint-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-sand-900 mb-2">You're on the list!</h3>
                  <p className="text-sand-600">
                    Thanks for your interest. We'll be in touch soon with your early access details.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Final trust bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-sand-500">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>SOC 2 Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>GDPR Ready</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>2,500+ PMs Waiting</span>
          </div>
        </div>
      </div>
    </section>
  );
}
