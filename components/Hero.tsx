"use client";

import { useState } from "react";

export default function Hero() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle waitlist signup
    console.log("Waitlist signup:", email);
    setEmail("");
    alert("Thanks for joining the waitlist!");
  };

  return (
    <section className="relative overflow-hidden bg-sand-50">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dot-pattern bg-dot-pattern opacity-40" />

      {/* Gradient overlays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-sky-blue-200/40 via-transparent to-transparent blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-gradient-radial from-mint-200/30 via-transparent to-transparent blur-3xl" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-blue-500 to-sky-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="text-xl font-semibold text-sand-900 tracking-tight">ClearNotes</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-sand-600">
          <a href="#features" className="hover:text-sand-900 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-sand-900 transition-colors">Pricing</a>
          <a href="#social-proof" className="hover:text-sand-900 transition-colors">Testimonials</a>
        </div>
        <a
          href="#waitlist"
          className="px-4 py-2 text-sm font-medium text-sky-blue-700 bg-sky-blue-100 hover:bg-sky-blue-200 rounded-full transition-colors"
        >
          Join Waitlist
        </a>
      </nav>

      {/* Hero content */}
      <div className="relative z-10 px-6 pt-16 pb-24 md:pt-24 md:pb-32 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-mint-100/80 border border-mint-200">
            <span className="w-2 h-2 rounded-full bg-mint-500 animate-pulse" />
            <span className="text-xs font-medium text-mint-800">Now in private beta</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-sand-900 tracking-tight leading-[1.1] mb-6">
            Turn Meeting Chaos into{" "}
            <span className="font-[Lora] italic text-sky-blue-600">Clear Action</span>
          </h1>

          {/* Value prop */}
          <p className="text-lg md:text-xl text-sand-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            ClearNotes uses AI to extract action items tailored for project managers.
            Save 2-3 hours weekly on meeting summaries and never lose track of deliverables again.
          </p>

          {/* CTA Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your work email"
              required
              className="flex-1 px-4 py-3 rounded-lg border border-sand-200 bg-white text-sand-900 placeholder:text-sand-400 focus:outline-none focus:ring-2 focus:ring-sky-blue-500/20 focus:border-sky-blue-500 transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-sand-900 text-white font-medium hover:bg-sand-800 active:scale-[0.98] transition-all shadow-lg shadow-sand-900/10"
            >
              Get Early Access
            </button>
          </form>

          {/* Trust indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-sand-500">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-mint-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Free for early users</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-mint-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-mint-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>

        {/* Product Preview */}
        <div className="mt-16 md:mt-20 max-w-5xl mx-auto">
          <div className="relative rounded-2xl bg-white shadow-2xl shadow-sand-200/50 border border-sand-100 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-sand-50 border-b border-sand-100">
              <div className="w-3 h-3 rounded-full bg-sand-300" />
              <div className="w-3 h-3 rounded-full bg-sand-300" />
              <div className="w-3 h-3 rounded-full bg-sand-300" />
              <div className="flex-1 mx-4">
                <div className="px-3 py-1.5 bg-white rounded-md text-xs text-sand-400 text-center border border-sand-100">
                  clearnotes.app/dashboard
                </div>
              </div>
            </div>

            {/* App preview content */}
            <div className="p-6 md:p-8 bg-gradient-to-b from-white to-sand-50/50">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Sidebar */}
                <div className="hidden md:block p-4 rounded-xl bg-white border border-sand-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-sky-blue-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-sand-900">ClearNotes</span>
                  </div>
                  <div className="space-y-2">
                    {["Dashboard", "Meetings", "Action Items", "Integrations"].map((item) => (
                      <div key={item} className="px-3 py-2 rounded-lg text-sm text-sand-600 hover:bg-sand-50 cursor-pointer">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main content */}
                <div className="md:col-span-2 space-y-4">
                  {/* Meeting card */}
                  <div className="p-4 rounded-xl bg-white border border-sand-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sand-900">Weekly Sprint Planning</h3>
                      <span className="text-xs text-mint-600 bg-mint-50 px-2 py-1 rounded-full">Processed</span>
                    </div>
                    <p className="text-sm text-sand-500 mb-4">Today at 10:00 AM • 45 minutes</p>

                    {/* AI Summary */}
                    <div className="p-3 rounded-lg bg-sky-blue-50/50 border border-sky-blue-100 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-4 h-4 text-sky-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="text-xs font-medium text-sky-blue-700">AI Summary</span>
                      </div>
                      <p className="text-sm text-sand-700">Team aligned on Q4 priorities. 8 action items extracted across design, engineering, and QA.</p>
                    </div>

                    {/* Action items preview */}
                    <div className="space-y-2">
                      {[
                        { task: "Update sprint board with new tickets", assignee: "You", priority: "High" },
                        { task: "Review design mockups by Friday", assignee: "Sarah", priority: "Medium" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-sand-50/50 border border-sand-100">
                          <div className="w-5 h-5 rounded border-2 border-sand-300" />
                          <span className="flex-1 text-sm text-sand-700">{item.task}</span>
                          <span className="text-xs text-sand-500">{item.assignee}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${item.priority === "High" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}>
                            {item.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
