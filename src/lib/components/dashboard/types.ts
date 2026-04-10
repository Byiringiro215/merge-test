export interface SchoolRecord {
    id: number;
    name: string;
    district: string;
    faculty: string;
    facultyColor: string;
    activeStudents: number;
    successRate: number;
    status: 'High' | 'Stable' | 'Action Required';
}
