<script lang="ts">
	import DataTable from "$lib/components/data-table/data-table.svelte";
	import { Button } from "$lib/components/ui/button/index.js";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { renderSnippet } from "$lib/components/ui/data-table/index.js";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { Input } from "$lib/components/ui/input";
	import Pagination from "$lib/components/ui/pagination/pagination.svelte";
	import { Edit, Eye, Search, Trash } from "@lucide/svelte";
	import EllipsisIcon from "@lucide/svelte/icons/ellipsis";
	import HelpCircleIcon from "@lucide/svelte/icons/help-circle";
	import { type ColumnDef } from "@tanstack/table-core";
	import { createRawSnippet } from "svelte";
	import type { School } from "./types.js";

	interface Props {
		schools: School[];
	}

	let { schools }: Props = $props();

	let searchQuery = $state("");
	let currentPage = $state(1);
	const pageSize = 10;

	let filteredSchools = $derived(
		searchQuery
			? schools.filter(
					(s) =>
						s.name
							.toLowerCase()
							.includes(searchQuery.toLowerCase()) ||
						s.district
							.toLowerCase()
							.includes(searchQuery.toLowerCase()),
				)
			: schools,
	);

	let totalPages = $derived(Math.ceil(filteredSchools.length / pageSize));

	let paginatedSchools = $derived(
		filteredSchools.slice(
			(currentPage - 1) * pageSize,
			currentPage * pageSize,
		),
	);

	// Reset to page 1 when search changes
	$effect(() => {
		if (searchQuery !== undefined) {
			currentPage = 1;
		}
	});

	function handlePageChange(page: number) {
		currentPage = page;
	}

	function getSuccessRateColor(rate: number): string {
		if (rate >= 90) return "#16A34A"; // green-500
		if (rate >= 80) return "#2563EB"; // blue-500
		if (rate >= 70) return "#D97706"; // amber-500
		return "#ef4444"; // red-500
	}

	const columns: ColumnDef<School>[] = [
		{
			id: "name",
			accessorKey: "name",
			header: () => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<div class=" pl-11 text-sm leading-7  h-[48px] font-semibold text-[#171A1F]">High School Name</div>`,
				}));
				return renderSnippet(snippet);
			},
			cell: ({ row }) => {
				const school = row.original;
				const snippet = createRawSnippet(() => ({
					render: () => `
						<div class="flex items-center gap-3">
							<svg class="h-4 w-4 text-primary-gray shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="9 18 15 12 9 6"/>
							</svg>
							<span class="font-normal pl-4 text-sm text-[#171A1F]">${school.name}</span>
						</div>
					`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "district",
			header: () => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<div class=" text-sm leading-7  h-[48px] font-semibold text-[#171A1F]">District</div>`,
				}));
				return renderSnippet(snippet);
			},
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="text-sm text-primary-black">${row.original.district}</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "status",
			header: () => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<div class="text-sm leading-7  h-[48px] font-semibold text-[#171A1F]">Status</div>`,
				}));
				return renderSnippet(snippet);
			},
			cell: ({ row }) => {
				const status = row.original.status;
				const isActive = status === "Active";
				const bgColor = isActive ? "bg-[#22C55E1A]" : "bg-[#F3F4F6]";
				const textColor = isActive
					? "text-[#15803D]"
					: "text-[#565D6D]";
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<div>
						<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-normal ${bgColor} ${textColor}">${status}</span>
						</div>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "faculties",
			header: () => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<div class=" text-sm leading-7  h-[48px] font-semibold text-[#171A1F]">
						Faculties
						</div>`,
				}));
				return renderSnippet(snippet);
			},
			cell: ({ row }) => {
				const count = row.original.faculties;
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="inline-flex items-center rounded-full border  border-[#205FAD4D] px-2 py-0.5 text-xs font-normal text-primary">${count} Specialized</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "students",
			header: () => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<div class=" text-sm leading-7  h-[48px] font-semibold text-[#171A1F]">Students</div>`,
				}));
				return renderSnippet(snippet);
			},
			cell: ({ row }) => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="text-sm text-gray-900">${row.original.students.toLocaleString()}</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			accessorKey: "successRate",
			header: () => {
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<div class=" text-sm leading-7  h-[48px] font-semibold text-[#171A1F]">Access Rate</div>`,
				}));
				return renderSnippet(snippet);
			},
			cell: ({ row }) => {
				const rate = row.original.successRate;
				const color = getSuccessRateColor(rate);
				const snippet = createRawSnippet(() => ({
					render: () =>
						`<span class="text-sm font-medium" style="color: ${color};">${rate}%</span>`,
				}));
				return renderSnippet(snippet);
			},
		},
		{
			id: "actions",
			header: "",
			cell: ({ row }) =>
				renderSnippet(rowAction, { school: row.original }),
		},
	];

	function handleRowClick(school: School) {
		console.log("Row clicked:", school.name);
	}
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
{#snippet rowAction({ school }: { school: School })}
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

<Card class="border-none! shadow-none!">
	<CardHeader class="px-6 py-5  lg:p-6 bg-[#F3F4F633]">
		<div
			class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
		>
			<CardTitle
				class="text-xl leading-7   text-[#171A1F] font-bold tracking-[-0.5px]"
				>Institutional Registry</CardTitle
			>
			<div class="flex items-center gap-2">
				<div class="relative w-full sm:w-92.25">
					<Search
						class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
					/>
					<Input
						type="text"
						placeholder="Filter by school or district..."
						bind:value={searchQuery}
						class="pl-9 h-9.75 rounded-[6px] border	border-[#DEE1E6] bg-white placeholder:text-[#565D6D] "
					/>
				</div>
				<Button
					variant="outline"
					size="icon"
					class="shrink-0 rounded-[6px]!"
				>
					<HelpCircleIcon class="h-4 w-4 text-[#565D6D]" />
				</Button>
			</div>
		</div>
	</CardHeader>
	<CardContent class="p-0">
		<div class="overflow-x-auto">
			<DataTable
				{columns}
				data={paginatedSchools}
				tableRowClick={handleRowClick}
			/>
		</div>
		<!-- Pagination -->
		<div
			class="flex items-center justify-between border-t border-gray-200 px-4 py-3 lg:px-6"
		>
			<p class="text-sm text-gray-500">
				Showing <span class="font-medium text-gray-900"
					>{paginatedSchools.length}</span
				> schools from prioritizing districts
			</p>
			{#if totalPages > 1}
				<Pagination
					{currentPage}
					{totalPages}
					onPageChange={handlePageChange}
				/>
			{:else}
				<div class="flex items-center gap-2">
					<Button variant="outline" size="sm" disabled
						>Previous</Button
					>
					<Button variant="outline" size="sm" disabled>Next</Button>
				</div>
			{/if}
		</div>
	</CardContent>
</Card>
