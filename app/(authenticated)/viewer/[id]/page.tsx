"use client"

import { use, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Download,
  FileText,
  Video,
  ImageIcon,
  Lock,
  Clock,
  Shield,
  Info,
} from "lucide-react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { useAppStore } from "@/stores/app-store"

function formatBytes(bytes: number) {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`
  return `${(bytes / 1_000).toFixed(0)} KB`
}

export default function ViewerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const user = useAppStore((s) => s.user)
  const documents = useAppStore((s) => s.documents)
  const addAccessLog = useAppStore((s) => s.addAccessLog)

  const doc = documents.find((d) => d.id === id)
  const hasAccess = user && doc?.accessRoles.includes(user.role)

  const logAccess = useCallback(() => {
    if (!user || !doc) return
    addAccessLog({
      id: `log-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      documentId: doc.id,
      documentTitle: doc.title,
      action: "view",
      timestamp: new Date().toISOString(),
      granted: !!hasAccess,
    })
  }, [user, doc, hasAccess, addAccessLog])

  useEffect(() => {
    logAccess()
  }, [logAccess])

  if (!doc) {
    return (
      <div className="flex h-full items-center justify-center">
        <GlassPanel className="p-8 text-center">
          <p className="text-sm text-muted-foreground">Document not found</p>
          <button
            onClick={() => router.push("/library")}
            className="mt-4 text-xs text-primary hover:underline"
          >
            Back to Library
          </button>
        </GlassPanel>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="flex h-full items-center justify-center px-4">
        <GlassPanel glow className="max-w-sm p-8 text-center">
          <Lock className="mx-auto mb-4 h-8 w-8 text-destructive/60" />
          <h2 className="mb-2 text-sm text-foreground">Access Denied</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Your role ({user?.role}) does not have permission to view this content.
          </p>
          <button
            onClick={() => router.push("/library")}
            className="rounded-lg bg-primary/10 px-4 py-2 text-xs text-primary transition-colors hover:bg-primary/15"
          >
            Back to Library
          </button>
        </GlassPanel>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto px-4 pt-8 md:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-4"
        >
          <button
            onClick={() => router.push("/library")}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-primary/5"
            aria-label="Back to library"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl text-foreground/90">{doc.title}</h1>
            <p className="text-sm text-muted-foreground">
              {formatBytes(doc.size)} &middot; {doc.mimeType}
            </p>
          </div>
          {doc.downloadAllowed && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/15"
              onClick={() => {
                addAccessLog({
                  id: `log-${Date.now()}`,
                  userId: user.id,
                  userName: user.name,
                  documentId: doc.id,
                  documentTitle: doc.title,
                  action: "download",
                  timestamp: new Date().toISOString(),
                  granted: true,
                })
              }}
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </motion.button>
          )}
        </motion.div>

        {/* Viewer Area */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassPanel glow className="mb-6 flex aspect-video items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
              {doc.type === "video" ? (
                <Video className="h-16 w-16" />
              ) : doc.type === "image" ? (
                <ImageIcon className="h-16 w-16" />
              ) : (
                <FileText className="h-16 w-16" />
              )}
              <p className="text-sm">
                {doc.type === "video"
                  ? "Video playback area"
                  : doc.type === "image"
                    ? "Image preview area"
                    : "Document preview area"}
              </p>
              <p className="text-xs text-muted-foreground/30">
                Watermarked &middot; DRM Protected
              </p>
            </div>
          </GlassPanel>
        </motion.div>

        {/* Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-24 grid gap-4 md:grid-cols-2"
        >
          <GlassPanel className="p-5">
            <h2 className="mb-3 flex items-center gap-2 text-xs tracking-widest text-muted-foreground uppercase">
              <Info className="h-3.5 w-3.5" />
              Details
            </h2>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type</span>
                <span className="capitalize text-foreground">{doc.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Size</span>
                <span className="text-foreground">{formatBytes(doc.size)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Uploaded</span>
                <span className="text-foreground">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </span>
              </div>
              {doc.expiresAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" /> Expires
                  </span>
                  <span className="text-foreground">
                    {new Date(doc.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {doc.metadata &&
                Object.entries(doc.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="capitalize text-muted-foreground">{key}</span>
                    <span className="text-foreground">{String(value)}</span>
                  </div>
                ))}
            </div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <h2 className="mb-3 flex items-center gap-2 text-xs tracking-widest text-muted-foreground uppercase">
              <Shield className="h-3.5 w-3.5" />
              Access Policy
            </h2>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Download</span>
                <span className={doc.downloadAllowed ? "text-primary" : "text-destructive/70"}>
                  {doc.downloadAllowed ? "Allowed" : "Restricted"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Roles</span>
                <div className="flex gap-1">
                  {doc.accessRoles.map((role) => (
                    <span
                      key={role}
                      className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">DRM</span>
                <span className="text-primary">Active</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Watermark</span>
                <span className="text-primary">Enabled</span>
              </div>
            </div>
          </GlassPanel>
        </motion.div>
      </div>
    </div>
  )
}
