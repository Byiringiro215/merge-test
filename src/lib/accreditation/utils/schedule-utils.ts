export interface ScheduleItem {
    id: string;
    institution: {
        name: string;
        phone: string;
        logo: string;
    };
    evaluator: {
        name: string;
        email: string;
        avatar: string;
    };
    trade: string;
    spe: string;
    visitDate: string;
    visitTime: string;
    status: any;
    location: string;
}

export const mockSchedule: ScheduleItem[] = [
    {
        id: '1',
        institution: {
            name: 'Command...',
            phone: '+250-79-00..',
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=C',
        },
        evaluator: {
            name: 'Drew Cano',
            email: 'drew@untitledui.c..',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Drew',
        },
        trade: 'JavaScript',
        spe: 'SPE',
        visitDate: '19/12/2025',
        visitTime: '2:00 PM',
        status: 'Pending',
        location: 'Province/District/Sector/Cell/Village',
    },
    {
        id: '2',
        institution: {
            name: 'Command...',
            phone: '+250-79-00..',
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=R',
        },
        evaluator: {
            name: 'Natali Craig',
            email: 'natali@gmail.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Natali',
        },
        trade: 'JavaScript',
        spe: 'SPE',
        visitDate: '19/12/2025',
        visitTime: '2:00 PM',
        status: 'Pending',
        location: 'Province/District/Sector/Cell/Village',
    },
    {
        id: '3',
        institution: {
            name: 'Command...',
            phone: '+250-79-00..',
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=C',
        },
        evaluator: {
            name: 'Drew Cano',
            email: 'drew@untitledui.c..',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Drew',
        },
        trade: 'JavaScript',
        spe: 'SPE',
        visitDate: '19/12/2025',
        visitTime: '2:00 PM',
        status: 'Cancelled',
        location: 'Province/District/Sector/Cell/Village',
    },
    {
        id: '4',
        institution: {
            name: 'Command...',
            phone: '+250-79-00..',
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=R',
        },
        evaluator: {
            name: 'Natali Craig',
            email: 'natali@gmail.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Natali',
        },
        trade: 'JavaScript',
        spe: 'SPE',
        visitDate: '19/12/2025',
        visitTime: '2:00 PM',
        status: 'Completed',
        location: 'Province/District/Sector/Cell/Village',
    },
    {
        id: '5',
        institution: {
            name: 'Command...',
            phone: '+250-79-00..',
            logo: 'https://api.dicebear.com/7.x/initials/svg?seed=C',
        },
        evaluator: {
            name: 'Drew Cano',
            email: 'drew@untitledui.c..',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Drew',
        },
        trade: 'JavaScript',
        spe: 'SPE',
        visitDate: '19/12/2025',
        visitTime: '2:00 PM',
        status: 'Rejected',
        location: 'Province/District/Sector/Cell/Village',
    },
];
