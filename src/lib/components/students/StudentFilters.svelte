<script lang="ts">
	import FilterIcon from "@lucide/svelte/icons/filter";
	import Building2Icon from "@lucide/svelte/icons/building-2";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Slider } from "$lib/components/ui/slider";
	import { Label } from "$lib/components/ui/label";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import {
		type District,
		type Faculty,
		type StudentFiltersState,
		DISTRICTS,
		FACULTIES,
		LEVELS,
	} from "./types.js";

	interface Props {
		filters: StudentFiltersState;
		onFiltersChange: (filters: StudentFiltersState) => void;
		onExportReports: () => void;
	}

	let { filters, onFiltersChange, onExportReports }: Props = $props();

	// Extract levelRange as typed tuple to avoid TS indexing errors
	let levelRange = $derived(
		filters.levelRange as unknown as [number, number],
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

	function handleLevelChange(value: number[]) {
		if (value[0] !== levelRange[0] || value[1] !== levelRange[1]) {
			onFiltersChange({
				districts: filters.districts,
				faculties: filters.faculties,
				levelRange: [value[0], value[1]] as [number, number],
				schoolType: filters.schoolType,
			});
		}
	}

	function toggleSchoolType() {
		onFiltersChange({
			...filters,
			schoolType:
				filters.schoolType === "highSchool" ? "all" : "highSchool",
		});
	}
</script>

<Sidebar.Header
	class="border-b items-center flex-row border-b-gray-300 bg-[#fafafb] px-6 py-6"
>
	<FilterIcon class="h-4 w-4 text-black" />
	<span class="text-sm font-normal text-black">Student Analytics Filters</span
	>
</Sidebar.Header>

<Sidebar.Content class="bg-[#fafafb] px-6">
	<!-- District Section -->
	<Sidebar.Group>
		<Sidebar.GroupLabel
			class="text-xs font-medium uppercase tracking-wide text-gray-500"
		>
			District
		</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="space-y-3 pt-2">
			{#each DISTRICTS as district, index (index)}
				<div class="flex items-center gap-2">
					<Checkbox
						id="district-{district}"
						checked={filters.districts.includes(district)}
						onCheckedChange={() => toggleDistrict(district)}
					/>
					<Label
						for="district-{district}"
						class="text-sm font-normal leading-0 text-black cursor-pointer"
					>
						{district}
					</Label>
				</div>
			{/each}
		</Sidebar.GroupContent>
	</Sidebar.Group>

	<!-- Faculty Section -->
	<Sidebar.Group>
		<Sidebar.GroupLabel
			class="text-xs font-medium uppercase tracking-wide text-gray-500"
		>
			Faculty
		</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="space-y-3 pt-2">
			{#each FACULTIES as faculty, index (index)}
				<div class="flex items-center gap-2">
					<Checkbox
						id="faculty-{index}"
						checked={filters.faculties.includes(faculty)}
						onCheckedChange={() => toggleFaculty(faculty)}
					/>
					<Label
						for="faculty-{index}"
						class="text-sm font-normal leading-0 text-black cursor-pointer"
					>
						{faculty}
					</Label>
				</div>
			{/each}
		</Sidebar.GroupContent>
	</Sidebar.Group>

	<!-- Target Level Section -->
	<Sidebar.Group>
		<Sidebar.GroupLabel
			class="text-xs font-medium uppercase tracking-wide text-gray-500"
		>
			Target Level
		</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="pt-2 px-1">
			<Slider
				type="multiple"
				bind:value={levelRange}
				onValueChange={handleLevelChange}
				min={1}
				max={5}
				step={1}
				class="w-full **:data-[slot=slider-track]:bg-[#b5d0f1]  **:data-[slot=slider-range]:bg-secondary"
			/>
			<div class="mt-3 flex justify-between text-xs text-gray-500">
				{#each LEVELS as level, index (index)}
					{@const levelNum = parseInt(level.replace("L", ""))}
					<span
						class={levelNum >= levelRange[0] &&
						levelNum <= levelRange[1]
							? "text-primary font-medium"
							: ""}
					>
						{level}
					</span>
				{/each}
			</div>
		</Sidebar.GroupContent>
	</Sidebar.Group>

	<!-- School Type Section -->
	<Sidebar.Group>
		<Sidebar.GroupLabel
			class="text-xs font-semibold uppercase tracking-wide text-gray-500"
		>
			School Type
		</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="pt-2">
			<button
				type="button"
				onclick={toggleSchoolType}
				class="flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors {filters.schoolType ===
				'highSchool'
					? 'border-primary bg-blue-50 text-primary'
					: 'border-gray-200 text-gray-700 hover:bg-gray-50'}"
			>
				<Building2Icon class="h-4 w-4" />
				High School Only
			</button>
		</Sidebar.GroupContent>
	</Sidebar.Group>
</Sidebar.Content>

<!-- <Sidebar.Footer class="border-t border-gray-100">
	<Button
		variant="outline"
		class="w-full justify-start gap-2"
		onclick={onExportReports}
	>
		<DownloadIcon class="h-4 w-4" />
		Export Reports
	</Button>
</Sidebar.Footer> -->
