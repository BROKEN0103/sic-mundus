import React from "react"
import { getSession } from "@/app/auth/actions"
import { SessionHydrator } from "@/components/auth/session-hydrator"
import { FloatingDock } from "@/components/dashboard/floating-dock"
import { DataInitializer } from "@/components/auth/data-initializer"

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware already guards these routes. We read the session here
  // only to hydrate Zustand — never redirect from here.
  const session = await getSession()

  const user = session
    ? {
        id: session.userId,
        email: session.email,
        name: session.name,
        role: session.role,
      }
    : null

  return (
    <SessionHydrator user={user}>
      <DataInitializer />
      <div className="relative h-screen pb-20">
        {children}
        <FloatingDock />
      </div>
    </SessionHydrator>
  )
}
