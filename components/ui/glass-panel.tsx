"use client"

import { forwardRef, type HTMLAttributes } from "react"
import { motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlassPanelProps extends HTMLMotionProps<"div"> {
  variant?: "default" | "strong" | "subtle"
  glow?: boolean
}

const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  ({ className, variant = "default", glow = false, children, ...props }, ref) => {
    const variantClasses = {
      default: "glass-panel",
      strong: "glass-panel-strong",
      subtle: "bg-background/30 backdrop-blur-md border border-border/20",
    }

    return (
      <motion.div
        ref={ref}
        className={cn(
          variantClasses[variant],
          glow && "glass-glow",
          "rounded-lg",
          className
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)
GlassPanel.displayName = "GlassPanel"

export { GlassPanel }
