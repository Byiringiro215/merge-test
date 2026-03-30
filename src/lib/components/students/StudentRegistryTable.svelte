<script lang="ts">
	import { goto } from "$app/navigation";
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Columns4 } from "@lucide/svelte";
	import { renderSnippet } from "$lib/components/ui/data-table/index.js";
	import { Input } from "$lib/components/ui/input";
	import Pagination from "$lib/components/ui/pagination/pagination.svelte";
	import type { StudentSummary } from "$lib/datamodel/student";
	import { Eye, Search } from "@lucide/svelte";
	import { type ColumnDef, type Table } from "@tanstack/table-core";
	import { resolve } from "$app/paths";
	import { createRawSnippet } from "svelte";

	const navigateToStudent = (studentNumber: string) => {
		goto(resolve(`/students/${studentNumber}`));
	};

	interface Props {
		students: StudentSummary[];
		currentPage: number;
		totalPages: number;
		totalItems: number;
		pageSize: number;
		isLoading?: boolean;
		onPageChange: (page: number) => void;
	}

	let {
		students,
		currentPage,
		totalPages,
		totalItems,
		pageSize,
		isLoading = false,
		onPageChange,
	}: Props = $props();

	let searchQuery = $state("");

	// Client-side filtering for search (searches within current page)
	let filteredStudents = $derived(
		searchQuery
			? students.filter(
					(s) =>
						s.names
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						s.schoolName
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						(s.classGroup ?? "")
							.toLowerCase()
							.includes(searchQuery.toLowerCase()),
				)
			: students,
	);

	function handlePageChange(page: number) {
		onPageChange(page);
	}

	// svelte-ignore non_reactive_update
	let tableData: Table<StudentSummary>;

	/// Table columns
	const columns: ColumnDef<StudentSummary>[] = [
		{
			id: "studentNumber",
			accessorKey: "studentNumber",
			header: ({ table }) => {
				tableData = table;
				const snippet = createRawSnippet(() => ({
					render: () => "Student ID",
				}));
				return renderSnippet(snippet);
			},
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="font-mono text-xs text-gray-600">${row.original.studentNumber}</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			id: "names",
			accessorKey: "names",
			header: "Student Name",
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="font-normal text-sm text-black">${row.original.names}</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "schoolName",
			header: "School Name",
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="text-xs font-medium text-gray-700">${row.original.schoolName}</span>`,
				}));
				return renderSnippet(snippet);
			},
			enableHiding: false,
		},
		{
			accessorKey: "schoolCode",
			header: "School Code",
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<p class="text-xs font-medium text-gray-700 text-center">${row.original.schoolCode}</p>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "classGroup",
			header: "Class Group",
			cell: ({ row }) => {
				const classGroup = row.original.classGroup ?? "-";
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-normal text-black">${classGroup}</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "gender",
			header: "Gender",
			cell: ({ row }) => {
				const gender = row.original.gender ?? "-";
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="text-sm text-gray-700">${gender}</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => {
				const status = row.original.status ?? "Unknown";
				const isActive = status.toLowerCase() === "active";
				const bgColor = isActive ? "bg-green-100" : "bg-gray-100";
				const textColor = isActive ? "text-green-700" : "text-gray-700";
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
</script>

{#snippet rowAction({ student }: { student: StudentSummary })}
	<Button
		variant="ghost"
		size="icon"
		class="shrink-0 cursor-pointer"
		onclick={() => navigateToStudent(student.studentNumber)}
	>
		<Eye class="h-4 w-4" />
	</Button>
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
				<div class="relative w-full sm:w-72">
					<Search
						class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
					/>
					<Input
						type="text"
						placeholder="Search by student name..."
						bind:value={searchQuery}
						class="pl-9 h-10 border-none focus-visible:ring-1 rounded-[6px]"
					/>
				</div>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Button
								{...props}
								variant="outline"
								size="icon"
								class="shrink-0 cursor-pointer"
							>
								<Columns4 class="h-4 w-4" />
							</Button>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="end">
						{#each tableData
							.getAllColumns()
							.filter( (col) => col.getCanHide(), ) as column (column)}
							<DropdownMenu.CheckboxItem
								class="capitalize"
								bind:checked={
									() => column.getIsVisible(),
									(v) => column.toggleVisibility(!!v)
								}
							>
								{column.id}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</CardHeader>
	<CardContent class="p-0">
		<div class="overflow-x-auto">
			{#if isLoading}
				<div class="flex items-center justify-center py-12">
					<div
						class="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary"
					></div>
				</div>
			{:else}
				<DataTable {columns} data={filteredStudents} />
			{/if}
		</div>
		<!-- Pagination -->
		<div class="border-t pt-3 px-4 lg:px-6 pb-3">
			<Pagination
				{currentPage}
				{totalPages}
				onPageChange={handlePageChange}
				{totalItems}
				{pageSize}
			/>
		</div>
	</CardContent>
</Card>
