export interface DigitalTechFiltersState {
    dateRange: string;
    province: string;
    district: string;
    connection: string;
}

export interface HardwareAssetRecord {
    id: string;
    schoolName: string;
    province: string;
    district: string;
    connection: 'Fiber' | 'Cellular' | 'Fixed Wireless' | 'Satellite';
    serverStatus: 'Active' | 'Inactive';
    totalDevices: number;
    status: 'Healthy' | 'Warning' | 'Needs Attention' | 'Critical';
}

export interface ConnectionBreakdown {
    type: string;
    count: number;
    percentage: number;
    color: string;
}

export interface DeviceBreakdown {
    type: string;
    count: number;
    color: string;
}

export interface RegionalConnectionData {
    region: string;
    fiber: number;
    cellular: number;
    wireless: number;
    satellite: number;
}

export interface ConnectivityGrowthData {
    month: string;
    connectedSchools: number;
    activeDevices: number;
}

export const CONNECTION_COLORS = {
    Fiber: '#3B82F6',
    Cellular: '#A855F7',
    Wireless: '#F97316',
    Satellite: '#D1D5DB',
};

export const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    'Healthy': { bg: 'bg-green-50', text: 'text-green-600', dot: 'bg-green-500' },
    'Warning': { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-500' },
    'Needs Attention': { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
    'Critical': { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
};

export const SERVER_STATUS_STYLES: Record<string, { bg: string; text: string }> = {
    Active: { bg: 'bg-green-50', text: 'text-green-700' },
    Inactive: { bg: 'bg-red-50', text: 'text-red-600' },
};

export const CONNECTION_BADGE_STYLES: Record<string, { bg: string; text: string }> = {
    'Fiber': { bg: 'bg-blue-500', text: 'text-white' },
    'Cellular': { bg: 'bg-gray-100', text: 'text-gray-700' },
    'Fixed Wireless': { bg: 'bg-gray-100', text: 'text-gray-700' },
    'Satellite': { bg: 'bg-gray-100', text: 'text-gray-700' },
};
