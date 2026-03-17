<script lang="ts">
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { renderSnippet } from "$lib/components/ui/data-table/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Input } from "$lib/components/ui/input";
	import { Edit, Eye, Search, Trash } from "@lucide/svelte";
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import { type ColumnDef } from "@tanstack/table-core";
	import { createRawSnippet } from "svelte";
	import type { SchoolRecord } from "./types.js";

	const allRecords: SchoolRecord[] = [
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

	let searchQuery = $state("");

	// Filter records based on search
	let filteredRecords = $derived(
		searchQuery
			? allRecords.filter(
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
			: allRecords,
	);

	const columns: ColumnDef<SchoolRecord>[] = [
		{
			id: "school name",
			accessorKey: "name",
			header: "High School Name",
		},
		{
			accessorKey: "district",
			header: "District",
			cell: ({ row }) => row.original.district,
		},
		{
			accessorKey: "faculty",
			header: "Primary Faculty",
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => {
					return {
						render: () =>
							`<span class="inline-flex items-center rounded-full px-1 py-0.5 text-xs font-normal bg-[#9bc3e8]/20 text-[#205fad] border border-[#8db9e2]">${row.original.faculty}</span>`,
					};
				});
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "activeStudents",
			header: "Active Students",
			cell: ({ row }) => row.original.activeStudents,
		},
		{
			id: "successRate",
			accessorKey: "successRate",
			header: "Success Rate",
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => {
					return {
						render: () =>
							`<span class="font-medium text-green-600">${row.original.successRate}%</span>`,
					};
				});
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "status",
			header: "Performance Status",
			cell: ({ row }) => {
				const statusColors: Record<string, string> = {
					High: "text-green-600",
					Stable: "text-blue-600",
					"Action Required": "text-red-600",
				};

				const statusDotColors: Record<string, string> = {
					High: "bg-green-500",
					Stable: "bg-blue-500",
					"Action Required": "bg-red-500",
				};
				const snippet = createRawSnippet(() => {
					return {
						render: () =>
							`<div class="flex items-center gap-2">
							<span class="h-2 w-2 rounded-full ${statusDotColors[row.original.status]}"></span>
							<span class=${statusColors[row.original.status]}>${row.original.status}</span>
						</div>
                `,
					};
				});
				return renderSnippet(snippet);
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) =>
				renderSnippet(rowAction, { record: row.original }),
		},
	];
</script>

<div
	class="mb-4 mt-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
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
	<div class="relative w-full sm:w-83.75">
		<Search
			class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
		/>
		<Input
			type="text"
			placeholder="Search high schools or districts..."
			bind:value={searchQuery}
			class="pl-9 bg-white rounded-[6px] placeholder:font-normal text-sm "
		/>
	</div>
</div>

<div class="rounded-lg border border-gray-200 bg-white overflow-hidden">
	<DataTable {columns} data={filteredRecords} />
</div>

{#snippet rowAction()}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="ghost"
					size="icon"
					class="relative size-8 p-0"
				>
					<span class="sr-only">Open menu</span>
					<EllipsisIcon />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label>Actions</DropdownMenu.Label>
				<DropdownMenu.Item>
					<Eye class="mr-2 h-4 w-4" />
					View details
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Item>
				<Edit class="mr-2 h-4 w-4" />
				Edit details
			</DropdownMenu.Item>
			<DropdownMenu.Item class="text-red-600 group cursor-pointer">
				<Trash
					class="mr-2 h-4 w-4 text-red-600 group-hover:text-black!"
				/>
				Delete
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/snippet}
