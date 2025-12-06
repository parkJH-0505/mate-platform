import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Visible.vc Component Library',
  description: 'Professional SaaS design system with dark theme',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* Gotham 폰트가 없는 경우 시스템 폰트 사용 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            body {
              font-family: "Gotham A", "Gotham B", "Adjusted Helvetica", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
            }
          `
        }} />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
