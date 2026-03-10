export type District = 'Kicukiro' | 'Nyamagabe' | 'Rubavu' | 'Ngororero' | 'Gasabo';

export type Faculty =
	| 'Software development'
	| 'Mechanics'
	| 'Automobile'
	| 'Tourism'
	| 'Electrical engineering'
	| 'Road construction';

export type Level = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export type StudentStatus = 'Succeeded' | 'Failed';

export interface Student {
	id: number;
	name: string;
	district: District;
	faculty: Faculty;
	level: Level;
	score: number;
	status: StudentStatus;
}

export interface StudentFiltersState {
	districts: District[];
	faculties: Faculty[];
	levelRange: number;
	schoolType: 'all' | 'highSchool';
}

export interface ScoreDistribution {
	range: string;
	count: number;
}

export interface FacultyEnrollment {
	faculty: Faculty;
	count: number;
	color: string;
}

export const DISTRICTS: District[] = ['Kicukiro', 'Nyamagabe', 'Rubavu', 'Ngororero', 'Gasabo'];

export const FACULTIES: Faculty[] = [
	'Software development',
	'Mechanics',
	'Automobile',
	'Tourism',
	'Electrical engineering',
	'Road construction'
];

export const LEVELS: Level[] = ['L1', 'L2', 'L3', 'L4', 'L5'];

export const FACULTY_COLORS: Record<Faculty, string> = {
	'Software development': '#3b82f6',
	'Mechanics': '#10b981',
	'Automobile': '#f59e0b',
	'Tourism': '#a855f7',
	'Electrical engineering': '#06b6d4',
	'Road construction': '#ef4444'
};
