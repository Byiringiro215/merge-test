<script lang="ts">
	import { page } from "$app/state";
	import { goto } from "$app/navigation";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardHeader,
		CardTitle,
		CardContent,
	} from "$lib/components/ui/card";
	import { api } from "$lib/api";
	import type { Student } from "$lib/datamodel/student";
	import { studentDetailResponse } from "$lib/types/zod-schemas-api";
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import UserIcon from "@lucide/svelte/icons/user";
	import SchoolIcon from "@lucide/svelte/icons/school";
	import BookOpenIcon from "@lucide/svelte/icons/book-open";
	import UsersIcon from "@lucide/svelte/icons/users";
	import MapPinIcon from "@lucide/svelte/icons/map-pin";
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import PhoneIcon from "@lucide/svelte/icons/phone";
	import BadgeCheckIcon from "@lucide/svelte/icons/badge-check";
	import { onMount } from "svelte";
	import { resolve } from "$app/paths";

	let student = $state<Student | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	const studentNumber = $derived(page.params.studentNumber);

	const fetchStudent = async () => {
		if (!studentNumber) return;
		try {
			isLoading = true;
			error = null;
			const result = await api.get("/sdms/students/{studentNumber}", {
				params: { studentNumber },
				responseSchema: studentDetailResponse,
			}).result();
			if (!result.ok) {
				error = "Failed to fetch student details";
				return;
			}
			student = result.data.data;
		} catch (err) {
			console.error("Fetch error:", err);
			error = "An error occurred while fetching student details";
		} finally {
			isLoading = false;
		}
	};

	onMount(() => {
		fetchStudent();
	});

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "-";
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-GB", {
				day: "numeric",
				month: "long",
				year: "numeric",
			});
		} catch {
			return dateString;
		}
	};

	const getStatusColor = (status: string | null) => {
		switch (status?.toUpperCase()) {
			case "ACTIVE":
				return "bg-green-100 text-green-700";
			case "NEW":
				return "bg-blue-100 text-blue-700";
			case "INACTIVE":
				return "bg-gray-100 text-gray-700";
			case "SUSPENDED":
				return "bg-red-100 text-red-700";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};

	const getGenderColor = (gender: string | null) => {
		switch (gender?.toUpperCase()) {
			case "MALE":
				return "bg-sky-100 text-sky-700";
			case "FEMALE":
				return "bg-pink-100 text-pink-700";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};
</script>

<svelte:head>
	<title>{student?.names ?? "Student Details"} | TDMP</title>
</svelte:head>

<div class="min-h-screen bg-[#f1f7fe] pb-20">
	<div class="w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
		<!-- Back Button -->
		<Button
			variant="ghost"
			class="mb-4 gap-2 text-gray-600 hover:text-gray-900"
			onclick={() => goto(resolve("/students"))}
		>
			<ArrowLeftIcon class="h-4 w-4" />
			Back to Students
		</Button>

		{#if isLoading}
			<div class="flex items-center justify-center py-20">
				<div
					class="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary"
				></div>
			</div>
		{:else if error}
			<Card>
				<CardContent class="py-12">
					<div class="text-center">
						<p class="text-red-500 mb-4">{error}</p>
						<Button onclick={fetchStudent}>Try Again</Button>
					</div>
				</CardContent>
			</Card>
		{:else if student}
			<!-- Header Card -->
			<Card class="mb-6 overflow-hidden">
				<div
					class="bg-linear-to-r from-primary to-blue-600 px-6 py-8 sm:px-8"
				>
					<div
						class="flex flex-col sm:flex-row sm:items-center gap-4"
					>
						<div
							class="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center shrink-0"
						>
							<UserIcon
								class="h-10 w-10 sm:h-12 sm:w-12 text-white"
							/>
						</div>
						<div class="flex-1 min-w-0">
							<h1
								class="text-2xl sm:text-3xl font-bold text-white truncate"
							>
								{student.names}
							</h1>
							<p class="text-blue-100 mt-1 font-mono">
								{student.studentNumber}
							</p>
							<div class="flex flex-wrap gap-2 mt-3">
								<span
									class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium {getStatusColor(
										student.status,
									)}"
								>
									{student.status ?? "Unknown"}
								</span>
								<span
									class="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium {getGenderColor(
										student.gender,
									)}"
								>
									{student.gender ?? "Unknown"}
								</span>
							</div>
						</div>
					</div>
				</div>
			</Card>

			<!-- Info Cards Grid -->
			<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
				<!-- Academic Information -->
				<Card class="p-4 sm:p-6">
					<CardHeader class="pb-3">
						<CardTitle class="flex items-center gap-2 text-lg">
							<SchoolIcon class="h-5 w-5 text-primary" />
							School Information
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									School Name
								</p>
								<p class="font-medium text-gray-900 mt-1">
									{student.schoolName}
								</p>
							</div>
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									School Code
								</p>
								<p class="font-mono text-gray-900 mt-1">
									{student.schoolCode}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Program Information -->
				<Card class="p-4 sm:p-6">
					<CardHeader class="pb-3">
						<CardTitle class="flex items-center gap-2 text-lg">
							<BookOpenIcon class="h-5 w-5 text-primary" />
							Program Details
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4 ">
						<div class="grid grid-cols-2 gap-4">
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									Level
								</p>
								<p class="font-medium text-gray-900 mt-1">
									{student.levelName ?? "-"}
								</p>
							</div>
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									Grade
								</p>
								<p class="font-medium text-gray-900 mt-1">
									{student.gradeName ?? "-"}
								</p>
							</div>
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									Combination
								</p>
								<p class="font-medium text-gray-900 mt-1">
									{student.combinationName ?? "-"}
								</p>
							</div>
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									Class Group
								</p>
								<p class="font-medium text-gray-900 mt-1">
									{student.classGroup ?? "-"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Personal Information -->
				<Card class="p-4 sm:p-6">
					<CardHeader class="pb-3">
						<CardTitle class="flex items-center gap-2 text-lg">
							<CalendarIcon class="h-5 w-5 text-primary" />
							Personal Information
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									Date of Birth
								</p>
								<p class="font-medium text-gray-900 mt-1">
									{formatDate(student.dateOfBirth)}
								</p>
							</div>
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									Academic Year
								</p>
								<p class="font-medium text-gray-900 mt-1">
									{student.currentAcademicYear ?? "-"}
								</p>
							</div>
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									Registration Date
								</p>
								<p class="font-medium text-gray-900 mt-1">
									{formatDate(student.registrationDate)}
								</p>
							</div>
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									Study Level
								</p>
								<p class="font-medium text-gray-900 mt-1">
									{student.studyLevel ?? "-"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Guardian Information -->
				<Card class="p-4 sm:p-6">
					<CardHeader class="pb-3">
						<CardTitle class="flex items-center gap-2 text-lg">
							<UsersIcon class="h-5 w-5 text-primary" />
							Guardian Information
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="grid grid-cols-1 gap-4">
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									Parent/Guardian Name
								</p>
								<p class="font-medium text-gray-900 mt-1">
									{student.parentGuardianName ?? "-"}
								</p>
							</div>
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									National ID
								</p>
								<p class="font-mono text-gray-900 mt-1">
									{student.parentGuardianNationalId ?? "-"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<!-- Contact Information -->
				<Card class="p-4 sm:p-6">
					<CardHeader class="pb-3">
						<CardTitle class="flex items-center gap-2 text-lg">
							<MapPinIcon class="h-5 w-5 text-primary" />
							Contact & Address
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div>
							<p
								class="text-xs text-gray-500 uppercase tracking-wide"
							>
								Address
							</p>
							<p class="font-medium text-gray-900 mt-1">
								{student.address ?? "-"}
							</p>
						</div>
					</CardContent>
				</Card>

				<!-- Emergency Contact -->
				<Card class="p-4 sm:p-6">
					<CardHeader class="pb-3">
						<CardTitle class="flex items-center gap-2 text-lg">
							<PhoneIcon class="h-5 w-5 text-primary" />
							Emergency Contact
						</CardTitle>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									Contact Person
								</p>
								<p class="font-medium text-gray-900 mt-1">
									{student.emergencyContactPerson ?? "-"}
								</p>
							</div>
							<div>
								<p
									class="text-xs text-gray-500 uppercase tracking-wide"
								>
									Phone Number
								</p>
								<p class="font-mono text-gray-900 mt-1">
									{student.emergencyContactNumber ?? "-"}
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<!-- Additional Details Card -->
			{#if student.divisionType || student.weightedPercent || student.inactiveReason}
				<Card class="mt-6">
					<CardHeader class="pb-3">
						<CardTitle class="flex items-center gap-2 text-lg">
							<BadgeCheckIcon class="h-5 w-5 text-primary" />
							Additional Details
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
							{#if student.divisionType}
								<div>
									<p
										class="text-xs text-gray-500 uppercase tracking-wide"
									>
										Division Type
									</p>
									<p class="font-medium text-gray-900 mt-1">
										{student.divisionType}
									</p>
								</div>
							{/if}
							{#if student.weightedPercent !== null}
								<div>
									<p
										class="text-xs text-gray-500 uppercase tracking-wide"
									>
										Weighted Percent
									</p>
									<p class="font-medium text-gray-900 mt-1">
										{student.weightedPercent}%
									</p>
								</div>
							{/if}
							{#if student.inactiveReason}
								<div>
									<p
										class="text-xs text-gray-500 uppercase tracking-wide"
									>
										Inactive Reason
									</p>
									<p class="font-medium text-gray-900 mt-1">
										{student.inactiveReason}
									</p>
								</div>
							{/if}
						</div>
					</CardContent>
				</Card>
			{/if}
		{/if}
	</div>
</div>
