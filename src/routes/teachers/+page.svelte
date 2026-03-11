<script lang="ts">
	import UsersIcon from "@lucide/svelte/icons/users";
	import BookOpenIcon from "@lucide/svelte/icons/book-open";
	import HeartIcon from "@lucide/svelte/icons/heart";
	import TargetIcon from "@lucide/svelte/icons/target";
	import FileTextIcon from "@lucide/svelte/icons/file-text";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";
	import { Button } from "$lib/components/ui/button";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import StatsCard from "$lib/components/dashboard/StatsCard.svelte";
	import TeacherFilters from "$lib/components/teachers/TeacherFilters.svelte";
	import StudentAssistanceHeatmap from "$lib/components/teachers/StudentAssistanceHeatmap.svelte";
	import DistrictSuccessChart from "$lib/components/teachers/DistrictSuccessChart.svelte";
	import TeacherRegistryTable from "$lib/components/teachers/TeacherRegistryTable.svelte";
	import type {
		Teacher,
		TeacherFiltersState,
		DistrictSuccess,
	} from "$lib/components/teachers/types.js";

	// Filter state
	let filters = $state<TeacherFiltersState>({
		districts: ["Kicukiro", "Nyamagabe", "Rubavu", "Ngororero", "Gasabo"],
		faculties: [
			"Software development",
			"Mechanics",
			"Automobile",
			"Tourism",
			"Electrical engineering",
			"Road construction",
		],
		successThreshold: [0, 100],
	});

	function handleFiltersChange(newFilters: TeacherFiltersState) {
		filters = newFilters;
	}

	function handleApplyFilters() {
		console.log("Applying filters:", filters);
	}

	function handleExportReports() {
		console.log("Export reports clicked");
	}

	// Stats cards data - 4 cards as shown in design
	const statsCards = [
		{
			title: "Total Teachers",
			value: "1,248",
			change: "+4.2%",
			changeType: "positive" as const,
			icon: UsersIcon,
		},
		{
			title: "Avg. Courses / Teacher",
			value: "3.8",
			change: "-0.5%",
			changeType: "negative" as const,
			icon: BookOpenIcon,
		},
		{
			title: "Total Students Assisted",
			value: "48,290",
			change: "+12%",
			changeType: "positive" as const,
			icon: HeartIcon,
		},
		{
			title: "Overall Success Rate",
			value: "86.5%",
			change: "+2.1%",
			changeType: "positive" as const,
			icon: TargetIcon,
		},
	];

	// District success data
	const districtSuccessData: DistrictSuccess[] = [
		{ district: "Kicukiro", successRate: 92 },
		{ district: "Gasabo", successRate: 89 },
		{ district: "Rubavu", successRate: 85 },
		{ district: "Nyamagabe", successRate: 82 },
		{ district: "Ngororero", successRate: 78 },
	];

	// Sample teacher data
	const teachers: Teacher[] = [
		{
			id: 1,
			name: "Jean-Paul Habimana",
			registeredSince: "2021",
			primaryFaculty: "Software development",
			assignedSchool: "Kicukiro High School",
			district: "Kicukiro",
			students: 120,
			successRate: 94,
		},
		{
			id: 2,
			name: "Marie Claire Uwase",
			registeredSince: "2021",
			primaryFaculty: "Tourism",
			assignedSchool: "Rubavu Technical High",
			district: "Rubavu",
			students: 85,
			successRate: 91,
		},
		{
			id: 3,
			name: "Emmanuel Nkurunziza",
			registeredSince: "2021",
			primaryFaculty: "Mechanics",
			assignedSchool: "Gasabo Science School",
			district: "Gasabo",
			students: 110,
			successRate: 82,
		},
		{
			id: 4,
			name: "Alice Murenzi",
			registeredSince: "2021",
			primaryFaculty: "Electrical engineering",
			assignedSchool: "Nyamagabe Vocational",
			district: "Nyamagabe",
			students: 95,
			successRate: 88,
		},
		{
			id: 5,
			name: "David Rugamba",
			registeredSince: "2021",
			primaryFaculty: "Road construction",
			assignedSchool: "Ngororero High School",
			district: "Ngororero",
			students: 105,
			successRate: 79,
		},
		{
			id: 6,
			name: "Claudine Mukamana",
			registeredSince: "2020",
			primaryFaculty: "Software development",
			assignedSchool: "Gasabo Technical",
			district: "Gasabo",
			students: 98,
			successRate: 92,
		},
		{
			id: 7,
			name: "Patrick Niyonzima",
			registeredSince: "2022",
			primaryFaculty: "Automobile",
			assignedSchool: "Kicukiro Vocational",
			district: "Kicukiro",
			students: 75,
			successRate: 85,
		},
		{
			id: 8,
			name: "Grace Uwimana",
			registeredSince: "2020",
			primaryFaculty: "Tourism",
			assignedSchool: "Nyamagabe High School",
			district: "Nyamagabe",
			students: 130,
			successRate: 90,
		},
		{
			id: 9,
			name: "Felix Ndayisaba",
			registeredSince: "2021",
			primaryFaculty: "Mechanics",
			assignedSchool: "Rubavu Technical",
			district: "Rubavu",
			students: 88,
			successRate: 77,
		},
		{
			id: 10,
			name: "Sandra Ingabire",
			registeredSince: "2019",
			primaryFaculty: "Electrical engineering",
			assignedSchool: "Ngororero Vocational",
			district: "Ngororero",
			students: 112,
			successRate: 86,
		},
		{
			id: 11,
			name: "Eric Mugabo",
			registeredSince: "2022",
			primaryFaculty: "Road construction",
			assignedSchool: "Kicukiro Technical",
			district: "Kicukiro",
			students: 92,
			successRate: 81,
		},
		{
			id: 12,
			name: "Rose Mukeshimana",
			registeredSince: "2020",
			primaryFaculty: "Software development",
			assignedSchool: "Rubavu High School",
			district: "Rubavu",
			students: 105,
			successRate: 93,
		},
	];
</script>

<div class="w-full max-w-[100vw] overflow-x-hidden">
	<Sidebar.Provider>
		<Sidebar.Root
			side="left"
			class="border-r border-r-gray-200 bg-[#fafafb]! mt-16 h-[calc(100vh-4rem-3.5rem)]"
		>
			<TeacherFilters
				{filters}
				onFiltersChange={handleFiltersChange}
				onApplyFilters={handleApplyFilters}
				onExportReports={handleExportReports}
			/>
		</Sidebar.Root>

		<Sidebar.Inset class="overflow-x-hidden bg-[#fdfdfe]!">
			<div
				class="w-full max-w-7xl px-3 py-4 sm:px-4 sm:py-6 mb-20 lg:mx-auto lg:px-6"
			>
				<!-- Header Section -->
				<div
					class="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between"
				>
					<div class="flex items-center gap-2 sm:gap-3">
						<Sidebar.Trigger class="md:hidden" />
						<div>
							<h1
								class="text-xl font-bold text-gray-900 sm:text-2xl"
							>
								Teachers Analytics
							</h1>
							<p
								class="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm"
							>
								Monitoring faculty performance across Rwandan
								High Schools
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2 sm:gap-3">
						<Button
							variant="outline"
							size="sm"
							class="gap-1.5 text-xs sm:gap-2 sm:text-sm px-3 py-5"
						>
							<FileTextIcon class="h-4 w-4 shrink-0" />
							<span class="font-normal">Report</span>
						</Button>
						<Button
							size="sm"
							class="gap-1.5 bg-primary text-xs hover:bg-blue-700 sm:gap-2 sm:text-sm px-3 py-5"
						>
							<SparklesIcon class="h-4 w-4 shrink-0" />
							<span>Verify List</span>
						</Button>
					</div>
				</div>

				<!-- Stats Cards - 4 cards -->
				<div
					class="mb-4 grid grid-cols-2 gap-3 overflow-hidden sm:mb-7 sm:gap-4 lg:grid-cols-4 lg:gap-6"
				>
					{#each statsCards as card, index (index)}
						<StatsCard
							title={card.title}
							value={card.value}
							change={card.change}
							changeType={card.changeType}
							icon={card.icon}
						/>
					{/each}
				</div>

				<!-- Charts Section -->
				<div
					class="mb-4 grid grid-cols-1 gap-4 overflow-hidden sm:mb-7 sm:gap-6 lg:grid-cols-3"
				>
					<div class="min-w-0 lg:col-span-2">
						<StudentAssistanceHeatmap />
					</div>
					<div class="min-w-0">
						<DistrictSuccessChart data={districtSuccessData} />
					</div>
				</div>

				<!-- Teacher Registry Table -->
				<div class="min-w-0 overflow-hidden">
					<TeacherRegistryTable
						{teachers}
						totalCount={teachers.length}
					/>
				</div>
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</div>
