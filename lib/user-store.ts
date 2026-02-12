// Server-side in-memory user store.
// In production, replace with a real database (Neon, Supabase, etc.)

import type { UserRole } from "@/stores/app-store"
import { hashPassword } from "@/lib/auth"

export interface StoredUser {
  id: string
  email: string
  name: string
  role: UserRole
  passwordHash: string
}

// Module-level store that persists across requests in the same process
const users: Map<string, StoredUser> = new Map()
let seeded = false

async function seedDemoUsers() {
  if (seeded) return
  seeded = true

  const demoAccounts: { id: string; email: string; name: string; role: UserRole; password: string }[] = [
    { id: "u1", email: "admin@vault.io", name: "System Admin", role: "admin", password: "demo" },
    { id: "u2", email: "editor@vault.io", name: "Content Editor", role: "editor", password: "demo" },
    { id: "u3", email: "viewer@vault.io", name: "External Viewer", role: "viewer", password: "demo" },
  ]

  for (const account of demoAccounts) {
    const passwordHash = await hashPassword(account.password)
    users.set(account.email, {
      id: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
      passwordHash,
    })
  }
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  await seedDemoUsers()
  return users.get(email) ?? null
}

export async function createUser(
  email: string,
  name: string,
  passwordHash: string,
  role: UserRole = "viewer"
): Promise<StoredUser> {
  await seedDemoUsers()

  if (users.has(email)) {
    throw new Error("A user with this email already exists")
  }

  const id = `u${Date.now()}`
  const newUser: StoredUser = { id, email, name, role, passwordHash }
  users.set(email, newUser)
  return newUser
}

export async function getAllUsers(): Promise<StoredUser[]> {
  await seedDemoUsers()
  return Array.from(users.values())
}
