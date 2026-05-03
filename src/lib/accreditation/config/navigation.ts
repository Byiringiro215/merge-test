import type { PortalNavigation } from '../types/navigation';

import {
    BadgeCheck,
    Bell,
    CalendarCheck,
    ClipboardCheck,
    FileSpreadsheet,
    House,
    User,
    Users,
} from '@lucide/svelte';

export const portalNavigation: Record<PortalNavigation['role'], PortalNavigation> = {
    'applicant': {
        role: 'applicant',
        label: 'Applicant Portal',
        shortLabel: 'Applicant',
        basePath: '/accreditation/applicant',
        items: [
            { title: 'Dashboard', href: '/accreditation/applicant/dashboard', description: '', icon: House, match: 'exact' },
            { title: 'Applications', href: '/accreditation/applicant/applications', description: '', icon: FileSpreadsheet },
            { title: 'Evaluations', href: '/accreditation/applicant/evaluations', description: '', icon: CalendarCheck },
            { title: 'Profile', href: '/accreditation/applicant/profile', description: '', icon: User },
            { title: 'Notifications', href: '/accreditation/applicant/notifications', description: '', icon: Bell },
        ],
    },
    'evaluator': {
        role: 'evaluator',
        label: 'Evaluator Portal',
        shortLabel: 'Evaluator',
        basePath: '/accreditation/evaluator',
        items: [
            { title: 'Dashboard', href: '/accreditation/evaluator/dashboard', description: '', icon: House, match: 'exact' },
            { title: 'Evaluations', href: '/accreditation/evaluator/applications', description: '', icon: BadgeCheck },
            { title: 'Profile', href: '/accreditation/evaluator/profile', description: '', icon: User },
            { title: 'Notifications', href: '/accreditation/evaluator/notifications', description: '', icon: Bell },
        ],
    },
    'super-admin': {
        role: 'super-admin',
        label: 'Super Admin Portal',
        shortLabel: 'Super Admin',
        basePath: '/accreditation/super-admin',
        items: [
            { title: 'Dashboard', href: '/accreditation/super-admin/dashboard', description: '', icon: House, match: 'exact' },
            { title: 'Evaluations', href: '/accreditation/super-admin/evaluations/applications', description: '', icon: BadgeCheck },
            { title: 'Users', href: '/accreditation/super-admin/users', description: '', icon: Users },
            { title: 'Profile', href: '/accreditation/super-admin/profile', description: '', icon: User },
            { title: 'Notifications', href: '/accreditation/super-admin/notifications', description: '', icon: Bell },
        ],
    },
    'curriculum-evaluator': {
        role: 'curriculum-evaluator',
        label: 'Curriculum Evaluator Portal',
        shortLabel: 'Curriculum',
        basePath: '/accreditation/curriculum-evaluator',
        items: [
            { title: 'Dashboard', href: '/accreditation/curriculum-evaluator/dashboard', description: '', icon: House, match: 'exact' },
            { title: 'Applications', href: '/accreditation/curriculum-evaluator/applications', description: '', icon: FileSpreadsheet },
            { title: 'Profile', href: '/accreditation/curriculum-evaluator/profile', description: '', icon: User },
            { title: 'Notifications', href: '/accreditation/curriculum-evaluator/notifications', description: '', icon: Bell },
        ],
    },
    'supervisor': {
        role: 'supervisor',
        label: 'Supervisor Portal',
        shortLabel: 'Supervisor',
        basePath: '/accreditation/supervisor',
        items: [
            { title: 'Dashboard', href: '/accreditation/supervisor/dashboard', description: '', icon: House, match: 'exact' },
            { title: 'Evaluations', href: '/accreditation/supervisor/evaluations/applications', description: '', icon: BadgeCheck },
            { title: 'Certificates', href: '/accreditation/supervisor/certificates', description: '', icon: ClipboardCheck },
            { title: 'Profile', href: '/accreditation/supervisor/profile', description: '', icon: User },
            { title: 'Notifications', href: '/accreditation/supervisor/notifications', description: '', icon: Bell },
        ],
    },
};
