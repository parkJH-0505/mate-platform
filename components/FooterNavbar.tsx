'use client'

import React from 'react'
import { motion } from 'framer-motion'

// Footer Component
export interface FooterLink {
  label: string
  href: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface SocialLink {
  platform: string
  href: string
  icon: React.ReactNode
}

export interface FooterProps {
  logo?: React.ReactNode
  description?: string
  sections?: FooterSection[]
  socialLinks?: SocialLink[]
  bottomLinks?: FooterLink[]
  copyright?: string
  variant?: 'default' | 'minimal' | 'centered'
  className?: string
}

export const Footer: React.FC<FooterProps> = ({
  logo,
  description,
  sections = [],
  socialLinks = [],
  bottomLinks = [],
  copyright = `© ${new Date().getFullYear()} All rights reserved.`,
  variant = 'default',
  className = ''
}) => {
  const variants = {
    default: {
      container: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8',
      alignment: 'text-left',
      socialAlignment: 'justify-start'
    },
    minimal: {
      container: 'flex flex-col md:flex-row justify-between gap-8',
      alignment: 'text-left',
      socialAlignment: 'justify-start'
    },
    centered: {
      container: 'flex flex-col items-center gap-8',
      alignment: 'text-center',
      socialAlignment: 'justify-center'
    }
  }

  const style = variants[variant]

  return (
    <footer className={`bg-background-secondary/50 border-t border-glass-border ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className={style.container}>
          {/* Logo and Description */}
          {(logo || description) && (
            <div className={`${variant === 'default' ? 'lg:col-span-2' : ''} ${style.alignment}`}>
              {logo && (
                <div className="mb-4">
                  {logo}
                </div>
              )}
              {description && (
                <p className="text-text-secondary max-w-sm">
                  {description}
                </p>
              )}
              
              {/* Social Links for Default Variant */}
              {variant === 'default' && socialLinks.length > 0 && (
                <div className="mt-6 flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-full bg-glass-light border border-glass-border
                               flex items-center justify-center text-text-secondary
                               hover:bg-primary-main/20 hover:text-primary-bright hover:border-primary-main/50
                               transition-all duration-200"
                      aria-label={social.platform}
                    >
                      {social.icon}
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Footer Sections */}
          {variant === 'default' && sections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-text-primary mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-text-secondary hover:text-primary-bright transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links for Minimal/Centered Variants */}
        {variant !== 'default' && socialLinks.length > 0 && (
          <div className={`flex gap-4 ${style.socialAlignment}`}>
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-glass-light border border-glass-border
                         flex items-center justify-center text-text-secondary
                         hover:bg-primary-main/20 hover:text-primary-bright hover:border-primary-main/50
                         transition-all duration-200"
                aria-label={social.platform}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        )}

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-glass-border">
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 ${style.alignment}`}>
            <p className="text-text-tertiary text-sm">
              {copyright}
            </p>
            
            {bottomLinks.length > 0 && (
              <nav className="flex gap-6">
                {bottomLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-text-tertiary hover:text-text-secondary text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}

// Navbar Component (Enhanced version)
export interface NavbarProps {
  logo: React.ReactNode
  items: Array<{
    label: string
    href?: string
    onClick?: () => void
    children?: Array<{
      label: string
      href?: string
      onClick?: () => void
      description?: string
    }>
  }>
  actions?: React.ReactNode
  variant?: 'default' | 'transparent' | 'blur'
  sticky?: boolean
  className?: string
}

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  items,
  actions,
  variant = 'default',
  sticky = true,
  className = ''
}) => {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const variantClasses = {
    default: 'bg-background-primary/95 backdrop-blur-xl',
    transparent: `${isScrolled ? 'bg-background-primary/95 backdrop-blur-xl' : 'bg-transparent'}`,
    blur: 'bg-background-primary/50 backdrop-blur-xl'
  }

  return (
    <nav className={`
      ${sticky ? 'fixed top-0 left-0 right-0 z-50' : ''}
      ${variantClasses[variant]}
      ${isScrolled ? 'shadow-lg' : ''}
      border-b border-glass-border/50
      transition-all duration-300
      ${className}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {items.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              {actions}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary
                       hover:bg-glass-light transition-all"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: mobileMenuOpen ? 'auto' : 0,
          opacity: mobileMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="lg:hidden overflow-hidden"
      >
        <div className="px-4 py-6 space-y-4 bg-background-secondary/50 backdrop-blur-xl border-t border-glass-border">
          {items.map((item, index) => (
            <MobileNavItem key={index} item={item} />
          ))}
          <div className="pt-4 border-t border-glass-border">
            {actions}
          </div>
        </div>
      </motion.div>
    </nav>
  )
}

// Nav Item Component
const NavItem: React.FC<{ item: any }> = ({ item }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  if (item.children) {
    return (
      <div 
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button className="flex items-center gap-1 text-text-secondary hover:text-text-primary
                         font-medium transition-colors">
          {item.label}
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 mt-2 w-64 rounded-xl bg-background-secondary
                     border border-glass-border shadow-2xl backdrop-blur-xl overflow-hidden"
          >
            {item.children.map((child: any, index: number) => (
              <a
                key={index}
                href={child.href}
                onClick={child.onClick}
                className="block px-4 py-3 hover:bg-glass-light transition-colors"
              >
                <div className="font-medium text-text-primary">{child.label}</div>
                {child.description && (
                  <p className="text-sm text-text-tertiary mt-1">{child.description}</p>
                )}
              </a>
            ))}
          </motion.div>
        )}
      </div>
    )
  }

  return (
    <a
      href={item.href}
      onClick={item.onClick}
      className="text-text-secondary hover:text-text-primary font-medium transition-colors"
    >
      {item.label}
    </a>
  )
}

// Mobile Nav Item Component
const MobileNavItem: React.FC<{ item: any }> = ({ item }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-text-secondary 
                   hover:text-text-primary font-medium transition-colors"
        >
          {item.label}
          <svg 
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="mt-2 ml-4 space-y-2">
            {item.children.map((child: any, index: number) => (
              <a
                key={index}
                href={child.href}
                onClick={child.onClick}
                className="block text-text-tertiary hover:text-text-secondary transition-colors"
              >
                {child.label}
              </a>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <a
      href={item.href}
      onClick={item.onClick}
      className="block text-text-secondary hover:text-text-primary font-medium transition-colors"
    >
      {item.label}
    </a>
  )
}

// Container Component
export interface ContainerProps {
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large' | 'full'
  className?: string
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'large',
  className = ''
}) => {
  const sizeClasses = {
    small: 'max-w-3xl',
    medium: 'max-w-5xl',
    large: 'max-w-7xl',
    full: 'max-w-full'
  }

  return (
    <div className={`${sizeClasses[size]} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}

// Section Component
export interface SectionProps {
  children: React.ReactNode
  background?: 'default' | 'secondary' | 'gradient' | 'transparent'
  spacing?: 'small' | 'medium' | 'large'
  className?: string
}

export const Section: React.FC<SectionProps> = ({
  children,
  background = 'transparent',
  spacing = 'medium',
  className = ''
}) => {
  const backgroundClasses = {
    default: 'bg-background-primary',
    secondary: 'bg-background-secondary/30',
    gradient: 'bg-gradient-to-b from-background-primary to-background-secondary/30',
    transparent: 'bg-transparent'
  }

  const spacingClasses = {
    small: 'py-12',
    medium: 'py-20',
    large: 'py-32'
  }

  return (
    <section className={`${backgroundClasses[background]} ${spacingClasses[spacing]} ${className}`}>
      {children}
    </section>
  )
}
