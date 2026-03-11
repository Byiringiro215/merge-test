export type District = 'Kicukiro' | 'Nyamagabe' | 'Rubavu' | 'Ngororero' | 'Gasabo';
export type Faculty = 'Software development' | 'Mechanics' | 'Automobile' | 'Tourism' | 'Electrical engineering' | 'Road construction';

export interface Teacher {
	id: number;
	name: string;
	avatar?: string;
	registeredSince: string;
	primaryFaculty: Faculty;
	assignedSchool: string;
	district: District;
	students: number;
	successRate: number;
}

export interface TeacherFiltersState {
	districts: District[];
	faculties: Faculty[];
	successThreshold: [number, number];
}

export interface HeatmapCell {
	faculty: Faculty;
	district: District;
	value: number; // 0-100 intensity
}

export interface DistrictSuccess {
	district: District;
	successRate: number;
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

// Heatmap color scale - light blue to dark blue
export const HEATMAP_COLORS = {
	low: '#dbeafe',    // blue-100
	medium: '#60a5fa', // blue-400
	high: '#1d4ed8'    // blue-700
};
