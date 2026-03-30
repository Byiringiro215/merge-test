<script lang="ts">
	import FilterIcon from "@lucide/svelte/icons/filter";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Button } from "$lib/components/ui/button";
	import {
		staffGenders,
		type StaffGender,
		type StaffFiltersState,
	} from "$lib/datamodel/staff.js";

	interface Props {
		filters: StaffFiltersState;
		onFiltersChange: (filters: StaffFiltersState) => void;
	}

	let { filters, onFiltersChange }: Props = $props();

	// Local state for inputs (mutable)
	let schoolCode = $derived(filters.schoolCode);
	let position = $derived(filters.position);
	let selectedGender = $derived<StaffGender | "">(filters.gender);

	// Apply filters
	const applyFilters = () => {
		onFiltersChange({
			schoolCode: schoolCode.trim().toUpperCase(),
			position: position.trim().toUpperCase(),
			gender: selectedGender,
		});
	};

	// Clear all filters
	const clearFilters = () => {
		schoolCode = "";
		position = "";
		selectedGender = "";
		onFiltersChange({
			schoolCode: "",
			position: "",
			gender: "",
		});
	};

	// Check if any filter is active
	let hasActiveFilters = $derived(
		schoolCode.trim() !== "" ||
			position.trim() !== "" ||
			selectedGender !== "",
	);

	// Handle gender selection
	function toggleGender(gender: StaffGender) {
		selectedGender = selectedGender === gender ? "" : gender;
	}
</script>

<Sidebar.Header
	class="border-b items-center flex-row border-b-gray-300 bg-[#fafafb] px-6 py-6"
>
	<FilterIcon class="h-4 w-4 text-primary-black" />
	<span class="text-sm font-semibold leading-5 text-primary-black capitalize"
		>Teacher Analytics Filters
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

	<!-- Position Section -->
	<Sidebar.Group>
		<Sidebar.GroupLabel
			class="text-xs font-inter font-medium uppercase leading-4 tracking-[0.6px] text-gray-500"
		>
			Position
		</Sidebar.GroupLabel>
		<Sidebar.GroupContent class="pt-1">
			<Input
				type="text"
				placeholder="Enter position..."
				bind:value={position}
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
			{#each staffGenders as gender (gender)}
				<div class="flex items-center gap-2">
					<Checkbox
						id="staff-gender-{gender}"
						checked={selectedGender === gender}
						onCheckedChange={() => toggleGender(gender)}
					/>
					<Label
						for="staff-gender-{gender}"
						class="text-sm font-normal leading-0 text-black cursor-pointer uppercase"
					>
						{gender}
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
				<Button variant="outline" onclick={clearFilters} class="w-full">
					Clear Filters
				</Button>
			{/if}
		</Sidebar.GroupContent>
	</Sidebar.Group>
</Sidebar.Content>
