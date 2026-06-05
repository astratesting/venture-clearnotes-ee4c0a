"use client";

import { useState } from "react";

const plans = [
  {
    name: "Starter",
    description: "For solo project managers getting started",
    price: { monthly: 0, yearly: 0 },
    features: [
      "5 meetings per month",
      "Basic action item extraction",
      "Email summaries",
      "7-day history",
      "Asana or Trello integration (1 workspace)",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    description: "For professionals managing multiple projects",
    price: { monthly: 29, yearly: 24 },
    features: [
      "Unlimited meetings",
      "Advanced AI action extraction",
      "Instant summaries & recaps",
      "Unlimited history",
      "Asana + Trello integration (unlimited workspaces)",
      "Priority support",
      "Team collaboration",
      "Custom templates",
    ],
    cta: "Join Waitlist",
    popular: true,
  },
  {
    name: "Team",
    description: "For teams who need enterprise features",
    price: { monthly: 79, yearly: 66 },
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "SSO & advanced security",
      "Admin dashboard & analytics",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "Onboarding assistance",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const enterpriseFeatures = [
  "Custom AI training on your terminology",
  "API access for workflow automation",
  "Advanced security & compliance (SOC 2)",
  "On-premise deployment option",
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(true);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="px-6 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-wider text-sky-blue-600 uppercase bg-sky-blue-50 rounded-full">
            Pricing
          </span>
          <h2 className="font-[Lora] text-3xl md:text-4xl font-semibold text-sand-900 mb-4">
            Simple Pricing, <span className="italic text-sky-blue-600">Powerful Results</span>
          </h2>
          <p className="text-lg text-sand-600 leading-relaxed">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!isYearly ? "text-sand-900" : "text-sand-500"}`}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-14 h-7 rounded-full bg-sand-200 transition-colors"
            aria-label="Toggle yearly billing"
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${
                isYearly ? "left-8" : "left-1"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? "text-sand-900" : "text-sand-500"}`}>
            Yearly
            <span className="ml-2 text-xs text-mint-600 bg-mint-100 px-2 py-0.5 rounded-full">Save 20%</span>
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? "bg-sand-900 border-sand-900 text-white shadow-xl scale-[1.02]"
                  : hoveredPlan === plan.name
                  ? "bg-white border-sand-200 shadow-lg"
                  : "bg-white border-sand-100 hover:border-sand-200 hover:shadow-md"
              }`}
              onMouseEnter={() => setHoveredPlan(plan.name)}
              onMouseLeave={() => setHoveredPlan(null)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 text-xs font-medium text-white bg-gradient-to-r from-sky-blue-500 to-sky-blue-600 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? "text-white" : "text-sand-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm ${plan.popular ? "text-sand-300" : "text-sand-500"}`}>{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-sand-900"}`}>
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className={`text-sm ${plan.popular ? "text-sand-300" : "text-sand-500"}`}>/month</span>
                  )}
                </div>
                {plan.price.monthly > 0 && isYearly && (
                  <p className={`text-xs mt-1 ${plan.popular ? "text-sand-400" : "text-sand-400"}`}>
                    Billed annually (${plan.price.yearly * 12}/year)
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? "text-mint-400" : "text-mint-500"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={`text-sm ${plan.popular ? "text-sand-200" : "text-sand-600"}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  plan.popular
                    ? "bg-white text-sand-900 hover:bg-sand-100"
                    : "bg-sand-900 text-white hover:bg-sand-800"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="bg-gradient-to-br from-sky-blue-50 to-mint-50 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-[Lora] text-2xl font-semibold text-sand-900 mb-3">
                Need Enterprise Features?
              </h3>
              <p className="text-sand-600 mb-6">
                Custom solutions for large organizations with specific security, compliance, and integration requirements.
              </p>
              <button className="px-6 py-3 bg-sand-900 text-white rounded-lg font-medium hover:bg-sand-800 transition-colors">
                Contact Sales
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {enterpriseFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-sky-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-sand-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
