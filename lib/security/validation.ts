import { z } from 'zod'

export const customerNameField = z.string().trim().min(1).max(120)
export const phoneField = z.string().trim().min(1).max(30)
export const emailField = z.string().trim().email().max(254).optional().or(z.literal(''))
export const addressField = z.string().trim().min(1).max(500)
export const notesField = z.string().trim().max(2000).optional()
export const subjectField = z.string().trim().min(1).max(200)
export const messageField = z.string().trim().min(1).max(5000)
export const shortTextField = z.string().trim().max(500).optional()
