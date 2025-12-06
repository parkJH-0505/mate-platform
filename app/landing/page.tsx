'use client'

import React from 'react'
import { 
  Navbar, 
  Footer, 
  Container, 
  Section 
} from '@/components/FooterNavbar'
import {
  HeroSection,
  FeatureSection,
  CTASection,
  TestimonialSection,
  StatsSection
} from '@/components/LayoutComponents'
import { NeonButton } from '@/components/PremiumComponents'

export default function LandingPage() {
  // Navigation items
  const navItems = [
    { 
      label: 'Product',
      children: [
        { label: 'Features', href: '#features', description: 'Explore all features' },
        { label: 'Pricing', href: '#pricing', description: 'Simple, transparent pricing' },
        { label: 'Integrations', href: '#integrations', description: 'Connect your tools' },
      ]
    },
    { 
      label: 'Solutions',
      children: [
        { label: 'For Startups', href: '#startups' },
        { label: 'For VCs', href: '#vcs' },
        { label: 'For LPs', href: '#lps' },
      ]
    },
    { label: 'Resources', href: '#resources' },
    { label: 'Company', href: '#company' },
  ]

  // Features data
  const features = [
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Real-time insights and comprehensive reporting to make data-driven decisions.',
      link: { label: 'Learn more', href: '#' }
    },
    {
      icon: '🔒',
      title: 'Bank-Grade Security',
      description: 'SOC 2 Type II certified with end-to-end encryption and advanced access controls.',
      link: { label: 'Security details', href: '#' }
    },
    {
      icon: '🤝',
      title: 'LP Portal',
      description: 'Give your limited partners secure, real-time access to their investment data.',
      link: { label: 'Explore portal', href: '#' }
    },
    {
      icon: '🚀',
      title: 'Automated Workflows',
      description: 'Streamline your operations with intelligent automation and integrations.',
      link: { label: 'View workflows', href: '#' }
    },
    {
      icon: '📱',
      title: 'Mobile Ready',
      description: 'Access your data anywhere with our responsive web and mobile applications.',
      link: { label: 'Download app', href: '#' }
    },
    {
      icon: '🌍',
      title: 'Global Compliance',
      description: 'Meet regulatory requirements across jurisdictions with built-in compliance tools.',
      link: { label: 'Compliance info', href: '#' }
    }
  ]

  // Testimonials data
  const testimonials = [
    {
      content: "Visible.vc transformed how we manage our portfolio. The real-time analytics and LP reporting features save us hours every week.",
      author: "Sarah Chen",
      role: "Managing Partner",
      company: "Future Ventures",
      rating: 5
    },
    {
      content: "The platform's intuitive design and powerful features make it easy for our entire team to stay aligned and informed.",
      author: "Michael Roberts",
      role: "Principal",
      company: "Growth Capital Partners",
      rating: 5
    },
    {
      content: "Outstanding support team and continuous product improvements. They truly understand the needs of VCs.",
      author: "Emma Thompson",
      role: "Investment Director",
      company: "Innovation Fund",
      rating: 5
    }
  ]

  // Stats data
  const stats = [
    { value: '500+', label: 'VC Funds', description: 'Trust our platform' },
    { value: '$50B', label: 'Assets Managed', description: 'On our platform' },
    { value: '99.9%', label: 'Uptime', description: 'Enterprise reliability' },
    { value: '24/7', label: 'Support', description: 'Always here to help' }
  ]

  // Footer sections
  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#' },
        { label: 'Pricing', href: '#' },
        { label: 'Security', href: '#' },
        { label: 'Roadmap', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Contact', href: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '#' },
        { label: 'API Reference', href: '#' },
        { label: 'Support', href: '#' },
        { label: 'Status', href: '#' }
      ]
    }
  ]

  const socialLinks = [
    { 
      platform: 'Twitter', 
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )
    },
    {
      platform: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 24 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
    {
      platform: 'GitHub',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      )
    }
  ]

  const bottomLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' }
  ]

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Navbar */}
      <Navbar
        logo={
          <span className="text-2xl font-bold text-primary-bright">
            Visible.vc
          </span>
        }
        items={navItems}
        actions={
          <div className="flex items-center gap-4">
            <NeonButton variant="ghost" size="small">
              Sign In
            </NeonButton>
            <NeonButton variant="gradient" size="small">
              Get Started
            </NeonButton>
          </div>
        }
        variant="transparent"
        sticky
      />

      {/* Hero Section */}
      <HeroSection
        title="Modern Infrastructure for Venture Capital"
        subtitle="Trusted by 500+ VC Funds"
        description="Streamline your fund operations, delight your LPs, and make better investment decisions with our all-in-one platform."
        primaryAction={{
          label: 'Start Free Trial',
          onClick: () => console.log('Start trial')
        }}
        secondaryAction={{
          label: 'Watch Demo',
          onClick: () => console.log('Watch demo')
        }}
        height="large"
        variant="centered"
      />

      {/* Stats Section */}
      <StatsSection
        stats={stats}
        variant="centered"
      />

      {/* Features Section */}
      <Section background="secondary" spacing="large">
        <Container>
          <FeatureSection
            title="Everything You Need to Run Your Fund"
            subtitle="From portfolio management to LP reporting, we've got you covered with enterprise-grade tools."
            features={features}
            columns={3}
            variant="cards"
          />
        </Container>
      </Section>

      {/* Testimonials Section */}
      <Section spacing="large">
        <Container>
          <TestimonialSection
            title="Loved by Leading VCs"
            subtitle="See what fund managers are saying about our platform."
            testimonials={testimonials}
          />
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="gradient" spacing="medium">
        <Container>
          <CTASection
            title="Ready to Transform Your Fund Operations?"
            description="Join hundreds of VCs who trust our platform to manage billions in assets."
            primaryAction={{
              label: 'Get Started Free',
              onClick: () => console.log('Get started')
            }}
            secondaryAction={{
              label: 'Schedule Demo',
              onClick: () => console.log('Schedule demo')
            }}
            variant="gradient"
          />
        </Container>
      </Section>

      {/* Footer */}
      <Footer
        logo={
          <span className="text-2xl font-bold text-primary-bright">
            Visible.vc
          </span>
        }
        description="The modern platform for venture capital management. Streamline operations, delight LPs, and make better decisions."
        sections={footerSections}
        socialLinks={socialLinks}
        bottomLinks={bottomLinks}
        copyright="© 2024 Visible.vc. All rights reserved."
        variant="default"
      />
    </div>
  )
}
