"use client"

import { motion } from "framer-motion"
import { FileText, Video, ImageIcon, Clock, Shield, HardDrive } from "lucide-react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { useAppStore } from "@/stores/app-store"
import { getStorageStats } from "@/lib/seed-data"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function formatBytes(bytes: number) {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`
  return `${(bytes / 1_000).toFixed(0)} KB`
}

export default function DashboardPage() {
  const user = useAppStore((s) => s.user)
  const documents = useAppStore((s) => s.documents)
  const accessLogs = useAppStore((s) => s.accessLogs)
  const stats = getStorageStats()

  const recentLogs = accessLogs.slice(0, 4)

  return (
    <div className="h-full overflow-y-auto px-4 pt-8 md:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="mx-auto max-w-5xl"
      >
        {/* Greeting */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-xl text-foreground/90">
            {user?.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.role === "admin" ? "Full system access" : `${user?.role} access level`}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Documents", value: stats.docCount, icon: FileText },
            { label: "Videos", value: stats.videoCount, icon: Video },
            { label: "Images", value: stats.imageCount, icon: ImageIcon },
            { label: "Storage", value: formatBytes(stats.usedStorage), icon: HardDrive },
          ].map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <GlassPanel className="flex items-center gap-3 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/5">
                  <stat.icon className="h-4 w-4 text-primary/70" />
                </div>
                <div>
                  <p className="text-lg font-medium text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>

        {/* Two column layout */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Recent Documents */}
          <motion.div variants={itemVariants}>
            <GlassPanel className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-xs tracking-widest text-muted-foreground uppercase">
                <Clock className="h-3.5 w-3.5" />
                Recent Content
              </h2>
              <div className="flex flex-col gap-2">
                {documents.slice(0, 4).map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-primary/5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary">
                      {doc.type === "video" ? (
                        <Video className="h-3.5 w-3.5 text-primary" />
                      ) : doc.type === "image" ? (
                        <ImageIcon className="h-3.5 w-3.5 text-primary" />
                      ) : (
                        <FileText className="h-3.5 w-3.5 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatBytes(doc.size)}
                        {doc.expiresAt && ` · Expires ${new Date(doc.expiresAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>

          {/* Activity Stream */}
          <motion.div variants={itemVariants}>
            <GlassPanel className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-xs tracking-widest text-muted-foreground uppercase">
                <Shield className="h-3.5 w-3.5" />
                Access Stream
              </h2>
              <div className="flex flex-col gap-2">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                  >
                    <div
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        log.granted ? "bg-primary" : "bg-destructive"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-foreground">
                        {log.userName}{" "}
                        <span className="text-muted-foreground">{log.action}</span>{" "}
                        {log.documentTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                        {!log.granted && (
                          <span className="ml-2 text-destructive/70">denied</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        </div>

        {/* Storage Bar */}
        <motion.div variants={itemVariants} className="mt-4 mb-8">
          <GlassPanel className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs tracking-widest text-muted-foreground uppercase">
                Storage Utilization
              </span>
              <span className="text-xs text-muted-foreground">
                {formatBytes(stats.usedStorage)} / {formatBytes(stats.totalStorage)}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full rounded-full bg-primary/60"
                initial={{ width: 0 }}
                animate={{ width: `${stats.usagePercent}%` }}
                transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </GlassPanel>
        </motion.div>
      </motion.div>
    </div>
  )
}
