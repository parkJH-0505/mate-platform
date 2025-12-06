'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { NeonButton, GradientHeading } from './PremiumComponents'

// Hero Section Component
export interface HeroSectionProps {
  title: string | React.ReactNode
  subtitle?: string
  description?: string
  primaryAction?: {
    label: string
    onClick: () => void
    href?: string
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    href?: string
  }
  backgroundImage?: string
  backgroundVideo?: string
  variant?: 'default' | 'centered' | 'split' | 'minimal'
  height?: 'full' | 'large' | 'medium'
  children?: React.ReactNode
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundImage,
  backgroundVideo,
  variant = 'default',
  height = 'large',
  children
}) => {
  const heightClasses = {
    full: 'min-h-screen',
    large: 'min-h-[80vh]',
    medium: 'min-h-[60vh]'
  }

  const variants = {
    default: {
      container: 'text-center items-center',
      content: 'max-w-4xl',
      alignment: 'mx-auto'
    },
    centered: {
      container: 'text-center items-center justify-center',
      content: 'max-w-3xl',
      alignment: 'mx-auto'
    },
    split: {
      container: 'text-left items-center',
      content: 'max-w-xl',
      alignment: ''
    },
    minimal: {
      container: 'text-center items-center',
      content: 'max-w-2xl',
      alignment: 'mx-auto'
    }
  }

  const style = variants[variant]

  return (
    <section className={`relative ${heightClasses[height]} flex ${style.container} overflow-hidden`}>
      {/* Background */}
      {backgroundVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}
      
      {backgroundImage && !backgroundVideo && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-primary/60 via-background-primary/40 to-background-primary" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-accent-purple/20 to-transparent opacity-30 blur-3xl animate-float" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-primary-main/20 to-transparent opacity-30 blur-3xl animate-float-delayed" />
      </div>

      {/* Content */}
      <div className={`relative z-10 px-4 sm:px-6 lg:px-8 ${style.content} ${style.alignment} w-full`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {subtitle && (
            <p className="text-sm sm:text-base text-primary-bright font-medium mb-4 tracking-wider uppercase">
              {subtitle}
            </p>
          )}
          
          {typeof title === 'string' ? (
            <GradientHeading 
              as="h1" 
              gradient="purple-blue" 
              glow
              className="mb-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl"
            >
              {title}
            </GradientHeading>
          ) : (
            <div className="mb-6">
              {title}
            </div>
          )}

          {description && (
            <p className="text-lg sm:text-xl text-text-secondary mb-8 leading-relaxed">
              {description}
            </p>
          )}

          {(primaryAction || secondaryAction) && (
            <div className="flex flex-wrap gap-4 justify-center">
              {primaryAction && (
                <NeonButton
                  size="large"
                  variant="gradient"
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.label}
                </NeonButton>
              )}
              {secondaryAction && (
                <NeonButton
                  size="large"
                  variant="ghost"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </NeonButton>
              )}
            </div>
          )}

          {children}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-text-tertiary"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}

// Feature Section Component
export interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  link?: {
    label: string
    href: string
  }
}

export interface FeatureSectionProps {
  title?: string
  subtitle?: string
  features: Feature[]
  columns?: 2 | 3 | 4
  variant?: 'cards' | 'list' | 'grid'
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  subtitle,
  features,
  columns = 3,
  variant = 'cards'
}) => {
  const columnClasses = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className={`grid ${columnClasses[columns]} gap-8`}>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {variant === 'cards' ? (
                <div className="group relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-primary-main/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative h-full p-8 bg-background-secondary/50 backdrop-blur-sm border border-glass-border rounded-2xl hover:border-primary-main/50 transition-all duration-300">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary mb-4">
                      {feature.description}
                    </p>
                    {feature.link && (
                      <a
                        href={feature.link.href}
                        className="inline-flex items-center text-primary-bright hover:text-primary-main transition-colors"
                      >
                        {feature.link.label}
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-2xl">{feature.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section Component
export interface CTASectionProps {
  title: string
  description?: string
  primaryAction: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'gradient' | 'minimal'
  backgroundImage?: string
}

export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = 'default',
  backgroundImage
}) => {
  const variants = {
    default: 'bg-background-secondary border border-glass-border',
    gradient: 'bg-gradient-to-r from-accent-purple/20 via-primary-main/20 to-accent-pink/20',
    minimal: 'bg-transparent'
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className={`
          relative rounded-3xl p-12 sm:p-16 overflow-hidden
          ${variants[variant]}
        `}>
          {backgroundImage && (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background-primary/80 to-background-primary/60" />
            </>
          )}

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              {title}
            </h2>
            
            {description && (
              <p className="text-lg sm:text-xl text-text-secondary mb-8">
                {description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 justify-center">
              <NeonButton
                size="large"
                variant="primary"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </NeonButton>
              
              {secondaryAction && (
                <NeonButton
                  size="large"
                  variant="ghost"
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </NeonButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Testimonial Section Component
export interface Testimonial {
  content: string
  author: string
  role: string
  company?: string
  avatar?: string
  rating?: number
}

export interface TestimonialSectionProps {
  title?: string
  subtitle?: string
  testimonials: Testimonial[]
  variant?: 'cards' | 'carousel' | 'grid'
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  title,
  subtitle,
  testimonials,
  variant = 'cards'
}) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background-secondary/30">
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-background-secondary/50 backdrop-blur-sm border border-glass-border rounded-2xl p-6 sm:p-8"
            >
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-glass-border'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              )}

              <p className="text-text-secondary mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-purple to-primary-main flex items-center justify-center text-white font-medium">
                    {testimonial.author.charAt(0)}
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-text-primary">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-text-tertiary">
                    {testimonial.role}
                    {testimonial.company && ` at ${testimonial.company}`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Stats Section Component
export interface Stat {
  value: string | number
  label: string
  description?: string
  prefix?: string
  suffix?: string
}

export interface StatsSectionProps {
  title?: string
  subtitle?: string
  stats: Stat[]
  variant?: 'default' | 'centered' | 'minimal'
}

export const StatsSection: React.FC<StatsSectionProps> = ({
  title,
  subtitle,
  stats,
  variant = 'default'
}) => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {(title || subtitle) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-bright mb-2">
                {stat.prefix}
                {stat.value}
                {stat.suffix}
              </div>
              <div className="text-lg font-medium text-text-primary mb-1">
                {stat.label}
              </div>
              {stat.description && (
                <p className="text-sm text-text-tertiary">
                  {stat.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
