'use client'

import React from 'react'
import {
  LandingHeader,
  HeroSection,
  TrustSection,
  HowItWorksSection,
  CTASection,
  LandingFooter
} from './components/landing'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Trust Section (Testimonials + Stats) */}
      <TrustSection />

      {/* How It Works */}
      <div id="how-it-works">
        <HowItWorksSection />
      </div>

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}
