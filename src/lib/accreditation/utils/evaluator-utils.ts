export interface Evaluator {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    status: any;
    dateAdded: string;
    lastActive: string;
}

export const mockEvaluators: Evaluator[] = [
    {
        id: '1',
        name: 'Natali Craig',
        email: 'natali@gmail.com',
        avatar: 'NC',
        role: 'Evaluator',
        status: 'Active',
        dateAdded: 'Feb 22, 2022',
        lastActive: 'Mar 14, 2022',
    },
    {
        id: '2',
        name: 'Drew Cano',
        email: 'drew@untitledui.com',
        avatar: 'DC',
        role: 'Supervisor',
        status: 'Pending',
        dateAdded: 'Feb 22, 2022',
        lastActive: 'Mar 12, 2022',
    },
    {
        id: '3',
        name: 'Natali Craig',
        email: 'natali@gmail.com',
        avatar: 'NC',
        role: 'Evaluator',
        status: 'Deactivated',
        dateAdded: 'Feb 22, 2022',
        lastActive: 'Mar 12, 2022',
    },
    {
        id: '4',
        name: 'Drew Cano',
        email: 'drew@untitledui.com',
        avatar: 'DC',
        role: 'Supervisor',
        status: 'Active',
        dateAdded: 'Feb 22, 2022',
        lastActive: 'Mar 14, 2022',
    },
    {
        id: '5',
        name: 'Natali Craig',
        email: 'natali@gmail.com',
        avatar: 'NC',
        role: 'Evaluator',
        status: 'Pending',
        dateAdded: 'Feb 22, 2022',
        lastActive: 'Mar 13, 2022',
    },
];
