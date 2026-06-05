"use client";

import { useState } from "react";

const features = [
  {
    id: "ai-extraction",
    title: "AI Action Item Extraction",
    description: "Stop manually parsing meeting transcripts. Our AI identifies commitments, deadlines, and owners with 95%+ accuracy—tailored specifically for project management workflows.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    color: "sky-blue",
    benefits: ["95%+ accuracy on action item detection", "Project management terminology trained", "Contextual deadline inference"],
  },
  {
    id: "integrations",
    title: "Direct PM Tool Integration",
    description: "Push action items directly to Asana or Trello. No copy-pasting, no context switching. ClearNotes maps tasks to your existing projects, sections, and workflows.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    color: "mint",
    benefits: ["Native Asana & Trello sync", "Automatic project mapping", "Two-way status updates"],
  },
  {
    id: "deliverables",
    title: "Deliverable-Focused Output",
    description: "Get structured summaries that focus on outcomes, not transcripts. Every meeting produces a clean action plan with owners, priorities, and due dates clearly defined.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "sky-blue",
    benefits: ["Outcome-based summaries", "Auto-prioritized by urgency", "Progress tracking over time"],
  },
  {
    id: "time-savings",
    title: "Reclaim 2-3 Hours Weekly",
    description: "Project managers spend an average of 3+ hours per week on meeting documentation. Cut that by 80% and redirect your time to what matters: shipping projects.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "mint",
    benefits: ["Automated documentation", "Instant meeting recaps", "Bulk action item processing"],
  },
];

const workflowSteps = [
  {
    step: "01",
    title: "Connect",
    description: "Link your calendar and PM tools (Asana/Trello) in under 2 minutes.",
  },
  {
    step: "02",
    title: "Meet",
    description: "Attend meetings normally. ClearNotes joins and listens automatically.",
  },
  {
    step: "03",
    title: "Review",
    description: "Get structured action items within minutes of the meeting ending.",
  },
  {
    step: "04",
    title: "Sync",
    description: "One-click push to your project management tool. Done.",
  },
];

export default function Features() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  return (
    <section id="features" className="py-24 bg-white">
      <div className="px-6 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-sky-blue-600 uppercase bg-sky-blue-50 rounded-full">
            Features
          </span>
          <h2 className="font-[Lora] text-3xl md:text-4xl font-semibold text-sand-900 mb-4">
            Built for Project Managers, <span className="italic text-sky-blue-600">Not Note-Takers</span>
          </h2>
          <p className="text-lg text-sand-600 leading-relaxed">
            Every feature is designed to reduce your cognitive load and keep projects moving forward.
            No fluff. Just the tools you need to capture commitments and ship deliverables.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-24">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`group relative p-8 rounded-2xl border transition-all duration-300 cursor-pointer ${
                activeFeature === feature.id
                  ? "bg-sand-50 border-sand-200 shadow-lg"
                  : "bg-white border-sand-100 hover:border-sand-200 hover:shadow-md"
              }`}
              onMouseEnter={() => setActiveFeature(feature.id)}
              onMouseLeave={() => setActiveFeature(null)}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                feature.color === "sky-blue" ? "bg-sky-blue-100 text-sky-blue-600" : "bg-mint-100 text-mint-600"
              }`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-sand-900 mb-3">{feature.title}</h3>
              <p className="text-sand-600 leading-relaxed mb-6">{feature.description}</p>

              {/* Benefits */}
              <ul className="space-y-2">
                {feature.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-sand-700">
                    <svg className={`w-4 h-4 flex-shrink-0 ${feature.color === "sky-blue" ? "text-sky-blue-500" : "text-mint-500"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Workflow section */}
        <div className="bg-sand-50 rounded-3xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h3 className="font-[Lora] text-2xl md:text-3xl font-semibold text-sand-900 mb-3">
              How It <span className="italic text-sky-blue-600">Works</span>
            </h3>
            <p className="text-sand-600">From meeting to managed in four simple steps.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((item, index) => (
              <div key={index} className="relative">
                <div className="p-6 bg-white rounded-xl border border-sand-100 shadow-sm h-full">
                  <span className="text-3xl font-bold text-sand-200 mb-4 block">{item.step}</span>
                  <h4 className="font-semibold text-sand-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-sand-600">{item.description}</p>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-sand-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
