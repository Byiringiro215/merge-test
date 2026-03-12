export type Trade = 'Software' | 'Mechanics' | 'Automobile' | 'Tourism' | 'Electrical' | 'Road Construction';

export type District = 'Kicukiro' | 'Nyamagabe' | 'Rubavu' | 'Ngororero' | 'Gasabo';

export interface Course {
	id: number;
	name: string;
	school: string;
	district: District;
	faculty: string;
	instructor: string;
	instructorAvatar?: string;
	enrollment: number;
	successRate: number;
}

export interface EnrollmentByTradeData {
	trade: Trade;
	enrollment: number;
	color: string;
}

export interface DistrictDistributionData {
	district: District;
	value: number;
	percentage: number;
	color: string;
}

export const DISTRICTS: District[] = ['Kicukiro', 'Nyamagabe', 'Rubavu', 'Ngororero', 'Gasabo'];

export const TRADES: Trade[] = ['Software', 'Mechanics', 'Automobile', 'Tourism', 'Electrical', 'Road Construction'];

export const TRADE_COLORS: Record<Trade, string> = {
	Software: '#36B3E6',
	Mechanics: '#4ADE80',
	Automobile: '#F97316',
	Tourism: '#A855F7',
	Electrical: '#67E8F9',
	'Road Construction': '#F87171',
};

export const DISTRICT_COLORS: Record<District, string> = {
	Kicukiro: '#3B82F6',
	Nyamagabe: '#4ADE80',
	Rubavu: '#F97316',
	Ngororero: '#A855F7',
	Gasabo: '#67E8F9',
};
