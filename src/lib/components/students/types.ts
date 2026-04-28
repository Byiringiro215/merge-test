export type Trade
    = | 'Software development'
        | 'Mechanics'
        | 'Automobile'
        | 'Tourism'
        | 'Electrical engineering'
        | 'Road construction';

export type Level = 'L1' | 'L2' | 'L3' | 'L4' | 'L5';

export interface ScoreDistribution {
    range: string;
    count: number;
}

export interface TradeEnrollment {
    trade: Trade;
    count: number;
    color: string;
}

export const TRADES: Trade[] = [
    'Software development',
    'Mechanics',
    'Automobile',
    'Tourism',
    'Electrical engineering',
    'Road construction',
];

export const LEVELS: Level[] = ['L1', 'L2', 'L3', 'L4', 'L5'];

export const FACULTY_COLORS: Record<Trade, string> = {
    'Software development': '#3b82f6',
    'Mechanics': '#10b981',
    'Automobile': '#f59e0b',
    'Tourism': '#a855f7',
    'Electrical engineering': '#06b6d4',
    'Road construction': '#ef4444',
};
