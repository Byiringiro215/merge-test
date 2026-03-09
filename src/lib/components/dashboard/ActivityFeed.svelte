<script lang="ts">
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
	} from "$lib/components/ui/card";
	import {
		CircleCheck,
		Clock,
		TriangleAlert,
		FileText,
	} from "@lucide/svelte";

	interface Activity {
		id: number;
		type: "success" | "info" | "warning" | "document";
		message: string;
		time: string;
	}

	const activities: Activity[] = [
		{
			id: 1,
			type: "success",
			message: "Q2 Scores uploaded for Software Development (Gasabo)",
			time: "12 minutes ago",
		},
		{
			id: 2,
			type: "info",
			message: "New curriculum added for Road Construction faculty",
			time: "2 hours ago",
		},
		{
			id: 3,
			type: "warning",
			message: "Low attendance alert: Mechanics in Nyamagabe district",
			time: "5 hours ago",
		},
		{
			id: 4,
			type: "success",
			message: "58 students certified in Tourism faculty (Rubavu)",
			time: "1 day ago",
		},
		{
			id: 5,
			type: "document",
			message: "District report generated for Kicukiro School Board",
			time: "1 day ago",
		},
	];

	const iconMap = {
		success: CircleCheck,
		info: Clock,
		warning: TriangleAlert,
		document: FileText,
	};

	const iconColorMap = {
		success: "text-green-500 bg-green-50",
		info: "text-blue-500 bg-blue-50",
		warning: "text-yellow-500 bg-yellow-50",
		document: "text-gray-500 bg-gray-100",
	};
</script>

<Card class="h-full py-6">
	<CardHeader class="flex-row items-center justify-between space-y-0">
		<div>
			<CardTitle class="text-base">Live System Activity</CardTitle>
			<CardDescription
				>Recent data synchronization and faculty updates.</CardDescription
			>
		</div>
		<a
			href="/logs"
			class="text-sm font-mediumtext-primary hover:text-blue-700"
			>View Log</a
		>
	</CardHeader>
	<CardContent class="space-y-4">
		{#each activities as activity, i (i)}
			{@const Icon = iconMap[activity.type]}
			<div class="flex items-start gap-3">
				<div
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full {iconColorMap[
						activity.type
					]}"
				>
					<Icon class="h-4 w-4" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-sm text-gray-900">{activity.message}</p>
					<p class="text-xs text-gray-500">{activity.time}</p>
				</div>
			</div>
		{/each}
	</CardContent>
</Card>
