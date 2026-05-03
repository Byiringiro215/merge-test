export type StatusType = 'Pending' | 'Approved' | 'Rejected' | 'Active' | 'Deactivated' | 'Completed' | 'Cancelled' | 'Expired' | 'Expiring Soon';

export interface Application {
    id: string;
    applicant: { name: string; email: string; avatar: string };
    institution: { name: string; website: string; logo: string };
    trade: { name: string; category: string };
    status: StatusType;
    stage: string;
    submittedOn: string;
    location?: string;
}

export const mockApplications: Application[] = [
    {
        id: '1',
        applicant: { name: 'Jane Smith', email: 'janesmith@example.com', avatar: 'JS' },
        institution: { name: 'Command+R', website: 'cmdr.ai', logo: 'CR' },
        trade: { name: 'JavaScript', category: 'SPE' },
        status: 'Pending',
        stage: 'Initial Review',
        submittedOn: '19/12/2025 2:00 PM',
        location: 'US',
    },
    {
        id: '2',
        applicant: { name: 'Jane Smith', email: 'janesmith@example.com', avatar: 'JS' },
        institution: { name: 'Command+R', website: 'cmdr.ai', logo: 'CR' },
        trade: { name: 'JavaScript', category: 'SPE' },
        status: 'Pending',
        stage: 'Due Diligence Scheduled',
        submittedOn: '19/12/2025 2:00 PM',
        location: 'AU',
    },
    {
        id: '3',
        applicant: { name: 'Jane Smith', email: 'janesmith@example.com', avatar: 'JS' },
        institution: { name: 'Command+R', website: 'cmdr.ai', logo: 'CR' },
        trade: { name: 'JavaScript', category: 'SPE' },
        status: 'Rejected',
        stage: 'Rejected',
        submittedOn: '19/12/2025 2:00 PM',
        location: 'UK',
    },
    {
        id: '4',
        applicant: { name: 'Jane Smith', email: 'janesmith@example.com', avatar: 'JS' },
        institution: { name: 'Command+R', website: 'cmdr.ai', logo: 'CR' },
        trade: { name: 'JavaScript', category: 'SPE' },
        status: 'Pending',
        stage: 'Final Review',
        submittedOn: '19/12/2025 2:00 PM',
        location: 'US',
    },
    {
        id: '5',
        applicant: { name: 'Jane Smith', email: 'janesmith@example.com', avatar: 'JS' },
        institution: { name: 'Command+R', website: 'cmdr.ai', logo: 'CR' },
        trade: { name: 'JavaScript', category: 'SPE' },
        status: 'Approved',
        stage: 'Certified',
        submittedOn: '19/12/2025 2:00 PM',
        location: 'AU',
    },
];
