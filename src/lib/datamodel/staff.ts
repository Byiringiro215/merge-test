import type { staff, staffSpeciality, staffSummary } from '$lib/types/api-schemas';
import type { Infer } from '@bajustone/fetcher/schema';

// Staff summary from the list
export type StaffSummary = Infer<typeof staffSummary>;

// Full staff details
export type Staff = Infer<typeof staff>;

// Staff speciality
export type StaffSpeciality = Infer<typeof staffSpeciality>;

// Gender options for staff
export type StaffGender = 'MALE' | 'FEMALE';

export const staffGenders: StaffGender[] = ['MALE', 'FEMALE'];

// Filter state that maps to backend query parameters
export interface StaffFiltersState {
    schoolCode: string;
    position: string;
    gender: StaffGender | '';
}
