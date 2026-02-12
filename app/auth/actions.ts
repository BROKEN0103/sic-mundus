"use server"

import { cookies } from "next/headers"
import {
  createJWT,
  verifyJWT,
  hashPassword,
  verifyPassword,
  getCookieName,
  getCookieOptions,
  type SessionPayload,
} from "@/lib/auth"
import { findUserByEmail, createUser } from "@/lib/user-store"

export interface AuthResult {
  success: boolean
  error?: string
  redirect?: string
}

export async function loginAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  console.log(`[v0] loginAction: email=${email}, passwordLen=${password?.length}`)

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  const user = await findUserByEmail(email)
  console.log(`[v0] loginAction: userFound=${!!user}`)
  if (!user) {
    return { success: false, error: "Invalid credentials" }
  }

  const valid = await verifyPassword(password, user.passwordHash)
  console.log(`[v0] loginAction: passwordValid=${valid}`)
  if (!valid) {
    return { success: false, error: "Invalid credentials" }
  }

  const token = await createJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  console.log(`[v0] loginAction: tokenCreated, length=${token.length}`)

  const cookieStore = await cookies()
  cookieStore.set(getCookieName(), token, getCookieOptions())

  console.log(`[v0] loginAction: cookie set, returning success`)
  return { success: true, redirect: "/dashboard" }
}

export async function signupAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get("email") as string
  const name = formData.get("name") as string
  const password = formData.get("password") as string

  if (!email || !name || !password) {
    return { success: false, error: "All fields are required" }
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" }
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      success: false,
      error: "Password must contain uppercase, lowercase, and a number",
    }
  }

  const existing = await findUserByEmail(email)
  if (existing) {
    return { success: false, error: "An account with this email already exists" }
  }

  const passwordHash = await hashPassword(password)
  const user = await createUser(email, name, passwordHash)

  const token = await createJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })

  const cookieStore = await cookies()
  cookieStore.set(getCookieName(), token, getCookieOptions())

  return { success: true, redirect: "/dashboard" }
}

export async function logoutAction(): Promise<AuthResult> {
  const cookieStore = await cookies()
  cookieStore.delete(getCookieName())
  return { success: true, redirect: "/auth/login" }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(getCookieName())?.value
  if (!token) return null
  return verifyJWT(token)
}
