import type { Snippet } from 'svelte';
import { getContext, setContext } from 'svelte';

export interface PageHeaderState {
  title: string;
  description: string;
  action: Snippet | null;
  breadcrumbs: { label: string; href: string }[];
  hideSidebar: boolean;
  noPadding: boolean;
  noScroll: boolean;
}

class PageHeader {
  #state = $state<PageHeaderState>({
    title: '',
    description: '',
    action: null,
    breadcrumbs: [],
    hideSidebar: false,
    noPadding: false,
    noScroll: false,
  });

  get title() { return this.#state.title; }
  get description() { return this.#state.description; }
  get action() { return this.#state.action; }
  get breadcrumbs() { return this.#state.breadcrumbs; }
  get hideSidebar() { return this.#state.hideSidebar; }
  get noPadding() { return this.#state.noPadding; }
  get noScroll() { return this.#state.noScroll; }

  setHeader(newHeader: Partial<PageHeaderState>) {
    Object.entries(newHeader).forEach(([key, value]) => {
      if (this.#state[key as keyof PageHeaderState] !== value) {
        (this.#state as any)[key] = value;
      }
    });
  }
}

const PAGE_HEADER_KEY = Symbol('page-header');

export function setPageHeader() {
  const pageHeader = new PageHeader();
  setContext(PAGE_HEADER_KEY, pageHeader);
  return pageHeader;
}

export function getPageHeader() {
  return getContext<PageHeader>(PAGE_HEADER_KEY);
}
