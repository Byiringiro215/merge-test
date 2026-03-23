import { studentSummary, student } from "$lib/types/zod-schemas-api"
import z from "zod/v4"

// Single student summary from the list
export type StudentSummary = z.infer<typeof studentSummary>

// Full student details
export type Student = z.infer<typeof student>

// Gender options 
export type Gender = 'MALE' | 'FEMALE';

// Status options
export type SDMSStudentStatus = 'NEW' | 'CONTINUING';

export const genders: Gender[] = ['MALE', 'FEMALE'];
export const sdmsStatuses: SDMSStudentStatus[] = ['NEW', 'CONTINUING'];

// Filter state that maps to backend query parameters
export interface StudentFiltersState {
    schoolCode: string;
    classGroup: string;
    gender: Gender | '';
    status: SDMSStudentStatus | '';
}
