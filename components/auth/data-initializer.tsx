"use client"

import { useEffect, useRef } from "react"
import { useAppStore } from "@/stores/app-store"
import { demoDocuments, demoAccessLogs } from "@/lib/seed-data"

export function DataInitializer() {
  const setDocuments = useAppStore((s) => s.setDocuments)
  const setAccessLogs = useAppStore((s) => s.setAccessLogs)
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      setDocuments(demoDocuments)
      setAccessLogs(demoAccessLogs)
      initialized.current = true
    }
  }, [setDocuments, setAccessLogs])

  return null
}
