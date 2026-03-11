<script lang="ts">
	import FilterIcon from "@lucide/svelte/icons/filter";
	import MapPinIcon from "@lucide/svelte/icons/map-pin";
	import TargetIcon from "@lucide/svelte/icons/target";
	import { Button } from "$lib/components/ui/button";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Slider } from "$lib/components/ui/slider";
	import { Label } from "$lib/components/ui/label";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import {
		type District,
		type Faculty,
		type TeacherFiltersState,
		DISTRICTS,
		FACULTIES,
	} from "./types.js";

	interface Props {
		filters: TeacherFiltersState;
		onFiltersChange: (filters: TeacherFiltersState) => void;
		onApplyFilters?: () => void;
		onExportReports?: () => void;
	}

	let { filters, onFiltersChange, onApplyFilters, onExportReports }: Props =
		$props();

	// Extract successThreshold as typed tuple to avoid TS indexing errors
	let successThreshold = $derived(
		filters.successThreshold as unknown as [number, number],
	);

	function toggleDistrict(district: District) {
		const newDistricts = filters.districts.includes(district)
			? filters.districts.filter((d) => d !== district)
			: [...filters.districts, district];
		onFiltersChange({ ...filters, districts: newDistricts });
	}

	function toggleFaculty(faculty: Faculty) {
		const newFaculties = filters.faculties.includes(faculty)
			? filters.faculties.filter((f) => f !== faculty)
			: [...filters.faculties, faculty];
		onFiltersChange({ ...filters, faculties: newFaculties });
	}

	function handleThresholdChange(value: number[]) {
		if (
			value[0] !== successThreshold[0] ||
			value[1] !== successThreshold[1]
		) {
			onFiltersChange({
				districts: filters.districts,
				faculties: filters.faculties,
				successThreshold: [value[0], value[1]] as [number, number],
			});
		}
	}
</script>

<Sidebar.Header
	class="border-b items-center flex-row border-b-gray-300 bg-[#fafafb] px-6 py-6"
>
	<FilterIcon class="h-4 w-4 text-black" />
	<span class="text-sm font-normal text-black">Teacher Filters</span>
</Sidebar.Header>

<Sidebar.Content class="bg-[#fafafb] px-6">
	<!-- District Selection -->
	<Sidebar.Group>
		<Sidebar.GroupLabel
			class="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500"
		>
			<MapPinIcon class="h-3.5 w-3.5 text-primary" />
			District Selection
		</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="space-y-3 pt-2">
			{#each DISTRICTS as district, index (index)}
				<div class="flex items-center gap-2">
					<Checkbox
						id="teacher-district-{district}"
						checked={filters.districts.includes(district)}
						onCheckedChange={() => toggleDistrict(district)}
					/>
					<Label
						for="teacher-district-{district}"
						class="text-sm font-normal leading-0 text-black cursor-pointer"
					>
						{district}
					</Label>
				</div>
			{/each}
		</Sidebar.GroupContent>
	</Sidebar.Group>

	<!-- Primary Faculty -->
	<Sidebar.Group>
		<Sidebar.GroupLabel
			class="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500"
		>
			<svg
				class="h-3.5 w-3.5 text-gray-500"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<rect x="3" y="3" width="7" height="7" rx="1" />
				<rect x="14" y="3" width="7" height="7" rx="1" />
				<rect x="3" y="14" width="7" height="7" rx="1" />
				<rect x="14" y="14" width="7" height="7" rx="1" />
			</svg>
			Primary Faculty
		</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="space-y-3 pt-2">
			{#each FACULTIES as faculty, index (index)}
				<div class="flex items-center gap-2">
					<Checkbox
						id="teacher-faculty-{index}"
						checked={filters.faculties.includes(faculty)}
						onCheckedChange={() => toggleFaculty(faculty)}
					/>
					<Label
						for="teacher-faculty-{index}"
						class="text-sm font-normal leading-0 text-black cursor-pointer"
					>
						{faculty}
					</Label>
				</div>
			{/each}
		</Sidebar.GroupContent>
	</Sidebar.Group>

	<!-- Success Threshold Section -->
	<Sidebar.Group>
		<Sidebar.GroupLabel
			class="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-gray-500"
		>
			<TargetIcon class="h-3.5 w-3.5 text-green-500" />
			Success Threshold (%)
		</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="pt-3 px-1">
			<Slider
				type="multiple"
				bind:value={successThreshold}
				onValueChange={handleThresholdChange}
				min={0}
				max={100}
				step={1}
				class="w-full **:data-[slot=slider-track]:bg-[#b5d0f1] **:data-[slot=slider-range]:bg-primary"
			/>
			<div class="mt-3 flex justify-between text-xs text-gray-500">
				<span>0%</span>
				<span class="text-primary font-medium"
					>{successThreshold[0]}% - {successThreshold[1]}%</span
				>
				<span>100%</span>
			</div>
		</Sidebar.GroupContent>
	</Sidebar.Group>

	<!-- Apply Filters Button -->
	<Sidebar.Group>
		<Sidebar.GroupContent class="pt-2">
			<Button
				class="w-full bg-primary hover:bg-blue-700"
				onclick={onApplyFilters}
			>
				Apply Filters
			</Button>
		</Sidebar.GroupContent>
	</Sidebar.Group>
	<!-- <Sidebar.Group class="border-t border-gray-200 bg-[#fafafb] px-6">
		<Sidebar.GroupContent>
			<Button
				variant="outline"
				class="w-full justify-start gap-2"
				onclick={onExportReports}
			>
				<DownloadIcon class="h-4 w-4" />
				Export Reports
			</Button>
		</Sidebar.GroupContent>
	</Sidebar.Group> -->
</Sidebar.Content>
