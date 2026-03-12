<script lang="ts">
	import BookOpenIcon from "@lucide/svelte/icons/book-open";
	import TargetIcon from "@lucide/svelte/icons/target";
	import UsersIcon from "@lucide/svelte/icons/users";
	import Building2Icon from "@lucide/svelte/icons/building-2";
	import DownloadIcon from "@lucide/svelte/icons/download";
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";
	import { Button } from "$lib/components/ui/button";
	import { Card, CardContent } from "$lib/components/ui/card";
	import StatsCard from "$lib/components/dashboard/StatsCard.svelte";
	import EnrollmentByTradeChart from "$lib/components/curricula/EnrollmentByTradeChart.svelte";
	import DistrictDistributionChart from "$lib/components/curricula/DistrictDistributionChart.svelte";
	import CourseCatalogTable from "$lib/components/curricula/CourseCatalogTable.svelte";
	import type {
		Course,
		EnrollmentByTradeData,
		DistrictDistributionData,
	} from "$lib/components/curricula/types.js";
	import {
		TRADE_COLORS,
		DISTRICT_COLORS,
	} from "$lib/components/curricula/types.js";

	// Stats cards data - 4 cards as shown in design
	const statsCards = [
		{
			title: "Total Courses",
			value: "482",
			change: "+12%",
			changeType: "positive" as const,
			icon: BookOpenIcon,
		},
		{
			title: "Avg. Success Rate",
			value: "87.4%",
			change: "+2.4%",
			changeType: "positive" as const,
			icon: TargetIcon,
		},
		{
			title: "Total Enrollment",
			value: "12,840",
			change: "+5.1%",
			changeType: "positive" as const,
			icon: UsersIcon,
		},
		{
			title: "Partner Schools",
			value: "34",
			change: "Stable",
			changeType: "neutral" as const,
			icon: Building2Icon,
		},
	];

	// Enrollment by trade chart data
	const enrollmentByTradeData: EnrollmentByTradeData[] = [
		{ trade: "Software", enrollment: 480, color: TRADE_COLORS.Software },
		{ trade: "Mechanics", enrollment: 380, color: TRADE_COLORS.Mechanics },
		{
			trade: "Automobile",
			enrollment: 320,
			color: TRADE_COLORS.Automobile,
		},
		{ trade: "Tourism", enrollment: 520, color: TRADE_COLORS.Tourism },
		{
			trade: "Electrical",
			enrollment: 420,
			color: TRADE_COLORS.Electrical,
		},
		{
			trade: "Road Construction",
			enrollment: 280,
			color: TRADE_COLORS["Road Construction"],
		},
	];

	// District distribution chart data
	const districtDistributionData: DistrictDistributionData[] = [
		{
			district: "Kicukiro",
			value: 4494,
			percentage: 35,
			color: DISTRICT_COLORS.Kicukiro,
		},
		{
			district: "Nyamagabe",
			value: 1926,
			percentage: 15,
			color: DISTRICT_COLORS.Nyamagabe,
		},
		{
			district: "Rubavu",
			value: 2568,
			percentage: 20,
			color: DISTRICT_COLORS.Rubavu,
		},
		{
			district: "Ngororero",
			value: 1284,
			percentage: 10,
			color: DISTRICT_COLORS.Ngororero,
		},
		{
			district: "Gasabo",
			value: 2568,
			percentage: 20,
			color: DISTRICT_COLORS.Gasabo,
		},
	];

	// Sample course data matching the design
	const courses: Course[] = [
		{
			id: 1,
			name: "Advanced Web Apps",
			school: "Kicukiro Technical High School",
			district: "Kicukiro",
			faculty: "Software Development",
			instructor: "John Kayode",
			enrollment: 124,
			successRate: 92,
		},
		{
			id: 2,
			name: "Diesel Engine Tuning",
			school: "Nyamagabe Vocational High School",
			district: "Nyamagabe",
			faculty: "Mechanics",
			instructor: "Sarah Uwase",
			enrollment: 86,
			successRate: 78,
		},
		{
			id: 3,
			name: "Auto-Electrical Systems",
			school: "Rubavu Industrial High School",
			district: "Rubavu",
			faculty: "Automobile",
			instructor: "Mike Rugamba",
			enrollment: 95,
			successRate: 85,
		},
		{
			id: 4,
			name: "Hospitality Management",
			school: "Ngororero Hospitality High School",
			district: "Ngororero",
			faculty: "Tourism",
			instructor: "Alice Mutoni",
			enrollment: 150,
			successRate: 94,
		},
		{
			id: 5,
			name: "Renewable Energy Systems",
			school: "Gasabo Tech High School",
			district: "Gasabo",
			faculty: "Electrical Engineering",
			instructor: "Robert Nkurunziza",
			enrollment: 112,
			successRate: 88,
		},
		{
			id: 6,
			name: "Civil Infrastructure Design",
			school: "Kicukiro Construction High School",
			district: "Kicukiro",
			faculty: "Road Construction",
			instructor: "Jean Bosco",
			enrollment: 74,
			successRate: 82,
		},
		{
			id: 7,
			name: "Mobile App Development",
			school: "Gasabo International High",
			district: "Gasabo",
			faculty: "Software Development",
			instructor: "Eric Tuyisenge",
			enrollment: 145,
			successRate: 91,
		},
		{
			id: 8,
			name: "Automotive Repair",
			school: "Rubavu Maritime School",
			district: "Rubavu",
			faculty: "Mechanics",
			instructor: "Patrick Niyonzima",
			enrollment: 89,
			successRate: 84,
		},
		{
			id: 9,
			name: "Hotel Management",
			school: "Kicukiro STEM Academy",
			district: "Kicukiro",
			faculty: "Tourism",
			instructor: "Grace Mukamana",
			enrollment: 167,
			successRate: 90,
		},
		{
			id: 10,
			name: "Power Systems Engineering",
			school: "Nyamagabe Excellence Academy",
			district: "Nyamagabe",
			faculty: "Electrical Engineering",
			instructor: "David Mutabazi",
			enrollment: 78,
			successRate: 86,
		},
		{
			id: 11,
			name: "Bridge Construction",
			school: "Ngororero Science School",
			district: "Ngororero",
			faculty: "Road Construction",
			instructor: "Claude Ndayisaba",
			enrollment: 65,
			successRate: 79,
		},
		{
			id: 12,
			name: "Vehicle Diagnostics",
			school: "Gasabo Business Academy",
			district: "Gasabo",
			faculty: "Automobile",
			instructor: "Marie Claire Ingabire",
			enrollment: 92,
			successRate: 87,
		},
	];
</script>

<div
	class="w-full max-w-375 px-3 py-4 sm:px-4 bg-white sm:py-6 mb-20 lg:mx-auto lg:px-6"
>
	<!-- Header Section -->
	<div
		class="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between"
	>
		<div>
			<h1 class="text-xl font-inter font-bold text-gray-900 sm:text-3xl">
				Curricula Analytics
			</h1>
			<p class="mt-0.5 text-xs text-primary-gray sm:mt-1 sm:text-sm">
				Detailed performance analysis of technical curricula across High
				Schools.
			</p>
		</div>
		<div class="flex items-center gap-2 sm:gap-3">
			<Button
				variant="outline"
				size="sm"
				class="gap-1.5 bg-white hover:bg-white cursor-pointer text-xs border-[#DEE1E6]! sm:gap-2 sm:text-sm px-3 py-5"
			>
				<DownloadIcon class="h-4 w-4 shrink-0" />
				<span class="font-normal">Download Report</span>
			</Button>
			<Button
				size="sm"
				class="gap-1.5 bg-secondary cursor-pointer text-xs hover:bg-blue-700 sm:gap-2 sm:text-sm px-3 py-5"
			>
				<TrendingUpIcon class="h-4 w-4 shrink-0" />
				<span>Optimize Curriculum</span>
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

	<!-- Charts Section - Bar chart wider, Donut chart narrower (ratio ~60:40) -->
	<div
		class="mb-4 grid grid-cols-1 gap-4 overflow-hidden sm:mb-7 sm:gap-6 lg:grid-cols-[60fr_40fr]"
	>
		<Card
			class="p-5 lg:p-6 border border-gray-200 rounded-xl shadow-sm h-[464px]"
		>
			<CardContent class="p-0 h-full">
				<EnrollmentByTradeChart data={enrollmentByTradeData} />
			</CardContent>
		</Card>
		<Card
			class="p-5 lg:p-6 border border-gray-200 rounded-xl shadow-sm h-[464px]"
		>
			<CardContent class="p-0 h-full">
				<DistrictDistributionChart data={districtDistributionData} />
			</CardContent>
		</Card>
	</div>

	<!-- Course Catalog Table -->
	<div class="min-w-0 overflow-hidden">
		<CourseCatalogTable {courses} />
	</div>
</div>
