"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Activity,
  Eye,
  Download,
  Upload,
  Trash2,
  Shield,
  Search,
  XCircle,
  CheckCircle2,
} from "lucide-react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { useAppStore, type AccessLogEntry } from "@/stores/app-store"

type ActionFilter = "all" | "view" | "download" | "upload" | "delete"

const actionIcons = {
  view: Eye,
  download: Download,
  upload: Upload,
  delete: Trash2,
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -8 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

export default function ActivityPage() {
  const accessLogs = useAppStore((s) => s.accessLogs)
  const user = useAppStore((s) => s.user)
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState<ActionFilter>("all")

  const isAdmin = user?.role === "admin"

  const filtered = useMemo(() => {
    let logs = accessLogs
    if (!isAdmin) {
      logs = logs.filter((l) => l.userId === user?.id)
    }
    return logs.filter((log) => {
      const matchesSearch =
        log.documentTitle.toLowerCase().includes(search.toLowerCase()) ||
        log.userName.toLowerCase().includes(search.toLowerCase())
      const matchesAction = actionFilter === "all" || log.action === actionFilter
      return matchesSearch && matchesAction
    })
  }, [accessLogs, search, actionFilter, isAdmin, user])

  return (
    <div className="h-full overflow-y-auto px-4 pt-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="flex items-center gap-2 text-xl text-foreground/90">
            <Activity className="h-5 w-5 text-primary/60" />
            Activity Log
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin ? "Full system audit trail" : "Your activity history"}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activity..."
              className="w-full rounded-lg border border-border/50 bg-background/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20"
              aria-label="Search activity logs"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border/30 p-0.5">
            {(["all", "view", "download", "upload", "delete"] as ActionFilter[]).map((action) => (
              <button
                key={action}
                onClick={() => setActionFilter(action)}
                className={`rounded-md px-2.5 py-1.5 text-xs capitalize transition-colors ${
                  actionFilter === action
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Log Entries */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mb-24"
        >
          <GlassPanel className="overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-16">
                <Shield className="mb-3 h-8 w-8 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">No activity found</p>
              </div>
            ) : (
              <div className="divide-y divide-border/20">
                {filtered.map((log) => {
                  const Icon = actionIcons[log.action] || Eye
                  return (
                    <motion.div
                      key={log.id}
                      variants={itemVariants}
                      className="flex items-center gap-4 px-5 py-4"
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          log.granted ? "bg-primary/5" : "bg-destructive/5"
                        }`}
                      >
                        <Icon
                          className={`h-3.5 w-3.5 ${log.granted ? "text-primary/70" : "text-destructive/70"}`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-foreground">
                          <span className="text-foreground/80">{log.userName}</span>{" "}
                          <span className="text-muted-foreground">{log.action}</span>{" "}
                          <span className="text-foreground/80">{log.documentTitle}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {log.granted ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary/40" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 text-destructive/40" />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  )
}
