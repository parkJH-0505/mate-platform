'use client'

import React, { useState } from 'react'
import { 
  // UI Components
  Dropdown, Tabs, Toggle, Chip, Tooltip, Breadcrumb, Avatar, Skeleton,
  
  // Form Components
  Input, TextArea, Checkbox, RadioGroup, Slider, FileUpload,
  
  // Overlay Components
  Modal, Alert, toast, ToastContainer, Accordion, Dialog, Drawer,
  
  // Navigation Components
  NavigationBar, Sidebar, Pagination, Steps,
  
  // Premium Components
  GlassCard, NeonButton, GradientHeading
} from '@/components'

export default function ComponentShowcase() {
  // States for interactive components
  const [dropdownValue, setDropdownValue] = useState('')
  const [activeTab, setActiveTab] = useState('tab1')
  const [toggleValue, setToggleValue] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [radioValue, setRadioValue] = useState('option1')
  const [sliderValue, setSliderValue] = useState(50)
  const [modalOpen, setModalOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentStep, setCurrentStep] = useState(1)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Sample data
  const dropdownOptions = [
    { value: 'option1', label: 'Option 1', icon: '📊' },
    { value: 'option2', label: 'Option 2', icon: '📈' },
    { value: 'option3', label: 'Option 3', icon: '📉', disabled: true },
  ]

  const tabItems = [
    { key: 'tab1', label: 'Overview', icon: '🏠', badge: 'New' },
    { key: 'tab2', label: 'Analytics', icon: '📊' },
    { key: 'tab3', label: 'Reports', icon: '📄', badge: 3 },
  ]

  const accordionItems = [
    {
      id: '1',
      title: 'What is Visible.vc?',
      content: 'Visible.vc is a comprehensive platform for venture capital management, offering tools for portfolio tracking, LP reporting, and data rooms.',
      icon: '💡'
    },
    {
      id: '2',
      title: 'How does it work?',
      content: 'Our platform integrates with your existing workflows to provide real-time insights and automated reporting capabilities.',
      icon: '⚙️'
    },
    {
      id: '3',
      title: 'Security & Compliance',
      content: 'We maintain SOC 2 Type II certification and use bank-grade encryption to protect your data.',
      icon: '🔒'
    }
  ]

  const navItems = [
    { label: 'Dashboard', href: '#', icon: '🏠' },
    { label: 'Portfolio', href: '#', icon: '📊', badge: 12 },
    { 
      label: 'Reports', 
      icon: '📄',
      children: [
        { label: 'Monthly Report', href: '#' },
        { label: 'Quarterly Report', href: '#' },
        { label: 'Annual Report', href: '#' },
      ]
    },
    { label: 'Settings', href: '#', icon: '⚙️' },
  ]

  const steps = [
    { id: 'setup', title: 'Setup Account', description: 'Create your account and verify email' },
    { id: 'import', title: 'Import Data', description: 'Import your portfolio companies' },
    { id: 'customize', title: 'Customize', description: 'Set up your dashboard and reports' },
    { id: 'invite', title: 'Invite Team', description: 'Add team members and LPs' },
  ]

  return (
    <div className="min-h-screen bg-background-primary p-8">
      <ToastContainer />
      
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center">
          <GradientHeading as="h1" gradient="purple-blue" glow animate>
            Component Showcase
          </GradientHeading>
          <p className="text-xl text-text-secondary mt-4">
            Complete UI component library for modern web applications
          </p>
        </div>

        {/* Navigation Components */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary mb-8">Navigation Components</h2>
          
          {/* Navigation Bar */}
          <div className="space-y-6">
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Navigation Bar</h3>
              <NavigationBar
                logo={<span className="text-2xl font-bold text-primary-bright">Logo</span>}
                items={navItems}
                actions={
                  <NeonButton size="small" variant="ghost">
                    Sign In
                  </NeonButton>
                }
                transparent={false}
                sticky={false}
              />
            </GlassCard>

            {/* Breadcrumb */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Breadcrumb</h3>
              <Breadcrumb
                items={[
                  { label: 'Home', href: '#', icon: '🏠' },
                  { label: 'Components', href: '#' },
                  { label: 'Navigation', icon: '🧭' },
                ]}
                separator="→"
              />
            </GlassCard>

            {/* Pagination */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Pagination</h3>
              <Pagination
                currentPage={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
              />
            </GlassCard>

            {/* Steps */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Steps/Stepper</h3>
              <Steps
                steps={steps}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
              />
            </GlassCard>
          </div>
        </section>

        {/* Form Components */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary mb-8">Form Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Input Fields</h3>
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="john@example.com"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  icon={<span>📧</span>}
                />
                
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  helper="Must be at least 8 characters"
                />
                
                <Input
                  label="Search"
                  placeholder="Search..."
                  clearable
                  variant="filled"
                />
              </div>
            </GlassCard>

            {/* TextArea */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Text Area</h3>
              <TextArea
                label="Description"
                placeholder="Enter a detailed description..."
                rows={5}
                maxLength={500}
                showCharCount
                helper="Provide as much detail as possible"
              />
            </GlassCard>

            {/* Dropdown */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Dropdown</h3>
              <div className="space-y-4">
                <Dropdown
                  label="Select Option"
                  options={dropdownOptions}
                  value={dropdownValue}
                  onChange={setDropdownValue}
                  placeholder="Choose an option"
                />
                
                <Dropdown
                  label="Searchable Dropdown"
                  options={dropdownOptions}
                  searchable
                  placeholder="Search and select"
                />
              </div>
            </GlassCard>

            {/* Checkbox & Radio */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Checkbox & Radio</h3>
              <div className="space-y-4">
                <Checkbox
                  checked={checkboxValue}
                  onChange={setCheckboxValue}
                  label="I agree to the terms and conditions"
                />
                
                <RadioGroup
                  name="options"
                  value={radioValue}
                  onChange={setRadioValue}
                  label="Select an option"
                  options={[
                    { value: 'option1', label: 'Option 1', description: 'Basic plan' },
                    { value: 'option2', label: 'Option 2', description: 'Pro plan' },
                    { value: 'option3', label: 'Option 3', description: 'Enterprise', disabled: true },
                  ]}
                />
              </div>
            </GlassCard>

            {/* Toggle & Slider */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Toggle & Slider</h3>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Toggle
                    checked={toggleValue}
                    onChange={setToggleValue}
                    label="Enable notifications"
                  />
                  <Toggle
                    checked={true}
                    onChange={() => {}}
                    label="Dark mode"
                    color="purple"
                    size="large"
                  />
                </div>
                
                <Slider
                  value={sliderValue}
                  onChange={setSliderValue}
                  label="Adjust brightness"
                  min={0}
                  max={100}
                  step={5}
                  showTicks
                />
              </div>
            </GlassCard>

            {/* File Upload */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">File Upload</h3>
              <FileUpload
                label="Upload Documents"
                accept=".pdf,.doc,.docx"
                multiple
                maxSize={5}
                onUpload={(files) => console.log('Files:', files)}
              />
            </GlassCard>
          </div>
        </section>

        {/* UI Components */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary mb-8">UI Components</h2>
          
          <div className="space-y-6">
            {/* Tabs */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Tabs</h3>
              <Tabs
                items={tabItems}
                activeKey={activeTab}
                onChange={setActiveTab}
                variant="default"
              />
              <div className="mt-4 p-4 bg-glass-light rounded-lg">
                <p className="text-text-secondary">
                  Content for {tabItems.find(t => t.key === activeTab)?.label}
                </p>
              </div>
            </GlassCard>

            {/* Chips/Tags */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Chips/Tags</h3>
              <div className="flex flex-wrap gap-2">
                <Chip label="Default" />
                <Chip label="Primary" variant="primary" />
                <Chip label="Success" variant="success" icon="✓" />
                <Chip label="Warning" variant="warning" />
                <Chip label="Error" variant="error" />
                <Chip 
                  label="Removable" 
                  variant="primary"
                  onRemove={() => console.log('Removed')} 
                />
              </div>
            </GlassCard>

            {/* Avatars */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Avatars</h3>
              <div className="flex items-center gap-4">
                <Avatar name="John Doe" size="small" />
                <Avatar name="Jane Smith" size="medium" status="online" />
                <Avatar 
                  src="https://i.pravatar.cc/150?img=1" 
                  name="Alex Johnson"
                  size="large"
                  status="busy"
                />
                <Avatar name="Team Member" size="xlarge" status="away" />
              </div>
            </GlassCard>

            {/* Tooltips */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Tooltips</h3>
              <div className="flex gap-4">
                <Tooltip content="This is a tooltip on top" placement="top">
                  <NeonButton variant="ghost" size="small">Top</NeonButton>
                </Tooltip>
                <Tooltip content="This is a tooltip on bottom" placement="bottom">
                  <NeonButton variant="ghost" size="small">Bottom</NeonButton>
                </Tooltip>
                <Tooltip content="This is a tooltip on left" placement="left">
                  <NeonButton variant="ghost" size="small">Left</NeonButton>
                </Tooltip>
                <Tooltip content="This is a tooltip on right" placement="right">
                  <NeonButton variant="ghost" size="small">Right</NeonButton>
                </Tooltip>
              </div>
            </GlassCard>

            {/* Skeleton Loaders */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Skeleton Loaders</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Skeleton variant="circular" width={40} height={40} />
                  <div className="flex-1 space-y-2">
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="50%" />
                  </div>
                </div>
                <Skeleton variant="rectangular" height={200} />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Overlay Components */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary mb-8">Overlay Components</h2>
          
          <div className="space-y-6">
            {/* Alerts */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Alerts</h3>
              <div className="space-y-3">
                <Alert
                  type="info"
                  title="Information"
                  message="This is an informational message for the user."
                />
                <Alert
                  type="success"
                  title="Success!"
                  message="Your changes have been saved successfully."
                  onClose={() => {}}
                />
                <Alert
                  type="warning"
                  message="Please review your input before proceeding."
                  action={{
                    label: 'Review',
                    onClick: () => console.log('Review clicked')
                  }}
                />
                <Alert
                  type="error"
                  title="Error"
                  message="Something went wrong. Please try again."
                  onClose={() => {}}
                />
              </div>
            </GlassCard>

            {/* Modal, Dialog, Drawer Triggers */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Modals & Overlays</h3>
              <div className="flex flex-wrap gap-4">
                <NeonButton onClick={() => setModalOpen(true)}>
                  Open Modal
                </NeonButton>
                <NeonButton variant="secondary" onClick={() => setDialogOpen(true)}>
                  Open Dialog
                </NeonButton>
                <NeonButton variant="ghost" onClick={() => setDrawerOpen(true)}>
                  Open Drawer
                </NeonButton>
                <NeonButton 
                  variant="gradient"
                  onClick={() => toast.show({
                    type: 'success',
                    title: 'Success!',
                    message: 'This is a toast notification'
                  })}
                >
                  Show Toast
                </NeonButton>
              </div>
            </GlassCard>

            {/* Accordion */}
            <GlassCard variant="default">
              <h3 className="text-xl font-semibold mb-4">Accordion</h3>
              <Accordion
                items={accordionItems}
                allowMultiple
                defaultOpen={['1']}
              />
            </GlassCard>
          </div>
        </section>

        {/* Sidebar Example */}
        <section>
          <h2 className="text-3xl font-bold text-text-primary mb-8">Sidebar</h2>
          <GlassCard variant="default" className="h-96 flex overflow-hidden">
            <Sidebar
              items={navItems}
              collapsed={sidebarCollapsed}
              onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
              header={
                <div className="text-xl font-bold text-primary-bright">
                  {sidebarCollapsed ? 'VC' : 'Visible.vc'}
                </div>
              }
              footer={
                <div className="text-sm text-text-tertiary">
                  © 2024 Visible.vc
                </div>
              }
            />
            <div className="flex-1 p-6">
              <h3 className="text-xl font-semibold mb-2">Main Content</h3>
              <p className="text-text-secondary">
                The sidebar can be collapsed to save space. Click the toggle button to see it in action.
              </p>
            </div>
          </GlassCard>
        </section>
      </div>

      {/* Modals */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Example Modal"
        size="medium"
        footer={
          <div className="flex gap-3 justify-end">
            <NeonButton variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </NeonButton>
            <NeonButton onClick={() => setModalOpen(false)}>
              Confirm
            </NeonButton>
          </div>
        }
      >
        <p className="text-text-secondary">
          This is a modal dialog. It can contain any content and be customized with different sizes and options.
        </p>
      </Modal>

      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => console.log('Confirmed')}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
        type="warning"
        confirmLabel="Yes, Proceed"
        cancelLabel="Cancel"
      />

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="right"
        size="medium"
        title="Drawer Panel"
      >
        <p className="text-text-secondary">
          This is a drawer panel that slides in from the side. It's perfect for forms, filters, or additional content.
        </p>
      </Drawer>
    </div>
  )
}
