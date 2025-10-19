import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import SessionProviderClient from "@/components/SessionProviderClient"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Planet - Productivity Hub",
  description: "Your space garden for productivity",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-sans antialiased`}>
  <SessionProviderClient>{children}</SessionProviderClient>
        <Analytics />
      </body>
    </html>
  )
}
