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
    // Super Admin / Merged View (All applications)
    {
        id: 'SA-001',
        applicant: { name: 'Alice Johnson', email: 'alice.j@university.edu', avatar: 'AJ' },
        institution: { name: 'Kigali Institute of Tech', website: 'kit.ac.rw', logo: 'KI' },
        trade: { name: 'Software Engineering', category: 'ICT' },
        status: 'Pending',
        stage: 'Initial Review',
        submittedOn: '01/05/2026 10:30 AM',
        location: 'Kigali',
    },
    {
        id: 'SA-002',
        applicant: { name: 'Bob Smith', email: 'bob.s@polytechnic.rw', avatar: 'BS' },
        institution: { name: 'Rwanda Polytechnic', website: 'rp.ac.rw', logo: 'RP' },
        trade: { name: 'Civil Engineering', category: 'Construction' },
        status: 'Active',
        stage: 'Due Diligence',
        submittedOn: '28/04/2026 09:15 AM',
        location: 'Musanze',
    },
    {
        id: 'SA-003',
        applicant: { name: 'Charlie Davis', email: 'charlie@tvet.rw', avatar: 'CD' },
        institution: { name: 'National TVET School', website: 'ntvet.rw', logo: 'NT' },
        trade: { name: 'Automotive Mechanics', category: 'Mechanical' },
        status: 'Approved',
        stage: 'Final Report',
        submittedOn: '25/04/2026 02:45 PM',
        location: 'Huye',
    },
    {
        id: 'SA-004',
        applicant: { name: 'Diana Prince', email: 'diana@hospitality.rw', avatar: 'DP' },
        institution: { name: 'Elite Culinary Arts', website: 'elite.rw', logo: 'EC' },
        trade: { name: 'Culinary Arts', category: 'Hospitality' },
        status: 'Rejected',
        stage: 'Criteria Check',
        submittedOn: '20/04/2026 11:00 AM',
        location: 'Rubavu',
    },
    {
        id: 'SA-005',
        applicant: { name: 'Edward Norton', email: 'edward@mining.rw', avatar: 'EN' },
        institution: { name: 'Rwanda Mining School', website: 'rms.rw', logo: 'RM' },
        trade: { name: 'Mining Engineering', category: 'Industrial' },
        status: 'Pending',
        stage: 'Assigned to Evaluator',
        submittedOn: '03/05/2026 08:00 AM',
        location: 'Kayonza',
    },

    // Evaluator Specific (Assigned to them)
    {
        id: 'EV-001',
        applicant: { name: 'Jean Paul', email: 'jp@tvet.rw', avatar: 'JP' },
        institution: { name: 'Rubavu Vocational', website: 'rubavu.vct', logo: 'RV' },
        trade: { name: 'Masonry', category: 'Construction' },
        status: 'Pending',
        stage: 'Self-Assessment Review',
        submittedOn: '02/05/2026 01:20 PM',
        location: 'Rubavu',
    },
    {
        id: 'EV-002',
        applicant: { name: 'Marie Claire', email: 'marie@elec.rw', avatar: 'MC' },
        institution: { name: 'Power Tech Rwanda', website: 'powertech.rw', logo: 'PT' },
        trade: { name: 'Electrical Wiring', category: 'Energy' },
        status: 'Active',
        stage: 'Site Visit Scheduled',
        submittedOn: '29/04/2026 10:00 AM',
        location: 'Kigali',
    },
    {
        id: 'EV-003',
        applicant: { name: 'David Rukundo', email: 'david@agri.rw', avatar: 'DR' },
        institution: { name: 'Modern Farming Inst.', website: 'farm.rw', logo: 'MF' },
        trade: { name: 'Agribusiness', category: 'Agriculture' },
        status: 'Pending',
        stage: 'Resource Verification',
        submittedOn: '30/04/2026 03:40 PM',
        location: 'Eastern Province',
    },
    {
        id: 'EV-004',
        applicant: { name: 'Sifa Umutoni', email: 'sifa@tailoring.rw', avatar: 'SU' },
        institution: { name: 'Fashion Design Rwanda', website: 'fdr.rw', logo: 'FD' },
        trade: { name: 'Tailoring & Design', category: 'Textile' },
        status: 'Approved',
        stage: 'Report Submitted',
        submittedOn: '15/04/2026 09:00 AM',
        location: 'Kigali',
    },
    {
        id: 'EV-005',
        applicant: { name: 'Gaston Gasana', email: 'gaston@it.rw', avatar: 'GG' },
        institution: { name: 'IT Solutions Academy', website: 'its.rw', logo: 'IT' },
        trade: { name: 'Network Security', category: 'ICT' },
        status: 'Pending',
        stage: 'Criteria Review',
        submittedOn: '04/05/2026 11:30 AM',
        location: 'Kigali',
    },

    // Supervisor Specific (Oversight)
    {
        id: 'SV-001',
        applicant: { name: 'Patrick Tuyisenge', email: 'pat@hotel.rw', avatar: 'PT' },
        institution: { name: 'Hotel Management Rwanda', website: 'hmr.rw', logo: 'HM' },
        trade: { name: 'Hotel Operations', category: 'Hospitality' },
        status: 'Active',
        stage: 'Evaluator Assignment',
        submittedOn: '01/05/2026 02:00 PM',
        location: 'Kigali',
    },
    {
        id: 'SV-002',
        applicant: { name: 'Divine Ishimwe', email: 'divine@health.rw', avatar: 'DI' },
        institution: { name: 'Nursing Excellence Inst', website: 'nei.rw', logo: 'NE' },
        trade: { name: 'Nursing Assistant', category: 'Health' },
        status: 'Pending',
        stage: 'Awaiting Report',
        submittedOn: '27/04/2026 08:30 AM',
        location: 'Musanze',
    },
    {
        id: 'SV-003',
        applicant: { name: 'Eric Munyaneza', email: 'eric@carpentry.rw', avatar: 'EM' },
        institution: { name: 'Woodwork Masterclass', website: 'wood.rw', logo: 'WM' },
        trade: { name: 'Carpentry', category: 'Craft' },
        status: 'Active',
        stage: 'Reviewing Report',
        submittedOn: '22/04/2026 04:15 PM',
        location: 'Southern Province',
    },
    {
        id: 'SV-004',
        applicant: { name: 'Angele Uwase', email: 'angele@beauty.rw', avatar: 'AU' },
        institution: { name: 'Cosmetology Rwanda', website: 'cr.rw', logo: 'CO' },
        trade: { name: 'Cosmetology', category: 'Service' },
        status: 'Rejected',
        stage: 'Audit Failed',
        submittedOn: '10/04/2026 12:00 PM',
        location: 'Kigali',
    },
    {
        id: 'SV-005',
        applicant: { name: 'Fabrice Nkurunziza', email: 'fab@plumbing.rw', avatar: 'FN' },
        institution: { name: 'Advanced Plumbing School', website: 'aps.rw', logo: 'AP' },
        trade: { name: 'Plumbing', category: 'Construction' },
        status: 'Active',
        stage: 'Due Diligence Phase',
        submittedOn: '03/05/2026 09:45 AM',
        location: 'Western Province',
    },

    // Applicant Specific (My own applications)
    {
        id: 'APP-001',
        applicant: { name: 'Jane Smith', email: 'janesmith@example.com', avatar: 'JS' },
        institution: { name: 'Jane Technical Center', website: 'jtc.rw', logo: 'JT' },
        trade: { name: 'JavaScript Engineering', category: 'ICT' },
        status: 'Pending',
        stage: 'Documents Verification',
        submittedOn: '19/12/2025 02:00 PM',
        location: 'Kigali',
    },
    {
        id: 'APP-002',
        applicant: { name: 'Jane Smith', email: 'janesmith@example.com', avatar: 'JS' },
        institution: { name: 'Jane Technical Center', website: 'jtc.rw', logo: 'JT' },
        trade: { name: 'React Development', category: 'ICT' },
        status: 'Active',
        stage: 'Site Visit Scheduled',
        submittedOn: '20/12/2025 10:00 AM',
        location: 'Kigali',
    },
    {
        id: 'APP-003',
        applicant: { name: 'Jane Smith', email: 'janesmith@example.com', avatar: 'JS' },
        institution: { name: 'Jane Technical Center', website: 'jtc.rw', logo: 'JT' },
        trade: { name: 'UI/UX Design', category: 'Design' },
        status: 'Approved',
        stage: 'Certified',
        submittedOn: '15/11/2025 09:30 AM',
        location: 'Kigali',
    },
    {
        id: 'APP-004',
        applicant: { name: 'Jane Smith', email: 'janesmith@example.com', avatar: 'JS' },
        institution: { name: 'Jane Technical Center', website: 'jtc.rw', logo: 'JT' },
        trade: { name: 'Mobile App Development', category: 'ICT' },
        status: 'Rejected',
        stage: 'Technical Check Failed',
        submittedOn: '01/12/2025 04:00 PM',
        location: 'Kigali',
    },
    {
        id: 'APP-005',
        applicant: { name: 'Jane Smith', email: 'janesmith@example.com', avatar: 'JS' },
        institution: { name: 'Jane Technical Center', website: 'jtc.rw', logo: 'JT' },
        trade: { name: 'Database Management', category: 'ICT' },
        status: 'Pending',
        stage: 'Initial Review',
        submittedOn: '05/01/2026 11:00 AM',
        location: 'Kigali',
    },
    // Curriculum Evaluator Specific
    {
        id: 'CE-001',
        applicant: { name: 'Peter Parker', email: 'peter@trades.rw', avatar: 'PP' },
        institution: { name: 'Spider Tech', website: 'spider.rw', logo: 'ST' },
        trade: { name: 'Mechanical Engineering', category: 'ICT' },
        status: 'Pending',
        stage: 'Curriculum Review',
        submittedOn: '02/05/2026 10:00 AM',
        location: 'Kigali',
    },
    {
        id: 'CE-002',
        applicant: { name: 'Gwen Stacy', email: 'gwen@design.rw', avatar: 'GS' },
        institution: { name: 'Stacy Arts', website: 'stacy.rw', logo: 'SA' },
        trade: { name: 'Graphic Design', category: 'Design' },
        status: 'Active',
        stage: 'Awaiting Evidence',
        submittedOn: '29/04/2026 11:30 AM',
        location: 'Kigali',
    },
    {
        id: 'CE-003',
        applicant: { name: 'Miles Morales', email: 'miles@it.rw', avatar: 'MM' },
        institution: { name: 'Brooklyn Visions', website: 'bvisions.rw', logo: 'BV' },
        trade: { name: 'Cybersecurity', category: 'ICT' },
        status: 'Pending',
        stage: 'Standards Check',
        submittedOn: '01/05/2026 09:00 AM',
        location: 'Kigali',
    },
    {
        id: 'CE-004',
        applicant: { name: 'Mary Jane', email: 'mj@hospitality.rw', avatar: 'MJ' },
        institution: { name: 'MJ Culinary', website: 'mjc.rw', logo: 'MC' },
        trade: { name: 'Baking & Pastry', category: 'Hospitality' },
        status: 'Approved',
        stage: 'Curriculum Approved',
        submittedOn: '15/04/2026 02:00 PM',
        location: 'Kigali',
    },
    {
        id: 'CE-005',
        applicant: { name: 'Harry Osborn', email: 'harry@corp.rw', avatar: 'HO' },
        institution: { name: 'Osborn Academy', website: 'osborn.rw', logo: 'OA' },
        trade: { name: 'Robotics', category: 'ICT' },
        status: 'Rejected',
        stage: 'Standards Violation',
        submittedOn: '10/04/2026 04:00 PM',
        location: 'Kigali',
    },
];

export function getMockApplicationsByRole(role: string): Application[] {
    switch (role) {
        case 'super-admin':
        case 'merged':
            return mockApplications;
        case 'evaluator':
            return mockApplications.filter(app => app.id.startsWith('EV-') || app.id.startsWith('SA-'));
        case 'supervisor':
            return mockApplications.filter(app => app.id.startsWith('SV-') || app.id.startsWith('SA-'));
        case 'curriculum-evaluator':
            return mockApplications.filter(app => app.id.startsWith('CE-') || app.id.startsWith('SA-'));
        case 'applicant':
            return mockApplications.filter(app => app.id.startsWith('APP-'));
        default:
            return [];
    }
}

export function getMockStatsByRole(role: string) {
    if (role === 'curriculum-evaluator') {
        return [
            { label: 'Assigned reviews', value: 10, icon: 'ClipboardClock', iconColor: '#FF8D28' },
            { label: 'Ready for approval', value: 2, icon: 'CheckCheck', iconColor: '#34C759' },
            { label: 'Evidence gaps', value: 3, icon: 'FileSearch', iconColor: '#0A77FF' },
            { label: 'Standards issues', value: 1, icon: 'ShieldAlert', iconColor: '#FF383C' },
        ];
    }

    // Default stats for other roles
    return [
        { label: 'Applications', value: 24, icon: 'NotepadText', iconColor: '#0A77FF' },
        { label: 'Pending', value: 8, icon: 'ClipboardClock', iconColor: '#FF8D28' },
        { label: 'Evaluated', value: 5, icon: 'CheckCheck', iconColor: '#34C759' },
        { label: 'Rejected', value: 11, icon: 'AlertTriangle', iconColor: '#FF383C' },
    ];
}
