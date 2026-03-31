export interface DGFiltersState {
	dateRange: string;
	province: string;
	district: string;
	schoolType: string;
	faculty: string;
}

export interface RegionData {
	region: string;
	totalSchools: number;
	students: number;
	teachingStaff: number;
	curriculumProgs: number;
	infraSpiu: string;
	status: "Active" | "Warning" | "Inactive";
}

export interface CrossDepartmentTrendPoint {
	month: string;
	value: number;
}

export const PROVINCE_COLORS = {
	kigali: "#DC2626", // Red
	southern: "#A855F7", // Purple
	western: "#4ADE80", // Green
	northern: "#3B82F6", // Blue
	eastern: "#F97316", // Orange
} as const;

export const PROVINCE_NAMES = {
	kigali: "Kigali City",
	southern: "Southern Province",
	western: "Western Province",
	northern: "Northern Province",
	eastern: "Eastern Province",
} as const;
