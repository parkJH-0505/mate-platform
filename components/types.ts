// Type definitions for all components

import React from 'react'

// Premium Components Types
export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'interactive' | 'gradient'
  glow?: boolean
  blur?: 'small' | 'medium' | 'large'
  noBorder?: boolean
}

export interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'gradient'
  size?: 'small' | 'medium' | 'large'
  glow?: boolean
  pulse?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export interface GradientHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  gradient?: 'purple-blue' | 'pink-purple' | 'blue-cyan' | 'custom'
  customGradient?: string
  glow?: boolean
  animate?: boolean
}

export interface FeatureCardProps {
  icon?: React.ReactNode
  title: string
  description: string
  link?: string
  linkText?: string
  highlighted?: boolean
}

export interface StatCardProps {
  label: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
}

// Data Components Types
export interface DataCardProps {
  title: string
  value: string | number | React.ReactNode
  change?: number
  chart?: React.ReactNode
  color?: 'green' | 'blue' | 'purple' | 'yellow' | 'red'
  icon?: React.ReactNode
  floating?: boolean
}

export interface DashboardGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4 | 'auto'
}

export interface CodeDisplayProps {
  code: string
  language?: string
  title?: string
  showLineNumbers?: boolean
  highlightLines?: number[]
  animate?: boolean
}

export interface Feature3DCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color?: 'green' | 'blue' | 'purple' | 'yellow' | 'red'
  delay?: number
}

export interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
  delay?: number
  decimals?: number
}

export interface ParallaxSectionProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export interface DataTableProps {
  columns: Array<{
    key: string
    label: string
    align?: 'left' | 'center' | 'right'
    colored?: boolean
  }>
  data: Array<Record<string, any>>
  highlightRow?: number
  animate?: boolean
}

// Chart Components Types
export interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  showDots?: boolean
  animate?: boolean
}

export interface ProgressRingProps {
  progress: number
  size?: number
  strokeWidth?: number
  color?: string
  backgroundColor?: string
  showValue?: boolean
  animate?: boolean
}

export interface BarChartProps {
  data: Array<{
    label: string
    value: number
    color?: string
  }>
  height?: number
  animate?: boolean
  showValues?: boolean
}

export interface ActivityIndicatorProps {
  data: Array<{
    date: string
    value: number
  }>
  color?: string
  cellSize?: number
  gap?: number
}

export interface MetricComparisonProps {
  current: number
  previous: number
  label: string
  format?: 'number' | 'currency' | 'percentage'
  currencySymbol?: string
  invertColors?: boolean
}

export interface LiveIndicatorProps {
  isLive?: boolean
  label?: string
  pulseColor?: string
}

// UI Components Types
export interface DropdownOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

export interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  searchable?: boolean
  multiple?: boolean
  className?: string
}

export interface TabItem {
  key: string
  label: string
  icon?: React.ReactNode
  badge?: string | number
}

export interface TabsProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
  variant?: 'default' | 'pills' | 'underline'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'green' | 'purple'
}

export interface ChipProps {
  label: string
  onRemove?: () => void
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  size?: 'small' | 'medium' | 'large'
  icon?: React.ReactNode
}

export interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  delay?: number
}

export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  className?: string
}

export interface AvatarProps {
  src?: string
  name?: string
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  status?: 'online' | 'offline' | 'busy' | 'away'
  className?: string
}

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  className?: string
  animation?: 'pulse' | 'wave'
}

// Form Components Types
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  clearable?: boolean
  onClear?: () => void
  variant?: 'default' | 'filled' | 'ghost'
  inputSize?: 'small' | 'medium' | 'large'
}

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helper?: string
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  showCharCount?: boolean
}

export interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  error?: string
  disabled?: boolean
  indeterminate?: boolean
  size?: 'small' | 'medium' | 'large'
}

export interface RadioOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
}

export interface RadioGroupProps {
  name: string
  value: string
  onChange: (value: string) => void
  options: RadioOption[]
  label?: string
  error?: string
  direction?: 'horizontal' | 'vertical'
}

export interface SliderProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  showValue?: boolean
  showTicks?: boolean
  disabled?: boolean
}

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onUpload: (files: File[]) => void
  label?: string
  error?: string
  disabled?: boolean
}

// Overlay Components Types
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large' | 'fullscreen'
  closeOnOverlayClick?: boolean
  showCloseButton?: boolean
  footer?: React.ReactNode
}

export interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
}

export interface ToastProps {
  id: string
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  message: string
  duration?: number
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
}

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
  icon?: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultOpen?: string[]
  className?: string
}

export interface PopoverProps {
  trigger: React.ReactNode
  content: React.ReactNode
  placement?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  type?: 'info' | 'warning' | 'danger'
}

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  position?: 'left' | 'right' | 'top' | 'bottom'
  size?: 'small' | 'medium' | 'large'
  title?: string
  children: React.ReactNode
}

// Navigation Components Types
export interface NavItem {
  label: string
  href?: string
  onClick?: () => void
  icon?: React.ReactNode
  badge?: string | number
  children?: NavItem[]
}

export interface NavigationBarProps {
  logo?: React.ReactNode
  items: NavItem[]
  actions?: React.ReactNode
  sticky?: boolean
  transparent?: boolean
  className?: string
}

export interface SidebarProps {
  items: NavItem[]
  collapsed?: boolean
  onToggle?: () => void
  header?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  maxVisible?: number
  className?: string
}

export interface Step {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
}

export interface StepsProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

// Layout Components Types
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

// Footer & Navbar Components Types
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

export interface ContainerProps {
  children: React.ReactNode
  size?: 'small' | 'medium' | 'large' | 'full'
  className?: string
}

export interface SectionProps {
  children: React.ReactNode
  background?: 'default' | 'secondary' | 'gradient' | 'transparent'
  spacing?: 'small' | 'medium' | 'large'
  className?: string
}
