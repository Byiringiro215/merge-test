import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('should render loading spinner initially', async () => {
		const { container } = render(Page);

		const spinner = container.querySelector('.animate-spin');
		expect(spinner).not.toBeNull();
	});
});
