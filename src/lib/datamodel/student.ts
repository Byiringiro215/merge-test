import type { student, studentSummary } from '$lib/types/api-schemas';
import type { Infer } from '@bajustone/fetcher/schema';

// Single student summary from the list
export type StudentSummary = Infer<typeof studentSummary>;

// Full student details
export type Student = Infer<typeof student>;

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
