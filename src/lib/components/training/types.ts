export interface TrainingFiltersState {
    dateRange: string;
    province: string;
    district: string;
    schoolType: string;
    tradeArea: string;
}

export interface TrainingRecord {
    refId: string;
    tradeDiscipline: string;
    institution: string;
    cohort: string;
    startDate: string;
    participants: number;
    status: 'Ongoing' | 'Completed' | 'Planned';
}

export interface TrainingStatsData {
    title: string;
    value: string | number;
    icon: import('svelte').Component;
    iconBgColor?: string;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    description?: string;
    breakdowns?: { label: string; value: string | number }[];
}

export interface TradeEnrollmentData {
    trade: string;
    percentage: number;
    color: string;
}

export const TRADE_ENROLLMENT_COLORS: Record<string, string> = {
    'Masonry': '#3B82F6',
    'Carpentry': '#4ADE80',
    'IT & Software': '#F97316',
    'Automotive': '#A855F7',
    'Culinary Arts': '#67E8F9',
};
