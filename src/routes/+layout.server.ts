import type { LayoutServerLoad } from './$types';
import { serverApi } from '$lib/api';

export const load: LayoutServerLoad = async ({ locals }) => {
    if (!locals.accessToken) {
        return { user: null, accessToken: null };
    }

    const result = await serverApi.get('/auth/me', {
        headers: { Authorization: `Bearer ${locals.accessToken}` },
    }).result();

    if (!result.ok) {
        return { user: null, accessToken: null };
    }

    return {
        user: result.data,
        accessToken: locals.accessToken,
    };
};
