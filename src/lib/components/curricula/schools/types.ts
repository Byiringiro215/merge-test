export interface SchoolRecord {
    id: string;
    name: string;
    district: string;
    province: string;
    type: 'Public' | 'Private' | 'Government Aided';
    teachers: number;
    students: number;
}

export interface SchoolsFiltersState {
    institutionTypes: string[];
    provinces: string[];
    district: string;
}

export const INSTITUTION_TYPES = [
    { value: 'public', label: 'Public' },
    { value: 'private', label: 'Private' },
    { value: 'government_aided', label: 'Government Aided' },
];

export const PROVINCES = [
    { value: 'kigali_city', label: 'Kigali City' },
    { value: 'northern', label: 'Northern' },
    { value: 'southern', label: 'Southern' },
    { value: 'eastern', label: 'Eastern' },
    { value: 'western', label: 'Western' },
];

export const DISTRICTS_BY_PROVINCE: Record<string, { value: string; label: string }[]> = {
    kigali_city: [
        { value: 'gasabo', label: 'Gasabo' },
        { value: 'kicukiro', label: 'Kicukiro' },
        { value: 'nyarugenge', label: 'Nyarugenge' },
    ],
    northern: [
        { value: 'burera', label: 'Burera' },
        { value: 'gakenke', label: 'Gakenke' },
        { value: 'gicumbi', label: 'Gicumbi' },
        { value: 'musanze', label: 'Musanze' },
        { value: 'rulindo', label: 'Rulindo' },
    ],
    southern: [
        { value: 'gisagara', label: 'Gisagara' },
        { value: 'huye', label: 'Huye' },
        { value: 'kamonyi', label: 'Kamonyi' },
        { value: 'muhanga', label: 'Muhanga' },
        { value: 'nyamagabe', label: 'Nyamagabe' },
        { value: 'nyanza', label: 'Nyanza' },
        { value: 'nyaruguru', label: 'Nyaruguru' },
        { value: 'ruhango', label: 'Ruhango' },
    ],
    eastern: [
        { value: 'bugesera', label: 'Bugesera' },
        { value: 'gatsibo', label: 'Gatsibo' },
        { value: 'kayonza', label: 'Kayonza' },
        { value: 'kirehe', label: 'Kirehe' },
        { value: 'ngoma', label: 'Ngoma' },
        { value: 'nyagatare', label: 'Nyagatare' },
        { value: 'rwamagana', label: 'Rwamagana' },
    ],
    western: [
        { value: 'karongi', label: 'Karongi' },
        { value: 'ngororero', label: 'Ngororero' },
        { value: 'nyabihu', label: 'Nyabihu' },
        { value: 'nyamasheke', label: 'Nyamasheke' },
        { value: 'rubavu', label: 'Rubavu' },
        { value: 'rusizi', label: 'Rusizi' },
        { value: 'rutsiro', label: 'Rutsiro' },
    ],
};
