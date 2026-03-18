import { studentSummary, student } from "$lib/types/zod-schemas-api"
import z from "zod/v4"

// Single student summary from the list
export type StudentSummary = z.infer<typeof studentSummary>

// Full student details
export type Student = z.infer<typeof student>
