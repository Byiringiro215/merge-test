import type { RequestHandler } from './$types';
import { serverApi } from '$lib/api';
import { clearAuthCookies, getAuthCookies } from '$lib/auth/cookies';

export const POST: RequestHandler = async ({ cookies }) => {
    const { refreshToken } = getAuthCookies(cookies);

    if (refreshToken) {
        await serverApi.post('/auth/logout', {
            body: { refreshToken },
        });
    }

    clearAuthCookies(cookies);

    return new Response(null, { status: 200 });
};
