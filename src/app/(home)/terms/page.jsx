'use client';

import { useAppContext } from '@/components/helper/Context';

export default function TermsAndConditionsPage() {
  const { website } = useAppContext();
  const themeColor = website?.theme_color || '#3b82f6';

  const rules = [
    {
      title: "Booking & Payment",
      items: [
        "All bookings must be completed with accurate personal information.",
        "Full or partial payment may be required to confirm a booking.",
        "Prices are subject to change before booking confirmation."
      ]
    },
    {
      title: "Identification",
      items: [
        "Tourists must carry a valid government-issued ID or passport during the tour.",
        "International travelers are responsible for obtaining required visas and travel documents."
      ]
    },
    {
      title: "Arrival & Departure",
      items: [
        "Participants must arrive at the designated meeting point on time.",
        "The company is not responsible for missed tours due to late arrival."
      ]
    },
    {
      title: "Health & Safety",
      items: [
        "Tourists must follow all safety instructions provided by guides and staff.",
        "Any medical conditions, allergies, or special requirements should be disclosed before the tour.",
        "Participation in activities is at the tourist's own risk."
      ]
    },
    {
      title: "Conduct",
      items: [
        "Respect fellow travelers, guides, local communities, and wildlife.",
        "Harassment, discrimination, abusive behavior, or illegal activities will not be tolerated.",
        "The company reserves the right to remove disruptive participants without refund."
      ]
    },
    {
      title: "Environmental Responsibility",
      items: [
        "Do not litter or damage natural environments.",
        "Follow local conservation rules and protected-area regulations.",
        "Use designated waste disposal facilities."
      ]
    },
    {
      title: "Property & Belongings",
      items: [
        "Tourists are responsible for their personal belongings.",
        "The company is not liable for lost, stolen, or damaged items."
      ]
    },
    {
      title: "Photography & Media",
      items: [
        "Respect privacy when taking photos or videos of others.",
        "By joining the tour, participants may appear in promotional photos or videos unless they opt out in advance."
      ]
    },
    {
      title: "Cancellation & Refunds",
      items: [
        "Cancellation and refund eligibility depend on the package's cancellation policy.",
        "No-shows may not be eligible for refunds."
      ]
    },
    {
      title: "Force Majeure",
      items: [
        "The company may modify, postpone, or cancel tours due to weather, natural disasters, political unrest, government restrictions, or other circumstances beyond its control."
      ]
    },
    {
      title: "Local Laws",
      items: [
        "Tourists must comply with all local laws and regulations of the destination.",
        "Any fines, penalties, or legal consequences resulting from violations are the responsibility of the tourist."
      ]
    },
    {
      title: "Tour Guide Instructions",
      items: [
        "Tourists must follow instructions from tour guides and authorized staff throughout the trip.",
        "Failure to comply may result in removal from the tour for safety reasons."
      ]
    }
  ];

  const shortVersion = [
    "Arrive on time.",
    "Carry valid identification.",
    "Follow guide instructions.",
    "Respect local culture and environment.",
    "No illegal or disruptive behavior.",
    "Keep personal belongings secure.",
    "Follow health and safety guidelines.",
    "Cancellation and refund rules apply according to package policy."
  ];

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Please read our rules and policies carefully before booking your tour.
          </p>
        </div>

        {/* Short Version Box */}
        <div 
          className="bg-white rounded-3xl p-8 mb-16 border shadow-xl relative overflow-hidden"
          style={{ borderColor: `${themeColor}40` }}
        >
          <div className="absolute top-0 left-0 w-2 h-full" style={{ backgroundColor: themeColor }}></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: themeColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Summary (Short Version)
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortVersion.map((rule, idx) => (
              <li key={idx} className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: themeColor }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <span className="text-gray-700">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Full Rules */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 pb-4 border-b border-gray-100">
            Comprehensive Tourist Rules
          </h2>
          
          <div className="space-y-12">
            {rules.map((ruleBlock, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span 
                    className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white mr-4 shadow-md flex-shrink-0"
                    style={{ backgroundColor: themeColor }}
                  >
                    {index + 1}
                  </span>
                  {ruleBlock.title}
                </h3>
                <ul className="space-y-3 pl-12">
                  {ruleBlock.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="text-gray-600 flex items-start">
                      <span className="block w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0" style={{ backgroundColor: themeColor }}></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
