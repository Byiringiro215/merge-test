export interface CompletedApplication {
    id: string;
    applicant: { name: string; email: string; avatar: string };
    institution: { name: string; website: string; logo: string };
    trade: { name: string; category: string };
    completedOn: string;
    evaluator: string;
    certificateAccess: 'Granted' | 'Pending';
}

export const mockCompletedApplications: CompletedApplication[] = [
    {
        id: '1',
        applicant: { name: 'Jane Smith', email: 'janesmith@example.com', avatar: 'JS' },
        institution: { name: 'Tech Institute Rwanda', website: 'techinstituterw.com', logo: 'TI' },
        trade: { name: 'Masonry', category: 'SPE' },
        completedOn: '15/03/2026',
        evaluator: 'John Doe',
        certificateAccess: 'Pending',
    },
    {
        id: '2',
        applicant: { name: 'Robert Johnson', email: 'robert@example.com', avatar: 'RJ' },
        institution: { name: 'Vocational Training Center', website: 'vtc.rw', logo: 'VT' },
        trade: { name: 'Carpentry', category: 'SPE' },
        completedOn: '12/03/2026',
        evaluator: 'Sarah Williams',
        certificateAccess: 'Granted',
    },
    {
        id: '3',
        applicant: { name: 'Mary Brown', email: 'mary@example.com', avatar: 'MB' },
        institution: { name: 'Skills Development Institute', website: 'sdi.rw', logo: 'SD' },
        trade: { name: 'Plumbing', category: 'SPE' },
        completedOn: '10/03/2026',
        evaluator: 'Michael Chen',
        certificateAccess: 'Pending',
    },
    {
        id: '4',
        applicant: { name: 'David Wilson', email: 'david@example.com', avatar: 'DW' },
        institution: { name: 'Professional Training Academy', website: 'pta.rw', logo: 'PT' },
        trade: { name: 'Electrical Installation', category: 'SPE' },
        completedOn: '08/03/2026',
        evaluator: 'Emily Davis',
        certificateAccess: 'Granted',
    },
    {
        id: '5',
        applicant: { name: 'Lisa Anderson', email: 'lisa@example.com', avatar: 'LA' },
        institution: { name: 'Technical College Kigali', website: 'tck.rw', logo: 'TC' },
        trade: { name: 'Welding', category: 'SPE' },
        completedOn: '05/03/2026',
        evaluator: 'James Miller',
        certificateAccess: 'Pending',
    },
];

export interface GrantedCertificate {
    id: string;
    applicant: { name: string; email: string; avatar: string };
    institution: { name: string; website: string; logo: string };
    trade: { name: string; category: string };
    grantedOn: string;
    evaluator: string;
}

export const mockGrantedCertificates: GrantedCertificate[] = [
    {
        id: '1',
        applicant: { name: 'Robert Johnson', email: 'robert@example.com', avatar: 'RJ' },
        institution: { name: 'Vocational Training Center', website: 'vtc.rw', logo: 'VT' },
        trade: { name: 'Carpentry', category: 'SPE' },
        grantedOn: '2026-03-01',
        evaluator: 'Sarah Williams',
    },
    {
        id: '2',
        applicant: { name: 'David Wilson', email: 'david@example.com', avatar: 'DW' },
        institution: { name: 'Professional Training Academy', website: 'pta.rw', logo: 'PT' },
        trade: { name: 'Electrical Installation', category: 'SPE' },
        grantedOn: '2026-02-10',
        evaluator: 'Emily Davis',
    },
    {
        id: '3',
        applicant: { name: 'Alice Mutoni', email: 'alice@example.com', avatar: 'AM' },
        institution: { name: 'Kigali Tech Institute', website: 'kti.rw', logo: 'KT' },
        trade: { name: 'Masonry', category: 'SPE' },
        grantedOn: '2026-04-01',
        evaluator: 'John Doe',
    },
    {
        id: '4',
        applicant: { name: 'Eric Nkurunziza', email: 'eric@example.com', avatar: 'EN' },
        institution: { name: 'Rwanda Skills Center', website: 'rsc.rw', logo: 'RS' },
        trade: { name: 'Plumbing', category: 'SPE' },
        grantedOn: '2026-01-10',
        evaluator: 'Michael Chen',
    },
    {
        id: '5',
        applicant: { name: 'Grace Uwimana', email: 'grace@example.com', avatar: 'GU' },
        institution: { name: 'Technical College Kigali', website: 'tck.rw', logo: 'TC' },
        trade: { name: 'Welding', category: 'SPE' },
        grantedOn: '2026-04-10',
        evaluator: 'James Miller',
    },
];

export function getDaysInfo(grantedOn: string) {
    const granted = new Date(grantedOn);
    const expiry = new Date(granted);
    expiry.setMonth(expiry.getMonth() + 3);

    const today = new Date('2026-05-02');
    const totalMs = expiry.getTime() - granted.getTime();
    const elapsedMs = today.getTime() - granted.getTime();
    const remainingMs = expiry.getTime() - today.getTime();

    const totalDays = Math.round(totalMs / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.round(elapsedMs / (1000 * 60 * 60 * 24));
    const remainingDays = Math.round(remainingMs / (1000 * 60 * 60 * 24));
    const progressPct = Math.min(100, Math.round((elapsedDays / totalDays) * 100));

    const isExpired = remainingDays <= 0;
    const isExpiringSoon = !isExpired && remainingDays <= 30;

    return { granted, expiry, elapsedDays, remainingDays, progressPct, isExpired, isExpiringSoon };
}

export function formatDate(date: Date) {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
