"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Shield,
  FileText,
  Video,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  Download,
  Clock,
  Lock,
  Check,
} from "lucide-react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { useAppStore, type Document, type UserRole } from "@/stores/app-store"

function formatBytes(bytes: number) {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`
  return `${(bytes / 1_000).toFixed(0)} KB`
}

function AccessRow({ doc }: { doc: Document }) {
  const [expanded, setExpanded] = useState(false)
  const user = useAppStore((s) => s.user)
  const documents = useAppStore((s) => s.documents)
  const setDocuments = useAppStore((s) => s.setDocuments)

  const isAdminOrEditor = user?.role === "admin" || user?.role === "editor"

  const toggleRole = useCallback(
    (role: UserRole) => {
      if (!isAdminOrEditor) return
      const updated = documents.map((d) => {
        if (d.id !== doc.id) return d
        const roles = d.accessRoles.includes(role)
          ? d.accessRoles.filter((r) => r !== role)
          : [...d.accessRoles, role]
        return { ...d, accessRoles: roles }
      })
      setDocuments(updated)
    },
    [doc.id, documents, setDocuments, isAdminOrEditor]
  )

  const toggleDownload = useCallback(() => {
    if (!isAdminOrEditor) return
    const updated = documents.map((d) =>
      d.id === doc.id ? { ...d, downloadAllowed: !d.downloadAllowed } : d
    )
    setDocuments(updated)
  }, [doc.id, documents, setDocuments, isAdminOrEditor])

  return (
    <div className="border-b border-border/10 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-primary/3"
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
          <p className="text-xs text-muted-foreground">{formatBytes(doc.size)}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {doc.accessRoles.map((role) => (
            <span
              key={role}
              className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary"
            >
              {role}
            </span>
          ))}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/10 bg-background/20 px-5 py-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                {/* Role Access */}
                <div className="flex-1">
                  <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" /> Role Access
                  </p>
                  <div className="flex gap-2">
                    {(["admin", "editor", "viewer"] as UserRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => toggleRole(role)}
                        disabled={!isAdminOrEditor}
                        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                          doc.accessRoles.includes(role)
                            ? "bg-primary/15 text-primary"
                            : "bg-secondary text-muted-foreground"
                        } ${!isAdminOrEditor ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        {doc.accessRoles.includes(role) && <Check className="h-3 w-3" />}
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Settings */}
                <div className="flex gap-4">
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Download className="h-3 w-3" /> Downloads
                    </p>
                    <button
                      onClick={toggleDownload}
                      disabled={!isAdminOrEditor}
                      className={`rounded-lg px-3 py-1.5 text-xs transition-colors ${
                        doc.downloadAllowed
                          ? "bg-primary/15 text-primary"
                          : "bg-destructive/10 text-destructive/70"
                      } ${!isAdminOrEditor ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      {doc.downloadAllowed ? "Allowed" : "Restricted"}
                    </button>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" /> Expiry
                    </p>
                    <span className="text-xs text-foreground">
                      {doc.expiresAt
                        ? new Date(doc.expiresAt).toLocaleDateString()
                        : "No expiry"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AccessControlPage() {
  const documents = useAppStore((s) => s.documents)
  const user = useAppStore((s) => s.user)

  const isAdminOrEditor = user?.role === "admin" || user?.role === "editor"

  return (
    <div className="h-full overflow-y-auto px-4 pt-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="flex items-center gap-2 text-xl text-foreground/90">
            <Lock className="h-5 w-5 text-primary/60" />
            Access Control
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdminOrEditor
              ? "Manage content permissions and access policies"
              : "View content access policies (read-only)"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-24"
        >
          <GlassPanel className="overflow-hidden">
            {documents.map((doc) => (
              <AccessRow key={doc.id} doc={doc} />
            ))}
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  )
}
