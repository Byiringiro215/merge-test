<script lang="ts">
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { renderSnippet } from "$lib/components/ui/data-table/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Input } from "$lib/components/ui/input";
	import Pagination from "$lib/components/ui/pagination/pagination.svelte";
	import { Edit, Eye, Search, Trash } from "@lucide/svelte";
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import { type ColumnDef } from "@tanstack/table-core";
	import { createRawSnippet } from "svelte";
	import type { Teacher } from "./types.js";

	interface Props {
		teachers: Teacher[];
		totalCount?: number;
	}

	let { teachers, totalCount = 1248 }: Props = $props();

	let searchQuery = $state("");
	let currentPage = $state(1);
	const pageSize = 10;

	let filteredTeachers = $derived(
		searchQuery
			? teachers.filter(
					(t) =>
						t.name
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						t.assignedSchool
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						t.primaryFaculty
							.toLowerCase()
							.includes(searchQuery.toLowerCase()),
				)
			: teachers,
	);

	let totalPages = $derived(Math.ceil(filteredTeachers.length / pageSize));

	let paginatedTeachers = $derived(
		filteredTeachers.slice(
			(currentPage - 1) * pageSize,
			currentPage * pageSize,
		),
	);

	// Reset to page 1 when search changes
	$effect(() => {
		searchQuery;
		currentPage = 1;
	});

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function getSuccessRateColor(rate: number): string {
		if (rate >= 90) return "#22c55e"; // green-500
		if (rate >= 80) return "#3b82f6"; // blue-500
		if (rate >= 70) return "#f59e0b"; // amber-500
		return "#ef4444"; // red-500
	}

	function getInitials(name: string): string {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	}

	const columns: ColumnDef<Teacher>[] = [
		{
			id: "profile",
			accessorKey: "name",
			header: "Teacher & Profile",
			cell: ({ row }) => {
				const teacher = row.original;
				const initials = getInitials(teacher.name);
				const snippet = createRawSnippet(() => ({
					render: () => `
						<div class="flex items-center gap-3">
							<div class="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm shrink-0">
								${teacher.avatar ? `<img src="${teacher.avatar}" alt="${teacher.name}" class="h-8 w-8 rounded-full object-cover" />` : initials}
							</div>
							<div>
								<div class="font-normal text-sm text-black">${teacher.name}</div>
								<div class="text-xs text-gray-500">Registered Since ${teacher.registeredSince}</div>
							</div>
						</div>
					`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "primaryFaculty",
			header: "Primary Faculty",
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="inline-flex items-center rounded-full border border-[#c9d9ec] bg-[#f4f7fb] px-1 py-0.5 text-xs font-normal text-secondary">${row.original.primaryFaculty}</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "assignedSchool",
			header: "Assigned High School",
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => ({
					render: () => `
						<div class="flex items-center gap-1.5 text-gray-600">
							<svg class="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
								<circle cx="12" cy="10" r="3"/>
							</svg>
							<span class="text-xs text-black  font-normal">${row.original.assignedSchool}</span>
						</div>
					`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "students",
			header: "Students",
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="text-sm text-gray-900">${row.original.students}</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "successRate",
			header: "Success Rate",
			cell: ({ row }) => {
				const rate = row.original.successRate;
				const color = getSuccessRateColor(rate);
				const snippet = createRawSnippet(() => ({
					render: () => `
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium" style="color: ${color};">${rate}%</span>
							<div class="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
								<div class="h-full rounded-full" style="width: ${rate}%; background-color: ${color};"></div>
							</div>
						</div>
					`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) =>
				renderSnippet(rowAction, { teacher: row.original }),
		},
	];

	function handleRowClick(teacher: Teacher) {
		console.log("Row clicked:", teacher.name);
	}
</script>

{#snippet rowAction({ teacher }: { teacher: Teacher })}
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
					>Teacher Performance Registry</CardTitle
				>
				<CardDescription>
					Detailed metrics for individual faculty members in high
					schools
				</CardDescription>
			</div>
			<div class="relative w-full sm:w-72">
				<Search
					class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
				/>
				<Input
					type="text"
					placeholder="Search name, school or faculty..."
					bind:value={searchQuery}
					class="pl-9"
				/>
			</div>
		</div>
	</CardHeader>
	<CardContent class="p-0">
		<div class="overflow-x-auto">
			<DataTable
				{columns}
				data={paginatedTeachers}
				tableRowClick={handleRowClick}
			/>
		</div>
		<!-- Pagination -->
		<div
			class="flex items-center justify-between border-t border-gray-200 px-4 py-3 lg:px-6"
		>
			<p class="text-sm text-gray-500">
				Showing <span class="font-medium text-gray-900"
					>{paginatedTeachers.length}</span
				>
				of
				<span class="font-medium text-gray-900"
					>{totalCount.toLocaleString()}</span
				> teachers
			</p>
			{#if totalPages > 1}
				<Pagination
					{currentPage}
					{totalPages}
					onPageChange={handlePageChange}
				/>
			{/if}
		</div>
	</CardContent>
</Card>
