import type { Metadata } from 'next'
import '@/app/globals.css'
import '@/app/styles/highlight.css'
import { ChatProvider } from './providers/ChatProvider'
import ChatInput from './components/ChatInput'

export const metadata: Metadata = {
  title: 'Kenny Morales - Portfolio',
  description: 'AI Interface Designer & Developer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-['Sora',_sans-serif]">
        <ChatProvider>
          <div className="relative min-h-screen">
            {children}
            <ChatInput />
          </div>
        </ChatProvider>
      </body>
    </html>
  )
}