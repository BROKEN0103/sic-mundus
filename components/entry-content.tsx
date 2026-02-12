"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export function EntryContent() {
  const [showText, setShowText] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 1500)
    const buttonTimer = setTimeout(() => setShowButton(true), 3500)
    return () => {
      clearTimeout(textTimer)
      clearTimeout(buttonTimer)
    }
  }, [])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <AnimatePresence>
          {showText && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="max-w-md text-center font-sans text-lg tracking-wide text-foreground/70"
            >
              {"Content doesn't need walls. It needs rules."}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/auth/login")}
              className="glass-panel glass-glow rounded-xl px-8 py-3 text-sm tracking-widest text-primary uppercase transition-colors hover:bg-primary/10"
            >
              Enter
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
