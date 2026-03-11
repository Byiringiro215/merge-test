export type District = 'Kicukiro' | 'Nyamagabe' | 'Rubavu' | 'Ngororero' | 'Gasabo';

export type SchoolStatus = 'Active' | 'Inactive';

export interface School {
	id: number;
	name: string;
	district: District;
	status: SchoolStatus;
	faculties: number;
	students: number;
	successRate: number;
}

export interface DistributionData {
	district: District;
	active: number;
	inactive: number;
}

export interface EnrollmentData {
	district: District;
	students: number;
}

export const DISTRICTS: District[] = ['Kicukiro', 'Nyamagabe', 'Rubavu', 'Ngororero', 'Gasabo'];

export const CHART_COLORS = {
	active: '#3b82f6',      // blue
	inactive: '#ef4444',    // red/pink
	enrollment: '#22c55e',  // green
	activeHover: '#2563eb',
	inactiveHover: '#dc2626',
	enrollmentHover: '#16a34a',
};
