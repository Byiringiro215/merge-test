<script lang="ts">
	import UsersIcon from "@lucide/svelte/icons/users";
	import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
	import CircleXIcon from "@lucide/svelte/icons/circle-x";
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
	import Building2Icon from "@lucide/svelte/icons/building-2";
	import FileTextIcon from "@lucide/svelte/icons/file-text";
	import UserPlusIcon from "@lucide/svelte/icons/user-plus";
	import { Button } from "$lib/components/ui/button";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import StatsCard from "$lib/components/dashboard/StatsCard.svelte";
	import StudentFilters from "$lib/components/students/StudentFilters.svelte";
	import ScoreDistributionChart from "$lib/components/students/ScoreDistributionChart.svelte";
	import FacultyEnrollmentChart from "$lib/components/students/FacultyEnrollmentChart.svelte";
	import StudentRegistryTable from "$lib/components/students/StudentRegistryTable.svelte";
	import type {
		Student,
		StudentFiltersState,
		ScoreDistribution,
		FacultyEnrollment,
	} from "$lib/components/students/types.js";
	import { FACULTY_COLORS } from "$lib/components/students/types.js";

	// Filter state
	let filters = $state<StudentFiltersState>({
		districts: ["Kicukiro", "Nyamagabe", "Rubavu", "Ngororero", "Gasabo"],
		faculties: [
			"Software development",
			"Mechanics",
			"Automobile",
			"Tourism",
			"Electrical engineering",
			"Road construction",
		],
		levelRange: 3,
		schoolType: "highSchool",
	});

	function handleFiltersChange(newFilters: StudentFiltersState) {
		filters = newFilters;
	}

	function handleExportReports() {
		console.log("Export reports clicked");
	}

	// Stats cards data
	const statsCards = [
		{
			title: "Total Students",
			value: "12,450",
			change: "+12%",
			changeType: "positive" as const,
			icon: UsersIcon,
		},
		{
			title: "Succeeded",
			value: "10,820",
			change: "86%",
			changeType: "positive" as const,
			icon: CircleCheckIcon,
		},
		{
			title: "Failed",
			value: "1,630",
			change: "14%",
			changeType: "negative" as const,
			icon: CircleXIcon,
		},
		{
			title: "Avg Score",
			value: "78.4%",
			change: "+2.5%",
			changeType: "positive" as const,
			icon: TrendingUpIcon,
		},
		{
			title: "High Schools",
			value: "42",
			change: "Active",
			changeType: "neutral" as const,
			icon: Building2Icon,
		},
	];

	// Score distribution data
	const scoreDistributionData: ScoreDistribution[] = [
		{ range: "0-20", count: 450 },
		{ range: "21-40", count: 1100 },
		{ range: "41-60", count: 2500 },
		{ range: "61-80", count: 4200 },
		{ range: "81-100", count: 2800 },
	];

	// Faculty enrollment data
	const facultyEnrollmentData: FacultyEnrollment[] = [
		{
			faculty: "Software development",
			count: 3200,
			color: FACULTY_COLORS["Software development"],
		},
		{
			faculty: "Mechanics",
			count: 2100,
			color: FACULTY_COLORS["Mechanics"],
		},
		{
			faculty: "Automobile",
			count: 1800,
			color: FACULTY_COLORS["Automobile"],
		},
		{ faculty: "Tourism", count: 2400, color: FACULTY_COLORS["Tourism"] },
		{
			faculty: "Electrical engineering",
			count: 1950,
			color: FACULTY_COLORS["Electrical engineering"],
		},
		{
			faculty: "Road construction",
			count: 1000,
			color: FACULTY_COLORS["Road construction"],
		},
	];

	// Sample student data
	const students: Student[] = [
		{
			id: 1,
			name: "Uwase Alice",
			district: "Kicukiro",
			faculty: "Software development",
			level: "L4",
			score: 88,
			status: "Succeeded",
		},
		{
			id: 2,
			name: "Habimana Jean",
			district: "Gasabo",
			faculty: "Mechanics",
			level: "L5",
			score: 72,
			status: "Succeeded",
		},
		{
			id: 3,
			name: "Mugisha Eric",
			district: "Rubavu",
			faculty: "Automobile",
			level: "L3",
			score: 45,
			status: "Failed",
		},
		{
			id: 4,
			name: "Iradukunda Marie",
			district: "Nyamagabe",
			faculty: "Tourism",
			level: "L4",
			score: 94,
			status: "Succeeded",
		},
		{
			id: 5,
			name: "Nsanzimana Paul",
			district: "Ngororero",
			faculty: "Electrical engineering",
			level: "L2",
			score: 61,
			status: "Succeeded",
		},
		{
			id: 6,
			name: "Mukamana Grace",
			district: "Kicukiro",
			faculty: "Road construction",
			level: "L3",
			score: 78,
			status: "Succeeded",
		},
		{
			id: 7,
			name: "Niyonzima Patrick",
			district: "Gasabo",
			faculty: "Software development",
			level: "L4",
			score: 82,
			status: "Succeeded",
		},
		{
			id: 8,
			name: "Uwimana Diane",
			district: "Rubavu",
			faculty: "Tourism",
			level: "L2",
			score: 38,
			status: "Failed",
		},
	];
</script>

<div class="w-full max-w-[100vw] overflow-x-hidden">
	<Sidebar.Provider>
		<Sidebar.Root
			side="left"
			class="border-r border-r-gray-200 bg-[#fafafb]! mt-16"
		>
			<StudentFilters
				{filters}
				onFiltersChange={handleFiltersChange}
				onExportReports={handleExportReports}
			/>
		</Sidebar.Root>

		<Sidebar.Inset class="overflow-x-hidden bg-[#f1f7fe]">
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
								Students Analytics
							</h1>
							<p
								class="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm"
							>
								Deep dive into academic performance and faculty
								trends.
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2 sm:gap-3">
						<Button
							variant="outline"
							size="sm"
							class="gap-1.5 text-xs sm:gap-2 sm:text-sm px-1 py-5"
						>
							<FileTextIcon class="h-4 w-4 shrink-0" />
							<span class="hidden sm:inline font-normal"
								>Generate Report</span
							>
							<span class="sm:hidden">Report</span>
						</Button>
						<Button
							size="sm"
							class="gap-1.5 bg-primary text-xs hover:bg-blue-700 sm:gap-2 sm:text-sm"
						>
							<UserPlusIcon class="h-4 w-4 shrink-0" />
							<span class="hidden sm:inline">Add Student</span>
							<span class="sm:hidden">Add</span>
						</Button>
					</div>
				</div>

				<!-- Stats Cards -->
				<div
					class="mb-4 grid grid-cols-2 gap-3 overflow-hidden sm:mb-7 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-6"
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
						<ScoreDistributionChart data={scoreDistributionData} />
					</div>
					<div class="min-w-0">
						<FacultyEnrollmentChart data={facultyEnrollmentData} />
					</div>
				</div>

				<!-- Student Registry Table -->
				<div class="min-w-0 overflow-hidden">
					<StudentRegistryTable {students} />
				</div>
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
</div>
