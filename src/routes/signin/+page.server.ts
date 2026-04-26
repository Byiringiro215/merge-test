import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = ({ locals, url }) => {
    if (locals.accessToken) {
        redirect(302, url.searchParams.get('redirect') || '/dashboard');
    }
};
