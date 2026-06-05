"use client";

import { useState } from "react";

const testimonials = [
  {
    quote: "ClearNotes cut my Monday morning status update prep from 45 minutes to 5. It pulls action items from all my meetings and formats them perfectly.",
    author: "Sarah Chen",
    role: "Senior PM at TechCorp",
    avatar: "SC",
    company: "TechCorp",
  },
  {
    quote: "Finally, an AI tool that understands project management language. It knows the difference between a stretch goal and a commitment.",
    author: "Marcus Johnson",
    role: "Program Manager",
    avatar: "MJ",
    company: "StartupXYZ",
  },
  {
    quote: "We integrated ClearNotes with Asana and our sprint planning got 3x faster. The AI extracts context I didn't even catch in the meeting.",
    author: "Elena Rodriguez",
    role: "Product Lead",
    avatar: "ER",
    company: "Scale.io",
  },
];

const stats = [
  { value: "2,500+", label: "PMs on waitlist" },
  { value: "10,000+", label: "Meetings processed" },
  { value: "45K+", label: "Action items extracted" },
  { value: "4.9/5", label: "Average rating" },
];

const logos = [
  { name: "Asana", width: "w-24" },
  { name: "Trello", width: "w-20" },
  { name: "Linear", width: "w-20" },
  { name: "Notion", width: "w-24" },
];

export default function SocialProof() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section id="social-proof" className="py-24 bg-sand-50">
      <div className="px-6 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-mint-700 uppercase bg-mint-100 rounded-full">
            Social Proof
          </span>
          <h2 className="font-[Lora] text-3xl md:text-4xl font-semibold text-sand-900 mb-4">
            Trusted by PMs at <span className="italic text-sky-blue-600">Leading Teams</span>
          </h2>
          <p className="text-lg text-sand-600 leading-relaxed">
            Join thousands of project managers who've reclaimed their time and sanity.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-sand-900 mb-2">{stat.value}</div>
              <div className="text-sm text-sand-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                activeTestimonial === index
                  ? "bg-white border-sky-blue-200 shadow-lg scale-[1.02]"
                  : "bg-white/50 border-sand-200 hover:bg-white hover:shadow-md"
              }`}
              onMouseEnter={() => setActiveTestimonial(index)}
            >
              {/* Quote mark */}
              <div className="mb-4">
                <svg className="w-8 h-8 text-sky-blue-200" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              <p className="text-sand-700 leading-relaxed mb-6">{testimonial.quote}</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-blue-400 to-sky-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-medium text-sand-900">{testimonial.author}</div>
                  <div className="text-sm text-sand-500">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Integration logos */}
        <div className="text-center">
          <p className="text-sm text-sand-500 mb-8">Works seamlessly with your favorite tools</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {logos.map((logo, index) => (
              <div
                key={index}
                className={`${logo.width} h-8 flex items-center justify-center px-4 py-2 bg-white rounded-lg border border-sand-100 text-sand-400 font-medium text-sm`}
              >
                {logo.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
