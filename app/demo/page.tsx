// @ts-nocheck
'use client'

import React from 'react'
import { 
  AnimatedBackground,
  GradientHeading,
  NeonButton,
  FeatureCard,
  GlassCard
} from '@/components/PremiumComponents'
import {
  DataCard,
  DashboardGrid,
  CodeDisplay,
  Feature3DCard,
  AnimatedCounter,
  ParallaxSection,
  DataTable
} from '@/components/DataComponents'
import {
  Sparkline,
  ProgressRing,
  BarChart,
  ActivityIndicator,
  MetricComparison,
  LiveIndicator
} from '@/components/Charts'

export default function DemoPage() {
  // 샘플 데이터
  const sparklineData = [20, 35, 40, 25, 50, 45, 60, 55, 70, 65, 80, 75]
  const barChartData = [
    { label: 'Jan', value: 45, color: '#5EA2FF' },
    { label: 'Feb', value: 52, color: '#9333EA' },
    { label: 'Mar', value: 48, color: '#22C55E' },
    { label: 'Apr', value: 65, color: '#F59E0B' },
    { label: 'May', value: 72, color: '#EF4444' },
  ]
  const activityData = Array.from({ length: 90 }, (_, i) => ({
    date: `2024-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
    value: Math.floor(Math.random() * 10)
  }))
  const tableData = [
    { name: 'Acme Inc.', status: 'Active', revenue: '$1.2M', growth: '+23%' },
    { name: 'Beta Corp', status: 'Pending', revenue: '$890K', growth: '+15%' },
    { name: 'Gamma LLC', status: 'Active', revenue: '$2.1M', growth: '+45%' },
    { name: 'Delta Co', status: 'Active', revenue: '$750K', growth: '-5%' },
  ]

  const codeExample = `// Real-time data synchronization
const syncData = async () => {
  const response = await fetch('/api/data');
  const data = await response.json();
  
  // Update dashboard metrics
  updateMetrics(data.metrics);
  updateCharts(data.charts);
  
  // Notify subscribers
  subscribers.forEach(callback => {
    callback(data);
  });
};

// Initialize WebSocket connection
const ws = new WebSocket('wss://api.visible.vc');
ws.onmessage = (event) => {
  const update = JSON.parse(event.data);
  handleRealtimeUpdate(update);
};`

  return (
    <div className="min-h-screen bg-background-primary">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <GradientHeading 
            as="h1" 
            gradient="purple-blue" 
            glow 
            animate
            className="mb-6"
          >
            Data-Driven Intelligence
          </GradientHeading>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto mb-8">
            Experience the next generation of venture capital management with real-time analytics, 
            intelligent insights, and seamless collaboration.
          </p>
          <div className="flex gap-4 justify-center">
            <NeonButton variant="gradient" size="large">
              Start Free Trial
            </NeonButton>
            <NeonButton variant="ghost" size="large">
              View Demo
            </NeonButton>
          </div>
        </div>
      </section>

      {/* Live Metrics Dashboard */}
      <ParallaxSection className="py-20 px-4" speed={0.3}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold text-text-primary">
              Portfolio Overview
            </h2>
            <LiveIndicator />
          </div>
          
          <DashboardGrid columns={4}>
            <DataCard
              title="Total Portfolio Value"
              value={<AnimatedCounter value={48.7} suffix="M" prefix="$" decimals={1} />}
              change={23.5}
              color="green"
              chart={<Sparkline data={sparklineData} color="#22C55E" />}
              floating
            />
            <DataCard
              title="Active Investments"
              value={<AnimatedCounter value={127} />}
              change={12}
              color="blue"
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
            <DataCard
              title="Average IRR"
              value={<AnimatedCounter value={35.2} suffix="%" decimals={1} />}
              change={-2.1}
              color="purple"
              chart={<ProgressRing progress={35.2} size={60} />}
            />
            <DataCard
              title="Exit Rate"
              value={<AnimatedCounter value={18.7} suffix="%" decimals={1} />}
              change={5.4}
              color="yellow"
              floating
            />
          </DashboardGrid>

          {/* Comparison Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <GlassCard variant="default" className="p-6">
              <MetricComparison
                current={2850000}
                previous={2100000}
                label="Monthly Revenue"
                format="currency"
              />
            </GlassCard>
            <GlassCard variant="default" className="p-6">
              <MetricComparison
                current={89}
                previous={76}
                label="Deal Conversion Rate"
                format="percentage"
              />
            </GlassCard>
            <GlassCard variant="default" className="p-6">
              <MetricComparison
                current={342}
                previous={298}
                label="Total LPs"
                format="number"
              />
            </GlassCard>
          </div>
        </div>
      </ParallaxSection>

      {/* Code Display Section */}
      <section className="py-20 px-4 bg-background-secondary/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">
            Built for Developers
          </h2>
          <CodeDisplay
            title="data-sync.js"
            code={codeExample}
            language="javascript"
            highlightLines={[8, 9, 15, 16, 17]}
            animate
          />
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">
            Comprehensive Analytics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard variant="elevated" className="p-8">
              <h3 className="text-xl font-semibold text-text-primary mb-6">
                Monthly Performance
              </h3>
              <BarChart data={barChartData} height={250} animate showValues />
            </GlassCard>
            
            <GlassCard variant="elevated" className="p-8">
              <h3 className="text-xl font-semibold text-text-primary mb-6">
                Activity Heatmap
              </h3>
              <div className="overflow-x-auto">
                <ActivityIndicator data={activityData} color="#9333EA" />
              </div>
            </GlassCard>
          </div>

          {/* Data Table */}
          <div className="mt-8">
            <DataTable
              columns={[
                { key: 'name', label: 'Company' },
                { key: 'status', label: 'Status', align: 'center' },
                { key: 'revenue', label: 'Revenue', align: 'right' },
                { key: 'growth', label: 'Growth', align: 'right', colored: true },
              ]}
              data={tableData}
              highlightRow={2}
            />
          </div>
        </div>
      </section>

      {/* 3D Feature Cards */}
      <ParallaxSection className="py-20 px-4 bg-background-secondary/30" speed={0.5}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">
            Powerful Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature3DCard
              icon="📊"
              title="Real-time Analytics"
              description="Track portfolio performance with live data updates and intelligent insights powered by machine learning."
              color="blue"
              delay={0}
            />
            <Feature3DCard
              icon="🤝"
              title="LP Portal"
              description="Provide limited partners with secure, branded access to their investment data and reports."
              color="purple"
              delay={0.1}
            />
            <Feature3DCard
              icon="🔒"
              title="Bank-grade Security"
              description="Enterprise-level security with SOC 2 compliance, encryption, and advanced access controls."
              color="green"
              delay={0.2}
            />
          </div>
        </div>
      </ParallaxSection>

      {/* Bottom CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard variant="gradient" glow className="p-12">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              Ready to Transform Your Fund?
            </h2>
            <p className="text-xl text-text-secondary mb-8">
              Join thousands of VCs using our platform to streamline operations and drive returns.
            </p>
            <NeonButton variant="primary" size="large" pulse>
              Get Started Today
            </NeonButton>
          </GlassCard>
        </div>
      </section>
    </div>
  )
}
