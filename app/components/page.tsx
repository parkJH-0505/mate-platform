'use client'

import React, { useState } from 'react'

// 개별 컴포넌트 파일에서 직접 import
import { Button, ButtonGroup } from '@/components/Button'
import { Card, CardHeader, CardBody, CardFooter, CardGrid } from '@/components/Card'
import { Input, Textarea, Select, Checkbox, Radio } from '@/components/Input'
import { Heading, Text, Label, Link, Badge } from '@/components/Typography'
import { Navigation, Breadcrumb, Tabs, Sidebar } from '@/components/Navigation'
import { Modal, Alert, Toast, Dialog } from '@/components/Modal'
import { ProgressBar, CircularProgress, Skeleton, SkeletonGroup, Spinner, LoadingOverlay } from '@/components/Progress'

export default function ComponentsPage() {
  // State for interactive components
  const [activeTab, setActiveTab] = useState('tab1')
  const [modalOpen, setModalOpen] = useState(false)
  const [alertVisible, setAlertVisible] = useState(true)
  const [toastVisible, setToastVisible] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loadingOverlay, setLoadingOverlay] = useState(false)

  // Navigation 링크
  const navLinks = [
    { label: 'Home', href: '/', active: false },
    { label: 'Components', href: '/components', active: true },
    { label: 'Documentation', href: '/docs', active: false },
    { label: 'About', href: '/about', active: false }
  ]

  // Tab items
  const tabItems = [
    { id: 'tab1', label: 'Overview', badge: 3 },
    { id: 'tab2', label: 'Details' },
    { id: 'tab3', label: 'Settings', badge: 'New' }
  ]

  // Sidebar items
  const sidebarItems = [
    {
      id: '1',
      label: 'Dashboard',
      href: '/dashboard',
      icon: <span>🏠</span>,
      active: false
    },
    {
      id: '2',
      label: 'Components',
      icon: <span>🧩</span>,
      active: true,
      children: [
        { id: '2.1', label: 'Typography', href: '#typography' },
        { id: '2.2', label: 'Buttons', href: '#buttons' },
        { id: '2.3', label: 'Cards', href: '#cards' },
        { id: '2.4', label: 'Forms', href: '#forms' },
        { id: '2.5', label: 'Progress', href: '#progress' }
      ]
    },
    {
      id: '3',
      label: 'Settings',
      href: '/settings',
      icon: <span>⚙️</span>,
      active: false
    }
  ]

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Design System', href: '/design' },
    { label: 'Components' }
  ]

  return (
    <>
      {/* Navigation */}
      <Navigation
        logo={
          <Heading as="h1" variant="h4" color="white">
            MATE
          </Heading>
        }
        links={navLinks}
        actions={
          <ButtonGroup spacing="small">
            <Button variant="secondary" size="small">
              Sign In
            </Button>
            <Button variant="primary" size="small">
              Get Started
            </Button>
          </ButtonGroup>
        }
      />

      <div className="pt-20 min-h-screen bg-neutral-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <Breadcrumb items={breadcrumbItems} />
            <Heading as="h1" className="mt-4 mb-2">
              Component Library
            </Heading>
            <Text size="lg" color="gray">
              MATE Dark Theme 기반의 재사용 가능한 컴포넌트들입니다.
            </Text>
          </div>

          {/* Main Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card padding="small">
                <Sidebar items={sidebarItems} />
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Typography Section */}
              <section id="typography">
                <Heading as="h2" className="mb-6">Typography</Heading>

                <Card>
                  <CardBody className="space-y-4">
                    <Heading as="h1">Heading 1 - 48px</Heading>
                    <Heading as="h2">Heading 2 - 36px</Heading>
                    <Heading as="h3">Heading 3 - 30px</Heading>
                    <Heading as="h4">Heading 4 - 24px</Heading>
                    <Heading as="h5">Heading 5 - 20px</Heading>

                    <div className="border-t border-neutral-border my-4" />

                    <div className="space-y-2">
                      <Text size="xl">Extra Large Text - 20px</Text>
                      <Text size="lg">Large Text - 18px</Text>
                      <Text>Base Text - 16px</Text>
                      <Text size="sm">Small Text - 14px</Text>
                      <Text size="xs">Extra Small Text - 12px</Text>
                    </div>

                    <div className="border-t border-neutral-border my-4" />

                    <div className="space-y-2">
                      <Link href="#">Primary Link</Link>
                      <Link href="#" color="secondary">Secondary Link</Link>
                      <Link href="#" variant="underline">Underlined Link</Link>
                    </div>

                    <div className="flex gap-2 flex-wrap mt-4">
                      <Badge>Default Badge</Badge>
                      <Badge variant="primary">Primary</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="error">Error</Badge>
                      <Badge variant="primary" size="small" rounded>Small Rounded</Badge>
                    </div>
                  </CardBody>
                </Card>
              </section>

              {/* Buttons Section */}
              <section id="buttons">
                <Heading as="h2" className="mb-6">Buttons</Heading>

                <Card>
                  <CardBody className="space-y-6">
                    <div>
                      <Text weight="semibold" className="mb-3">Button Variants</Text>
                      <ButtonGroup>
                        <Button variant="primary">Primary Button</Button>
                        <Button variant="secondary">Secondary Button</Button>
                        <Button variant="ghost">Ghost Button</Button>
                      </ButtonGroup>
                    </div>

                    <div>
                      <Text weight="semibold" className="mb-3">Button Sizes</Text>
                      <ButtonGroup>
                        <Button size="small">Small</Button>
                        <Button size="medium">Medium</Button>
                        <Button size="large">Large</Button>
                      </ButtonGroup>
                    </div>

                    <div>
                      <Text weight="semibold" className="mb-3">Button States</Text>
                      <ButtonGroup>
                        <Button disabled>Disabled</Button>
                        <Button loading>Loading</Button>
                        <Button icon={<span>🚀</span>}>With Icon</Button>
                        <Button icon={<span>➡️</span>} iconPosition="right">Icon Right</Button>
                      </ButtonGroup>
                    </div>

                    <div>
                      <Text weight="semibold" className="mb-3">Full Width Button</Text>
                      <Button fullWidth>Full Width Button</Button>
                    </div>
                  </CardBody>
                </Card>
              </section>

              {/* Cards Section */}
              <section id="cards">
                <Heading as="h2" className="mb-6">Cards</Heading>

                <CardGrid columns={2} gap="medium">
                  <Card>
                    <CardHeader
                      title="Default Card"
                      subtitle="This is a default card style"
                      action={<Button size="small">Action</Button>}
                    />
                    <CardBody>
                      <Text>Default card with header, body, and footer sections.</Text>
                    </CardBody>
                    <CardFooter>
                      <Text size="sm" color="gray">Card footer content</Text>
                    </CardFooter>
                  </Card>

                  <Card variant="bordered">
                    <CardBody>
                      <Heading as="h4">Bordered Card</Heading>
                      <Text>This card has a more prominent border.</Text>
                    </CardBody>
                  </Card>

                  <Card variant="elevated" hoverEffect>
                    <CardBody>
                      <Heading as="h4">Elevated Card</Heading>
                      <Text>This card has elevated shadow and hover effect.</Text>
                    </CardBody>
                  </Card>

                  <Card variant="glass">
                    <CardBody>
                      <Heading as="h4">Glass Card</Heading>
                      <Text>This card has a glassmorphism effect.</Text>
                    </CardBody>
                  </Card>
                </CardGrid>
              </section>

              {/* Forms Section */}
              <section id="forms">
                <Heading as="h2" className="mb-6">Forms</Heading>

                <Card>
                  <CardBody className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Text Input"
                        placeholder="Enter text..."
                        hint="This is a helpful hint"
                      />
                      <Input
                        label="Email Input"
                        type="email"
                        placeholder="email@example.com"
                        icon={<span>✉️</span>}
                      />
                      <Input
                        label="Password Input"
                        type="password"
                        placeholder="Enter password..."
                        icon={<span>🔒</span>}
                        iconPosition="left"
                      />
                      <Input
                        label="Error Input"
                        placeholder="This has an error"
                        error="Please enter a valid value"
                      />
                    </div>

                    <Textarea
                      label="Textarea"
                      placeholder="Enter your message..."
                      hint="You can resize this vertically"
                      rows={4}
                    />

                    <Select label="Select Input" placeholder="Choose an option..." fullWidth>
                      <option value="1">Option 1</option>
                      <option value="2">Option 2</option>
                      <option value="3">Option 3</option>
                    </Select>

                    <div className="flex gap-8">
                      <div className="space-y-3">
                        <Text weight="semibold">Checkboxes</Text>
                        <Checkbox label="Checkbox option 1" />
                        <Checkbox label="Checkbox option 2" defaultChecked />
                        <Checkbox label="Disabled checkbox" disabled />
                      </div>

                      <div className="space-y-3">
                        <Text weight="semibold">Radio Buttons</Text>
                        <Radio name="radio-group" label="Radio option 1" />
                        <Radio name="radio-group" label="Radio option 2" defaultChecked />
                        <Radio name="radio-group" label="Disabled radio" disabled />
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </section>

              {/* Progress Section */}
              <section id="progress">
                <Heading as="h2" className="mb-6">Progress Indicators</Heading>

                <Card>
                  <CardBody className="space-y-8">
                    <div className="space-y-4">
                      <Text weight="semibold">Progress Bars</Text>
                      <ProgressBar value={25} label="Basic Progress" showValue />
                      <ProgressBar value={50} variant="success" label="Success Progress" showValue />
                      <ProgressBar value={75} variant="warning" label="Warning Progress" showValue animated />
                      <ProgressBar value={90} variant="error" size="large" label="Large Progress" showValue />
                    </div>

                    <div className="border-t border-neutral-border my-4" />

                    <div>
                      <Text weight="semibold" className="mb-4">Circular Progress</Text>
                      <div className="flex gap-6 items-center">
                        <CircularProgress value={25} size="small" />
                        <CircularProgress value={50} variant="success" />
                        <CircularProgress value={75} size="large" variant="warning" />
                      </div>
                    </div>

                    <div className="border-t border-neutral-border my-4" />

                    <div>
                      <Text weight="semibold" className="mb-4">Loading States</Text>
                      <div className="flex gap-6 items-center">
                        <Spinner size="small" />
                        <Spinner />
                        <Spinner size="large" variant="primary" />
                      </div>
                    </div>

                    <div className="border-t border-neutral-border my-4" />

                    <div>
                      <Text weight="semibold" className="mb-4">Skeleton Loading</Text>
                      <SkeletonGroup spacing="small">
                        <Skeleton />
                        <Skeleton />
                        <Skeleton width="60%" />
                      </SkeletonGroup>

                      <div className="mt-4 flex gap-4">
                        <Skeleton variant="circular" />
                        <div className="flex-1">
                          <Skeleton height={20} />
                          <Skeleton height={20} width="80%" className="mt-2" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Button onClick={() => setLoadingOverlay(true)}>
                        Show Loading Overlay
                      </Button>
                      {loadingOverlay && (
                        <div className="mt-4">
                          <LoadingOverlay visible={loadingOverlay} message="Loading..." blur>
                            <Card>
                              <CardBody>
                                <Text>Content behind the loading overlay</Text>
                              </CardBody>
                            </Card>
                          </LoadingOverlay>
                          <Button
                            variant="secondary"
                            size="small"
                            className="mt-2"
                            onClick={() => setLoadingOverlay(false)}
                          >
                            Hide Loading
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </section>

              {/* Navigation Components */}
              <section id="navigation">
                <Heading as="h2" className="mb-6">Navigation Components</Heading>

                <div className="space-y-6">
                  <Card>
                    <CardHeader title="Tabs" />
                    <CardBody>
                      <Tabs
                        items={tabItems}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                      />
                      <div className="mt-4 p-4 bg-neutral-dark-gray rounded-lg">
                        <Text>Active tab: {activeTab}</Text>
                      </div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader title="Pills Tabs" />
                    <CardBody>
                      <Tabs
                        items={tabItems}
                        activeTab={activeTab}
                        onChange={setActiveTab}
                        variant="pills"
                      />
                    </CardBody>
                  </Card>
                </div>
              </section>

              {/* Modals & Alerts Section */}
              <section id="modals">
                <Heading as="h2" className="mb-6">Modals & Alerts</Heading>

                <Card>
                  <CardBody className="space-y-6">
                    <div>
                      <Text weight="semibold" className="mb-3">Modals</Text>
                      <ButtonGroup>
                        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
                        <Button onClick={() => setToastVisible(true)}>Show Toast</Button>
                        <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
                      </ButtonGroup>
                    </div>

                    <div className="space-y-4">
                      <Text weight="semibold">Alerts</Text>

                      <Alert
                        type="info"
                        title="Info Alert"
                      >
                        This is an informational message.
                      </Alert>

                      <Alert type="success" title="Success Alert">
                        Your operation completed successfully!
                      </Alert>

                      <Alert type="warning" title="Warning Alert">
                        Please be careful about this action.
                      </Alert>

                      {alertVisible && (
                        <Alert
                          type="error"
                          title="Error Alert"
                          closable
                          onClose={() => setAlertVisible(false)}
                        >
                          Something went wrong. Please try again.
                        </Alert>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Example */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Example Modal"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setModalOpen(false)}>
              Save Changes
            </Button>
          </>
        }
      >
        <Text>
          This is an example modal dialog. You can put any content here.
        </Text>
        <div className="mt-4">
          <Input label="Example Input" placeholder="Type something..." fullWidth />
        </div>
      </Modal>

      {/* Toast Example */}
      {toastVisible && (
        <Toast
          type="success"
          title="Success!"
          onClose={() => setToastVisible(false)}
          position="top-right"
        >
          Your changes have been saved.
        </Toast>
      )}

      {/* Dialog Example */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={() => {
          setDialogOpen(false)
          setToastVisible(true)
        }}
        title="Confirm Action"
        description="Are you sure you want to proceed with this action? This cannot be undone."
        type="warning"
        confirmText="Yes, proceed"
        cancelText="Cancel"
      />
    </>
  )
}
