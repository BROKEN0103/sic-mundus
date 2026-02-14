"use server"

import { cookies } from "next/headers"
import { getCookieName } from "@/lib/auth"
import type { Document, AccessLogEntry } from "@/stores/app-store"

export async function fetchDashboardData() {
    const cookieStore = await cookies()
    const token = cookieStore.get(getCookieName())?.value

    if (!token) return { documents: [], accessLogs: [] }

    const headers = { Authorization: `Bearer ${token}` }

    try {
        const [docsRes, logsRes] = await Promise.all([
            fetch("http://localhost:5000/api/models", { headers, cache: "no-store" }),
            fetch("http://localhost:5000/api/users/activities", { headers, cache: "no-store" })
        ])

        // Check if responses are ok
        if (!docsRes.ok || !logsRes.ok) {
            console.error("Failed to fetch dashboard data")
            return { documents: [], accessLogs: [] }
        }

        const docsData = await docsRes.json()
        const logsData = await logsRes.json()

        // Map Backend Model3D to Frontend Document
        const documents: Document[] = docsData.map((d: any) => ({
            id: d._id,
            title: d.title,
            type: "document", // infer from extension? For now default to document
            mimeType: "application/octet-stream", // simplify
            size: 0, // backend doesn't store size yet?
            uploadedAt: d.createdAt,
            expiresAt: null,
            uploadedBy: d.uploadedBy?.name || "Unknown",
            accessRoles: ["viewer", "editor", "admin"],
            downloadAllowed: true,
            metadata: { fileUrl: `http://localhost:5000/${d.fileUrl.replace(/\\/g, "/")}` } // normalize windows paths
        }))

        // Map Backend Activity to Frontend AccessLogEntry
        const accessLogs: AccessLogEntry[] = logsData.map((l: any) => ({
            id: l._id,
            userId: l.user?._id || "unknown",
            userName: l.user?.name || "Unknown User",
            documentId: l.document?._id || "",
            documentTitle: l.document?.title || l.details || "Unknown Document",
            action: l.action.toLowerCase(),
            timestamp: l.createdAt,
            granted: l.granted !== false, // default true
        }))

        return { documents, accessLogs }
    } catch (err) {
        console.error("Error in fetchDashboardData:", err)
        return { documents: [], accessLogs: [] }
    }
}
