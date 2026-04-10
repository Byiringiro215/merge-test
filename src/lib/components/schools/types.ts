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
    active: '#205FAD', // blue
    inactive: '#DD3C57', // red/pink
    enrollment: '#67E491', // green
    activeHover: '#205fade8',
    inactiveHover: '#dc2626d3',
    enrollmentHover: '#67e491ee',
};
