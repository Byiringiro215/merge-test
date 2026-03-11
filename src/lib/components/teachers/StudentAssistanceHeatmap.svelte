<script lang="ts">
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
	} from "$lib/components/ui/card";
	import type { District, Faculty } from "./types.js";
	import { DISTRICTS, FACULTIES } from "./types.js";

	interface HeatmapData {
		faculty: Faculty;
		district: District;
		value: number; // 0-100
	}

	interface Props {
		data?: HeatmapData[];
	}

	// Generate default heatmap data matching the design
	const defaultData: HeatmapData[] = [
		// Software development row
		{ faculty: "Software development", district: "Kicukiro", value: 50 },
		{ faculty: "Software development", district: "Nyamagabe", value: 55 },
		{ faculty: "Software development", district: "Rubavu", value: 60 },
		{ faculty: "Software development", district: "Ngororero", value: 45 },
		{ faculty: "Software development", district: "Gasabo", value: 90 },
		// Mechanics row
		{ faculty: "Mechanics", district: "Kicukiro", value: 55 },
		{ faculty: "Mechanics", district: "Nyamagabe", value: 60 },
		{ faculty: "Mechanics", district: "Rubavu", value: 70 },
		{ faculty: "Mechanics", district: "Ngororero", value: 50 },
		{ faculty: "Mechanics", district: "Gasabo", value: 65 },
		// Automobile row
		{ faculty: "Automobile", district: "Kicukiro", value: 50 },
		{ faculty: "Automobile", district: "Nyamagabe", value: 55 },
		{ faculty: "Automobile", district: "Rubavu", value: 45 },
		{ faculty: "Automobile", district: "Ngororero", value: 25 },
		{ faculty: "Automobile", district: "Gasabo", value: 60 },
		// Tourism row
		{ faculty: "Tourism", district: "Kicukiro", value: 75 },
		{ faculty: "Tourism", district: "Nyamagabe", value: 65 },
		{ faculty: "Tourism", district: "Rubavu", value: 30 },
		{ faculty: "Tourism", district: "Ngororero", value: 85 },
		{ faculty: "Tourism", district: "Gasabo", value: 55 },
		// Electrical engineering row
		{ faculty: "Electrical engineering", district: "Kicukiro", value: 60 },
		{ faculty: "Electrical engineering", district: "Nyamagabe", value: 70 },
		{ faculty: "Electrical engineering", district: "Rubavu", value: 45 },
		{ faculty: "Electrical engineering", district: "Ngororero", value: 50 },
		{ faculty: "Electrical engineering", district: "Gasabo", value: 55 },
		// Road construction row
		{ faculty: "Road construction", district: "Kicukiro", value: 40 },
		{ faculty: "Road construction", district: "Nyamagabe", value: 75 },
		{ faculty: "Road construction", district: "Rubavu", value: 70 },
		{ faculty: "Road construction", district: "Ngororero", value: 55 },
		{ faculty: "Road construction", district: "Gasabo", value: 70 },
	];

	let { data = defaultData }: Props = $props();

	// Tooltip state
	let tooltipVisible = $state(false);
	let tooltipText = $state("");
	let tooltipX = $state(0);
	let tooltipY = $state(0);

	function getCellValue(faculty: Faculty, district: District): number {
		const cell = data.find(d => d.faculty === faculty && d.district === district);
		return cell?.value ?? 0;
	}

	function getColorForValue(value: number): string {
		// Smoother gradient matching the design - light to dark blue
		if (value <= 30) return "#c7d9f0"; // very light blue
		if (value <= 45) return "#a3c4e8"; // light blue
		if (value <= 55) return "#7babd9"; // medium light blue
		if (value <= 65) return "#5a92c9"; // medium blue
		if (value <= 75) return "#3d7bb8"; // medium dark blue
		if (value <= 85) return "#2563eb"; // dark blue
		return "#1d4ed8"; // very dark blue
	}

	function formatFacultyLabel(faculty: Faculty): string {
		return faculty.toUpperCase();
	}

	function formatDistrictLabel(district: District): string {
		return district.toUpperCase();
	}

	function showTooltip(event: MouseEvent, faculty: Faculty, district: District, value: number) {
		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		const parentRect = target.closest('.overflow-x-auto')?.getBoundingClientRect();

		if (parentRect) {
			tooltipX = rect.left - parentRect.left + rect.width / 2;
			tooltipY = rect.top - parentRect.top - 10;
		}

		tooltipText = `${faculty} - ${district}: ${value}%`;
		tooltipVisible = true;
	}

	function hideTooltip() {
		tooltipVisible = false;
	}
</script>

<Card class="h-full">
	<CardHeader class="px-4 pb-2 pt-4 lg:px-6 lg:pt-5">
		<div class="flex items-start justify-between">
			<div>
				<CardTitle class="text-lg font-semibold">Student Assistance Heatmap</CardTitle>
				<CardDescription>
					Intensity of teacher-led extra support sessions by faculty & district
				</CardDescription>
			</div>
			<!-- Legend -->
			<div class="flex items-center gap-2 text-xs text-gray-500">
				<span>Low</span>
				<div class="flex items-center gap-0.5">
					<div class="h-3 w-3 rounded-full bg-[#c7d9f0]"></div>
					<div class="h-3 w-3 rounded-full bg-[#5a92c9]"></div>
					<div class="h-3 w-3 rounded-full bg-[#1d4ed8]"></div>
				</div>
				<span>High</span>
			</div>
		</div>
	</CardHeader>
	<CardContent class="px-4 pb-4 pt-2 lg:px-6 lg:pb-5">
		<div class="relative overflow-x-auto">
			<!-- Tooltip -->
			<div
				class="pointer-events-none absolute z-20 rounded-md bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-white shadow-lg transition-opacity duration-150"
				style="opacity: {tooltipVisible ? 1 : 0}; left: {tooltipX}px; top: {tooltipY}px; transform: translate(-50%, -100%);"
			>
				{tooltipText}
				<div class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
			</div>

			<table class="w-full border-separate border-spacing-1.5">
				<thead>
					<tr>
						<th class="w-36"></th>
						{#each DISTRICTS as district}
							<th class="px-1 py-2 text-[10px] font-medium text-gray-500 text-center whitespace-nowrap">
								{formatDistrictLabel(district)}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each FACULTIES as faculty}
						<tr>
							<td class="pr-2 py-1 text-[10px] font-medium text-gray-500 text-right whitespace-nowrap">
								{formatFacultyLabel(faculty)}
							</td>
							{#each DISTRICTS as district}
								{@const value = getCellValue(faculty, district)}
								<td class="p-0">
									<div
										class="h-9 w-full min-w-[50px] rounded cursor-pointer transition-transform duration-150 hover:scale-105 hover:shadow-md"
										style="background-color: {getColorForValue(value)};"
										onmouseenter={(e) => showTooltip(e, faculty, district, value)}
										onmouseleave={hideTooltip}
										role="gridcell"
										aria-label="{faculty} - {district}: {value}%"
									></div>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</CardContent>
</Card>
