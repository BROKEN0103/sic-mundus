"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  BookOpen,
  Upload,
  Activity,
  Shield,
  Settings,
  LayoutDashboard,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/stores/app-store"
import { logoutAction } from "@/app/auth/actions"

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/library", icon: BookOpen, label: "Library" },
  { href: "/upload", icon: Upload, label: "Upload" },
  { href: "/activity", icon: Activity, label: "Activity" },
  { href: "/access-control", icon: Shield, label: "Access Control" },
]

const adminItem = { href: "/admin", icon: Settings, label: "Admin" }

export function FloatingDock() {
  const pathname = usePathname()
  const router = useRouter()
  const user = useAppStore((s) => s.user)
  const setUser = useAppStore((s) => s.setUser)

  const items = user?.role === "admin" ? [...navItems, adminItem] : navItems

  async function handleLogout() {
    const result = await logoutAction()
    setUser(null)
    if (result.redirect) {
      router.push(result.redirect)
    }
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
      aria-label="Main navigation"
    >
      <div className="glass-panel-strong glass-glow flex items-center gap-1 rounded-2xl px-2 py-2">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-all duration-300",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="dock-active"
                  className="absolute inset-0 rounded-xl bg-primary/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <item.icon className="relative z-10 h-4 w-4" />
              <span className="relative z-10 hidden md:inline">{item.label}</span>
            </Link>
          )
        })}
        <div className="mx-1 h-6 w-px bg-border/30" role="separator" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-destructive"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Exit</span>
        </button>
      </div>
    </motion.nav>
  )
}
