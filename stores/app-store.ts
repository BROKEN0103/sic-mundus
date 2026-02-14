import { create } from "zustand"

export type UserRole = "viewer" | "editor" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  token?: string
}

export interface Document {
  id: string
  title: string
  type: "video" | "document" | "image"
  mimeType: string
  size: number
  uploadedAt: string
  expiresAt: string | null
  uploadedBy: string
  accessRoles: UserRole[]
  downloadAllowed: boolean
  extractedText?: string
  metadata?: Record<string, unknown>
}

export interface AccessLogEntry {
  id: string
  userId: string
  userName: string
  documentId: string
  documentTitle: string
  action: "view" | "download" | "upload" | "delete"
  timestamp: string
  ip?: string
  granted: boolean
}

interface AppState {
  user: User | null
  documents: Document[]
  accessLogs: AccessLogEntry[]
  isIdle: boolean
  setUser: (user: User | null) => void
  setDocuments: (docs: Document[]) => void
  addDocument: (doc: Document) => void
  removeDocument: (id: string) => void
  setAccessLogs: (logs: AccessLogEntry[]) => void
  addAccessLog: (log: AccessLogEntry) => void
  setIdle: (idle: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  documents: [],
  accessLogs: [],
  isIdle: false,
  setUser: (user) => set({ user }),
  setDocuments: (documents) => set({ documents }),
  addDocument: (doc) =>
    set((state) => ({ documents: [doc, ...state.documents] })),
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),
  setAccessLogs: (accessLogs) => set({ accessLogs }),
  addAccessLog: (log) =>
    set((state) => ({ accessLogs: [log, ...state.accessLogs] })),
  setIdle: (isIdle) => set({ isIdle }),
}))
