import { staffSummary, staff, staffSpeciality } from "$lib/types/zod-schemas-api"
import z from "zod/v4"

// Staff summary from the list
export type StaffSummary = z.infer<typeof staffSummary>

// Full staff details
export type Staff = z.infer<typeof staff>

// Staff speciality
export type StaffSpeciality = z.infer<typeof staffSpeciality>

// Gender options for staff
export type StaffGender = 'MALE' | 'FEMALE';

export const staffGenders: StaffGender[] = ['MALE', 'FEMALE'];

// Filter state that maps to backend query parameters
export interface StaffFiltersState {
    schoolCode: string;
    position: string;
    gender: StaffGender | '';
}
