export interface CriteriaAttachment {
    id: string;
    name: string;
    size: string;
    type: string;
    dateUploaded: string;
    lastUpdated: string;
    uploadedBy: {
        name: string;
        email: string;
        avatar: string;
    };
}

export const mockCriteriaAttachments: CriteriaAttachment[] = [
    {
        id: '1',
        name: 'Evaluation Criteria One',
        size: '200 KB',
        type: 'PDF',
        dateUploaded: 'Jan 4, 2022',
        lastUpdated: 'Jan 4, 2022',
        uploadedBy: {
            name: 'Olivia Rhye',
            email: 'olivia@untitledui.com',
            avatar: 'https://i.pravatar.cc/150?u=olivia',
        },
    },
    {
        id: '2',
        name: 'Evaluation Criteria One',
        size: '720 KB',
        type: 'PDF',
        dateUploaded: 'Jan 4, 2022',
        lastUpdated: 'Jan 4, 2022',
        uploadedBy: {
            name: 'Phoenix Baker',
            email: 'phoenix@untitledui.com',
            avatar: 'https://i.pravatar.cc/150?u=phoenix',
        },
    },
    {
        id: '3',
        name: 'Evaluation Criteria One',
        size: '16 MB',
        type: 'PDF',
        dateUploaded: 'Jan 2, 2022',
        lastUpdated: 'Jan 2, 2022',
        uploadedBy: {
            name: 'Lana Steiner',
            email: 'lana@untitledui.com',
            avatar: 'https://i.pravatar.cc/150?u=lana',
        },
    },
    {
        id: '4',
        name: 'Evaluation Criteria One',
        size: '4.2 MB',
        type: 'PDF',
        dateUploaded: 'Jan 6, 2022',
        lastUpdated: 'Jan 6, 2022',
        uploadedBy: {
            name: 'Demi Wilkinson',
            email: 'demi@untitledui.com',
            avatar: 'https://i.pravatar.cc/150?u=demi',
        },
    },
    {
        id: '5',
        name: 'Evaluation Criteria One',
        size: '400 KB',
        type: 'PDF',
        dateUploaded: 'Jan 8, 2022',
        lastUpdated: 'Jan 8, 2022',
        uploadedBy: {
            name: 'Candice Wu',
            email: 'candice@untitledui.com',
            avatar: 'https://i.pravatar.cc/150?u=candice',
        },
    },
];
