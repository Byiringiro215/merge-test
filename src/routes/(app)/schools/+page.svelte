<script lang="ts">
	import Building2Icon from "@lucide/svelte/icons/building-2";
	import CircleCheckIcon from "@lucide/svelte/icons/circle-check";
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
	import BookOpenIcon from "@lucide/svelte/icons/book-open";
	import BarChart3Icon from "@lucide/svelte/icons/bar-chart-3";
	import CircleCheckBigIcon from "@lucide/svelte/icons/circle-check-big";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent } from "$lib/components/ui/card";
	import StatsCard from "$lib/components/dashboard/StatsCard.svelte";
	import SchoolsDistributionChart from "$lib/components/schools/SchoolsDistributionChart.svelte";
	import EnrollmentTrendChart from "$lib/components/schools/EnrollmentTrendChart.svelte";
	import SchoolsRegistryTable from "$lib/components/schools/SchoolsRegistryTable.svelte";
	import type {
		School,
		DistributionData,
		EnrollmentData,
	} from "$lib/components/schools/types.js";

	// Stats cards data - 4 cards as shown in design
	const statsCards = [
		{
			title: "Total High Schools",
			value: "52",
			change: "+3.2%",
			changeType: "positive" as const,
			icon: Building2Icon,
		},
		{
			title: "Active Schools",
			value: "48",
			change: "+1.5%",
			changeType: "positive" as const,
			icon: CircleCheckIcon,
		},
		{
			title: "Avg. Success Rate",
			value: "87.4%",
			change: "+2.1%",
			changeType: "positive" as const,
			icon: TrendingUpIcon,
		},
		{
			title: "Enrolled Students",
			value: "15.2k",
			change: "+8.4%",
			changeType: "positive" as const,
			icon: BookOpenIcon,
		},
	];

	// Distribution chart data
	const distributionData: DistributionData[] = [
		{ district: "Kicukiro", active: 10, inactive: 4 },
		{ district: "Nyamagabe", active: 8, inactive: 3 },
		{ district: "Rubavu", active: 11, inactive: 2 },
		{ district: "Ngororero", active: 9, inactive: 3 },
		{ district: "Gasabo", active: 14, inactive: 2 },
	];

	// Enrollment trend data
	const enrollmentData: EnrollmentData[] = [
		{ district: "Kicukiro", students: 4200 },
		{ district: "Nyamagabe", students: 3100 },
		{ district: "Rubavu", students: 2800 },
		{ district: "Ngororero", students: 2200 },
		{ district: "Gasabo", students: 5100 },
	];

	// Sample school data
	const schools: School[] = [
		{
			id: 1,
			name: "Kicukiro Technical High School",
			district: "Kicukiro",
			status: "Active",
			faculties: 6,
			students: 1240,
			successRate: 92,
		},
		{
			id: 2,
			name: "Nyamagabe Excellence Academy",
			district: "Nyamagabe",
			status: "Active",
			faculties: 4,
			students: 850,
			successRate: 88,
		},
		{
			id: 3,
			name: "Rubavu Vocational High",
			district: "Rubavu",
			status: "Active",
			faculties: 6,
			students: 1100,
			successRate: 85,
		},
		{
			id: 4,
			name: "Ngororero Science School",
			district: "Ngororero",
			status: "Inactive",
			faculties: 3,
			students: 420,
			successRate: 74,
		},
		{
			id: 5,
			name: "Gasabo International High",
			district: "Gasabo",
			status: "Active",
			faculties: 6,
			students: 1560,
			successRate: 95,
		},
		{
			id: 6,
			name: "Kicukiro STEM Academy",
			district: "Kicukiro",
			status: "Active",
			faculties: 5,
			students: 980,
			successRate: 89,
		},
		{
			id: 7,
			name: "Nyamagabe Technical Institute",
			district: "Nyamagabe",
			status: "Active",
			faculties: 4,
			students: 720,
			successRate: 82,
		},
		{
			id: 8,
			name: "Rubavu Maritime School",
			district: "Rubavu",
			status: "Active",
			faculties: 3,
			students: 540,
			successRate: 78,
		},
		{
			id: 9,
			name: "Ngororero Agricultural High",
			district: "Ngororero",
			status: "Active",
			faculties: 4,
			students: 680,
			successRate: 81,
		},
		{
			id: 10,
			name: "Gasabo Business Academy",
			district: "Gasabo",
			status: "Active",
			faculties: 5,
			students: 1120,
			successRate: 91,
		},
		{
			id: 11,
			name: "Kicukiro Arts & Design",
			district: "Kicukiro",
			status: "Inactive",
			faculties: 3,
			students: 320,
			successRate: 72,
		},
		{
			id: 12,
			name: "Gasabo Science High",
			district: "Gasabo",
			status: "Active",
			faculties: 6,
			students: 1340,
			successRate: 94,
		},
	];
</script>

<!-- <div class="w-full max-w-[100vw] overflow-x-hidden"> -->
<div
	class="w-full max-w-375 px-3 py-4 sm:px-4 bg-white sm:py-6 mb-20 lg:mx-auto lg:px-6"
>
	<!-- Header Section -->
	<div
		class="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<h1 class="text-xl font-inter font-bold text-gray-900 sm:text-3xl">
				Schools Analytics
			</h1>
			<p class="mt-0.5 text-xs text-primary-gray sm:mt-1 sm:text-sm">
				Performance monitoring for High Schools across prioritized
				districts.
			</p>
		</div>
		<div class="flex items-center gap-2 sm:gap-3">
			<Button
				variant="outline"
				size="sm"
				class="gap-1.5 text-xs sm:gap-2 sm:text-sm px-3 py-5"
			>
				<BarChart3Icon class="h-4 w-4 shrink-0" />
				<span class="font-normal">Regional Compare</span>
			</Button>
			<Button
				size="sm"
				class="gap-1.5 bg-primary text-xs hover:bg-blue-700 sm:gap-2 sm:text-sm px-3 py-5"
			>
				<CircleCheckBigIcon class="h-4 w-4 shrink-0" />
				<span>Audit Status</span>
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

	<!-- Charts Section - 2 charts side by side -->
	<div
		class="mb-4 grid grid-cols-1 gap-4 overflow-hidden sm:mb-7 sm:gap-6 lg:grid-cols-2"
	>
		<Card class="p-4 lg:p-6 border-none! shadow-none!">
			<CardContent class="p-0 ">
				<SchoolsDistributionChart data={distributionData} />
			</CardContent>
		</Card>
		<Card class="p-4 lg:p-6 border-none! shadow-none!">
			<CardContent class="p-0">
				<EnrollmentTrendChart data={enrollmentData} />
			</CardContent>
		</Card>
	</div>

	<!-- Schools Registry Table -->
	<div class="min-w-0 overflow-hidden">
		<SchoolsRegistryTable {schools} />
	</div>
</div>
<!-- </div> -->
