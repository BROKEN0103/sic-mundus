"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  FileText,
  Video,
  ImageIcon,
  Search,
  Filter,
  Download,
  Lock,
  Clock,
  Grid3X3,
  List,
} from "lucide-react"
import { GlassPanel } from "@/components/ui/glass-panel"
import { useAppStore, type Document } from "@/stores/app-store"

type ViewMode = "grid" | "list"
type TypeFilter = "all" | "video" | "document" | "image"

function formatBytes(bytes: number) {
  if (bytes >= 1_000_000_000) return `${(bytes / 1_000_000_000).toFixed(1)} GB`
  if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(0)} MB`
  return `${(bytes / 1_000).toFixed(0)} KB`
}

function DocumentCard({ doc }: { doc: Document }) {
  const user = useAppStore((s) => s.user)
  const hasAccess = user && doc.accessRoles.includes(user.role)

  return (
    <Link href={hasAccess ? `/viewer/${doc.id}` : "#"}>
      <GlassPanel
        className={`group relative p-4 transition-all ${hasAccess ? "cursor-pointer hover:border-primary/20" : "cursor-not-allowed opacity-60"}`}
      >
        <div className="mb-3 flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
            {doc.type === "video" ? (
              <Video className="h-4 w-4 text-primary" />
            ) : doc.type === "image" ? (
              <ImageIcon className="h-4 w-4 text-primary" />
            ) : (
              <FileText className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {doc.downloadAllowed && hasAccess && (
              <Download className="h-3.5 w-3.5 text-muted-foreground/50" />
            )}
            {!hasAccess && <Lock className="h-3.5 w-3.5 text-destructive/60" />}
          </div>
        </div>
        <h3 className="mb-1 truncate text-sm text-foreground">{doc.title}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatBytes(doc.size)}</span>
          <span className="text-border">{"/"}</span>
          <span className="capitalize">{doc.type}</span>
        </div>
        {doc.expiresAt && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground/60">
            <Clock className="h-3 w-3" />
            <span>Exp {new Date(doc.expiresAt).toLocaleDateString()}</span>
          </div>
        )}
        <div className="mt-2 flex gap-1">
          {doc.accessRoles.map((role) => (
            <span
              key={role}
              className="rounded bg-primary/5 px-1.5 py-0.5 text-[10px] text-primary/60"
            >
              {role}
            </span>
          ))}
        </div>
      </GlassPanel>
    </Link>
  )
}

function DocumentRow({ doc }: { doc: Document }) {
  const user = useAppStore((s) => s.user)
  const hasAccess = user && doc.accessRoles.includes(user.role)

  return (
    <Link href={hasAccess ? `/viewer/${doc.id}` : "#"}>
      <div
        className={`flex items-center gap-4 rounded-lg px-4 py-3 transition-colors ${hasAccess ? "cursor-pointer hover:bg-primary/5" : "cursor-not-allowed opacity-60"}`}
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
        </div>
        <span className="text-xs text-muted-foreground">{formatBytes(doc.size)}</span>
        <span className="hidden text-xs capitalize text-muted-foreground sm:inline">
          {doc.type}
        </span>
        <div className="flex items-center gap-1">
          {!hasAccess && <Lock className="h-3.5 w-3.5 text-destructive/60" />}
        </div>
      </div>
    </Link>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function LibraryPage() {
  const documents = useAppStore((s) => s.documents)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase())
      const matchesType = typeFilter === "all" || doc.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [documents, search, typeFilter])

  return (
    <div className="h-full overflow-y-auto px-4 pt-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-xl text-foreground/90">Content Library</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {documents.length} items &middot; Access filtered by your role
          </p>
        </motion.div>

        {/* Controls */}
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
              placeholder="Search content..."
              className="w-full rounded-lg border border-border/50 bg-background/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/20"
              aria-label="Search documents"
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-border/30 p-0.5">
              {(["all", "document", "video", "image"] as TypeFilter[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                    typeFilter === t
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t === "all" ? (
                    <span className="flex items-center gap-1">
                      <Filter className="h-3 w-3" /> All
                    </span>
                  ) : (
                    <span className="capitalize">{t}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center rounded-lg border border-border/30 p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-md p-1.5 transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md p-1.5 transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                aria-label="List view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="mb-24 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((doc) => (
                <motion.div key={doc.id} variants={itemVariants}>
                  <DocumentCard doc={doc} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="mb-24"
            >
              <GlassPanel className="divide-y divide-border/20 overflow-hidden">
                {filtered.map((doc) => (
                  <motion.div key={doc.id} variants={itemVariants}>
                    <DocumentRow doc={doc} />
                  </motion.div>
                ))}
              </GlassPanel>
            </motion.div>
          )}
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Search className="mb-3 h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No content found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
