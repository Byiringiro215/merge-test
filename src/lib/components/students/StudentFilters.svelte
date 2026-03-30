<script lang="ts">
	import FilterIcon from "@lucide/svelte/icons/filter";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Button } from "$lib/components/ui/button";
	import {
		genders,
		sdmsStatuses,
		type Gender,
		type SDMSStudentStatus,
		type StudentFiltersState,
	} from "$lib/datamodel/student.js";

	interface Props {
		filters: StudentFiltersState;
		onFiltersChange: (filters: StudentFiltersState) => void;
	}

	let { filters, onFiltersChange }: Props = $props();

	// Local state for inputs (mutable) - use $state, not $derived
	let schoolCode = $derived(filters.schoolCode);
	let classGroup = $derived(filters.classGroup);
	let selectedGender = $derived<Gender | "">(filters.gender);
	let selectedStatus = $derived<SDMSStudentStatus | "">(filters.status);

	// Apply filters
	const applyFilters = () => {
		onFiltersChange({
			schoolCode: schoolCode.trim().toUpperCase(),
			classGroup: classGroup.toUpperCase(),
			gender: selectedGender.toUpperCase() as Gender,
			status: selectedStatus.toUpperCase() as SDMSStudentStatus,
		});
	};

	// Clear all filters
	const clearFilters = () => {
		schoolCode = "";
		classGroup = "";
		selectedGender = "";
		selectedStatus = "";
		onFiltersChange({
			schoolCode: "",
			classGroup: "",
			gender: "",
			status: "",
		});
	};

	// Check if any filter is active
	let hasActiveFilters = $derived(
		schoolCode.trim() !== "" ||
			classGroup.trim() !== "" ||
			selectedGender !== "" ||
			selectedStatus !== "",
	);

	// Handle gender selection
	function toggleGender(gender: Gender) {
		selectedGender = selectedGender === gender ? "" : gender;
	}

	// Handle status selection
	function toggleStatus(status: SDMSStudentStatus) {
		selectedStatus = selectedStatus === status ? "" : status;
	}
</script>

<Sidebar.Header
	class="border-b items-center flex-row border-b-gray-300 bg-[#fafafb] px-6 py-6 "
>
	<FilterIcon class="h-4 w-4 text-primary-black" />
	<span class="text-sm font-semibold leading-5 text-primary-black capitalize"
		>student Analytics filters
	</span>
</Sidebar.Header>

<Sidebar.Content class="bg-[#fafafb] px-6 mt-3">
	<!-- School Code Section -->
	<Sidebar.Group>
		<Sidebar.GroupLabel
			class="text-xs font-inter font-medium uppercase leading-4 tracking-[0.6px] text-gray-500"
		>
			School Code
		</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="pt-1">
			<Input
				type="text"
				placeholder="Enter school code..."
				bind:value={schoolCode}
				class="h-9 border-gray-300 placeholder:text-xs rounded-[6px] focus-visible:ring-1 uppercase"
			/>
		</Sidebar.GroupContent>
	</Sidebar.Group>

	<!-- Class Group Section -->
	<Sidebar.Group>
		<Sidebar.GroupLabel
			class="text-xs font-inter font-medium uppercase leading-4 tracking-[0.6px] text-gray-500"
		>
			Class Group
		</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="pt-1">
			<Input
				type="text"
				placeholder="Enter class group..."
				bind:value={classGroup}
				class="h-9 border-gray-300 placeholder:text-xs rounded-[6px] focus-visible:ring-1 uppercase"
			/>
		</Sidebar.GroupContent>
	</Sidebar.Group>

	<!-- Gender Section -->
	<Sidebar.Group>
		<Sidebar.GroupLabel
			class="text-xs font-inter font-medium uppercase leading-4 tracking-[0.6px] text-gray-500"
		>
			Gender
		</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="space-y-3 pt-1">
			{#each genders as gender (gender)}
				<div class="flex items-center gap-2">
					<Checkbox
						id="gender-{gender}"
						checked={selectedGender === gender}
						onCheckedChange={() => toggleGender(gender)}
					/>
					<Label
						for="gender-{gender}"
						class="text-sm font-normal leading-0 text-black cursor-pointer uppercase"
					>
						{gender}
					</Label>
				</div>
			{/each}
		</Sidebar.GroupContent>
	</Sidebar.Group>

	<!-- Status Section -->
	<Sidebar.Group>
		<Sidebar.GroupLabel
			class="text-xs font-inter font-medium uppercase leading-4 tracking-[0.6px] text-gray-500"
		>
			Status
		</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="space-y-3 pt-1">
			{#each sdmsStatuses as status (status)}
				<div class="flex items-center gap-2">
					<Checkbox
						id="status-{status}"
						checked={selectedStatus === status}
						onCheckedChange={() => toggleStatus(status)}
					/>
					<Label
						for="status-{status}"
						class="text-sm font-normal leading-0 text-black cursor-pointer"
					>
						{status}
					</Label>
				</div>
			{/each}
		</Sidebar.GroupContent>
	</Sidebar.Group>

	<!-- Action Buttons -->
	<Sidebar.Group>
		<Sidebar.GroupContent class="flex flex-col gap-2 pt-4">
			<Button
				onclick={applyFilters}
				disabled={!hasActiveFilters}
				class="w-full disabled:opacity-70 rounded-[6px]"
				>Apply Filters</Button
			>
			{#if hasActiveFilters}
				<Button
					variant="outline"
					onclick={clearFilters}
					class="w-full "
				>
					Clear Filters
				</Button>
			{/if}
		</Sidebar.GroupContent>
	</Sidebar.Group>
</Sidebar.Content>
