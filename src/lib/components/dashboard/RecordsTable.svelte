<script lang="ts">
	import { Card, CardContent } from "$lib/components/ui/card";
	import {
		Table,
		TableHeader,
		TableBody,
		TableRow,
		TableHead,
		TableCell,
	} from "$lib/components/ui/table";
	import { Input } from "$lib/components/ui/input";
	import {
		Search,
		ExternalLink,
		MoreHorizontal,
		ChevronLeft,
		ChevronRight,
		Eye,
		Pencil,
		Trash2,
	} from "@lucide/svelte";

	interface SchoolRecord {
		id: number;
		name: string;
		district: string;
		faculty: string;
		facultyColor: string;
		activeStudents: number;
		successRate: number;
		status: "High" | "Stable" | "Action Required";
	}

	const records: SchoolRecord[] = [
		{
			id: 1,
			name: "Kicukiro Tech High",
			district: "Kicukiro",
			faculty: "Software development",
			facultyColor: "bg-green-100 text-green-700",
			activeStudents: 124,
			successRate: 94,
			status: "High",
		},
		{
			id: 2,
			name: "Gasabo Vocational",
			district: "Gasabo",
			faculty: "Mechanics",
			facultyColor: "bg-blue-100 text-blue-700",
			activeStudents: 89,
			successRate: 82,
			status: "Stable",
		},
		{
			id: 3,
			name: "Rubavu Excellence",
			district: "Rubavu",
			faculty: "Tourism",
			facultyColor: "bg-purple-100 text-purple-700",
			activeStudents: 156,
			successRate: 88,
			status: "High",
		},
		{
			id: 4,
			name: "Nyamagabe Technical",
			district: "Nyamagabe",
			faculty: "Electrical engineering",
			facultyColor: "bg-yellow-100 text-yellow-700",
			activeStudents: 72,
			successRate: 75,
			status: "Stable",
		},
		{
			id: 5,
			name: "Ngororero Road Inst.",
			district: "Ngororero",
			faculty: "Road construction",
			facultyColor: "bg-orange-100 text-orange-700",
			activeStudents: 45,
			successRate: 68,
			status: "Action Required",
		},
		{
			id: 6,
			name: "Gasabo Auto Academy",
			district: "Gasabo",
			faculty: "Automobile",
			facultyColor: "bg-cyan-100 text-cyan-700",
			activeStudents: 110,
			successRate: 91,
			status: "High",
		},
	];

	const statusColors = {
		High: "text-green-600",
		Stable: "text-blue-600",
		"Action Required": "text-red-600",
	};

	const statusDotColors = {
		High: "bg-green-500",
		Stable: "bg-blue-500",
		"Action Required": "bg-red-500",
	};

	let searchQuery = $state("");
	let currentPage = $state(1);
	let openDropdown = $state<number | null>(null);
	const totalResults = 51;
	const perPage = 6;
	const totalPages = Math.ceil(totalResults / perPage);

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	function toggleDropdown(id: number) {
		openDropdown = openDropdown === id ? null : id;
	}

	function closeDropdown() {
		openDropdown = null;
	}

	function handleAction(action: string, record: SchoolRecord) {
		console.log(`${action} action for:`, record.name);
		closeDropdown();
		// You can add actual navigation or modal logic here
	}

	function handleView(record: SchoolRecord) {
		console.log("Viewing:", record.name);
		// Navigate to school detail page
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest("[data-dropdown]")) {
			closeDropdown();
		}
	}

	$effect(() => {
		if (openDropdown !== null) {
			document.addEventListener("click", handleClickOutside);
			return () =>
				document.removeEventListener("click", handleClickOutside);
		}
	});

	// Filter records based on search
	let filteredRecords = $derived(
		searchQuery
			? records.filter(
					(r) =>
						r.name
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						r.district
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						r.faculty
							.toLowerCase()
							.includes(searchQuery.toLowerCase()),
				)
			: records,
	);
</script>

<div
	class="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
>
	<div>
		<h2 class="text-2xl font-medium text-gray-900">
			Recent Performance Records
		</h2>
		<p class="mt-1 text-sm text-gray-500">
			Detailed breakdown of the most recent data entries from individual
			schools.
		</p>
	</div>
	<div class="relative w-full sm:w-72">
		<Search
			class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
		/>
		<Input
			type="text"
			placeholder="Search high schools or districts..."
			bind:value={searchQuery}
			class="pl-9"
		/>
	</div>
</div>

<Card>
	<CardContent class="p-0">
		<div class="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow class="border-gray-200 hover:bg-transparent">
						<TableHead>High School Name</TableHead>
						<TableHead>District</TableHead>
						<TableHead>Primary Faculty</TableHead>
						<TableHead class="text-center"
							>Active Students</TableHead
						>
						<TableHead class="text-center">Success Rate</TableHead>
						<TableHead>Performance Status</TableHead>
						<TableHead class="text-center">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{#each filteredRecords as record, i (i)}
						<TableRow class="group">
							<TableCell class="font-medium">
								<button
									onclick={() => handleView(record)}
									class="text-left transition-colors hover:text-blue-600"
								>
									{record.name}
								</button>
							</TableCell>
							<TableCell class="text-gray-600"
								>{record.district}</TableCell
							>
							<TableCell>
								<span
									class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-[#9bc3e8]/20 text-[#205fad] border border-[#8db9e2]"
								>
									{record.faculty}
								</span>
							</TableCell>
							<TableCell class="text-center"
								>{record.activeStudents}</TableCell
							>
							<TableCell class="text-center">
								<span class="font-medium text-green-600"
									>{record.successRate}%</span
								>
							</TableCell>
							<TableCell>
								<div class="flex items-center gap-2">
									<span
										class="h-2 w-2 rounded-full {statusDotColors[
											record.status
										]}"
									></span>
									<span class={statusColors[record.status]}
										>{record.status}</span
									>
								</div>
							</TableCell>
							<TableCell>
								<div
									class="flex items-center justify-center gap-1"
								>
									<button
										onclick={() => handleView(record)}
										class="rounded p-1.5 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
										title="View details"
									>
										<ExternalLink class="h-4 w-4" />
									</button>
									<div class="relative" data-dropdown>
										<button
											onclick={(e) => {
												e.stopPropagation();
												toggleDropdown(record.id);
											}}
											class="rounded p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 {openDropdown ===
											record.id
												? 'bg-gray-100 text-gray-600'
												: ''}"
											title="More options"
										>
											<MoreHorizontal class="h-4 w-4" />
										</button>

										{#if openDropdown === record.id}
											<div
												class="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
												onclick={(e) =>
													e.stopPropagation()}
											>
												<button
													onclick={() =>
														handleAction(
															"view",
															record,
														)}
													class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
												>
													<Eye class="h-4 w-4" />
													View Details
												</button>
												<button
													onclick={() =>
														handleAction(
															"edit",
															record,
														)}
													class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
												>
													<Pencil class="h-4 w-4" />
													Edit Record
												</button>
												<hr
													class="my-1 border-gray-100"
												/>
												<button
													onclick={() =>
														handleAction(
															"delete",
															record,
														)}
													class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50"
												>
													<Trash2 class="h-4 w-4" />
													Delete
												</button>
											</div>
										{/if}
									</div>
								</div>
							</TableCell>
						</TableRow>
					{/each}
				</TableBody>
			</Table>
		</div>

		<!-- Pagination -->
		<div
			class="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 px-6 py-4"
		>
			<p class="text-sm text-gray-500">
				Showing 1 to {perPage} of {totalResults} results
			</p>
			<div class="flex items-center gap-1">
				<button
					onclick={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
					class="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<ChevronLeft class="h-4 w-4" />
				</button>
				{#each Array(Math.min(3, totalPages)) as _, i (i)}
					<button
						onclick={() => goToPage(i + 1)}
						class="flex h-8 w-8 items-center justify-center rounded border text-sm font-medium transition-colors {currentPage ===
						i + 1
							? 'border-blue-600 bg-blue-600 text-white'
							: 'border-gray-200 text-gray-700 hover:bg-gray-50'}"
					>
						{i + 1}
					</button>
				{/each}
				<button
					onclick={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					class="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-500 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<ChevronRight class="h-4 w-4" />
				</button>
			</div>
		</div>
	</CardContent>
</Card>
