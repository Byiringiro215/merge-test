export interface SchoolRecord {
    id: number;
    name: string;
    district: string;
    trade: string;
    tradeColor: string;
    activeStudents: number;
    successRate: number;
    status: 'High' | 'Stable' | 'Action Required';
}
