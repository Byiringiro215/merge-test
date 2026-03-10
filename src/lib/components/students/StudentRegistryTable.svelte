<script lang="ts">
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import { renderSnippet } from "$lib/components/ui/data-table/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Input } from "$lib/components/ui/input";
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent,
	} from "$lib/components/ui/card";
	import { Edit, Eye, Search, Trash, ArrowUpDown } from "@lucide/svelte";
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import { type ColumnDef } from "@tanstack/table-core";
	import { createRawSnippet } from "svelte";
	import type { Student } from "./types.js";

	interface Props {
		students: Student[];
	}

	let { students }: Props = $props();

	let searchQuery = $state("");

	let filteredStudents = $derived(
		searchQuery
			? students.filter(
					(s) =>
						s.name
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						s.district
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						s.faculty
							.toLowerCase()
							.includes(searchQuery.toLowerCase()),
				)
			: students,
	);

	const columns: ColumnDef<Student>[] = [
		{
			id: "name",
			accessorKey: "name",
			header: "Student Name",
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="font-medium text-gray-900">${row.original.name}</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "district",
			header: "District",
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700">${row.original.district}</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "faculty",
			header: "Faculty",
			cell: ({ row }) => row.original.faculty,
		},
		{
			accessorKey: "level",
			header: "Level",
			cell: ({ row }) => row.original.level,
		},
		{
			accessorKey: "score",
			header: "Score",
			cell: ({ row }) => {
				const score = row.original.score;
				const barColor = score >= 50 ? "#3b82f6" : "#ef4444";
				const snippet = createRawSnippet(() => ({
					render: () => `
						<div class="flex items-center gap-2">
							<span class="font-medium text-gray-900 w-10">${score}%</span>
							<div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
								<div class="h-full rounded-full" style="width: ${score}%; background-color: ${barColor};"></div>
							</div>
						</div>
					`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.original.status;
				const isSucceeded = status === "Succeeded";
				const bgColor = isSucceeded ? "bg-green-100" : "bg-red-100";
				const textColor = isSucceeded
					? "text-green-700"
					: "text-red-700";
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}">${status}</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) =>
				renderSnippet(rowAction, { student: row.original }),
		},
	];

	function handleRowClick(student: Student) {
		console.log("Row clicked:", student.name);
	}
</script>

{#snippet rowAction({ student }: { student: Student })}
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

<Card>
	<CardHeader class="p-4 lg:p-6">
		<div
			class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
		>
			<div>
				<CardTitle class="text-lg font-semibold"
					>Student Registry</CardTitle
				>
				<CardDescription>
					Detailed academic records for High School students across
					monitored districts
				</CardDescription>
			</div>
			<div class="flex items-center gap-2">
				<div class="relative w-full sm:w-64">
					<Search
						class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
					/>
					<Input
						type="text"
						placeholder="Search by student name..."
						bind:value={searchQuery}
						class="pl-9"
					/>
				</div>
				<Button variant="outline" size="icon" class="shrink-0">
					<ArrowUpDown class="h-4 w-4" />
				</Button>
			</div>
		</div>
	</CardHeader>
	<CardContent class="p-0">
		<div class="overflow-x-auto">
			<DataTable
				{columns}
				data={filteredStudents}
				tableRowClick={handleRowClick}
			/>
		</div>
	</CardContent>
</Card>
