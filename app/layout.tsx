import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { SceneProvider } from "@/components/three/scene-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

export const metadata: Metadata = {
  title: "Vault - Secure Content Platform",
  description:
    "Silent. Controlled. Trustworthy. A secure content management platform with spatial awareness.",
}

export const viewport: Viewport = {
  themeColor: "#050a0e",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased overflow-hidden h-full" suppressHydrationWarning>
        <SceneProvider />
        <main className="relative z-10 h-screen overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
