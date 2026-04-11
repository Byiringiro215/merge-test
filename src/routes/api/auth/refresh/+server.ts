import type { RequestHandler } from './$types';
import { serverApi } from '$lib/api';
import { clearAuthCookies, getAuthCookies, setAuthCookies } from '$lib/auth/cookies';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
    const { refreshToken } = getAuthCookies(cookies);

    if (!refreshToken) {
        return json({ error: 'No refresh token' }, { status: 401 });
    }

    const result = await serverApi.post('/auth/refresh', {
        body: { refreshToken },
    }).result();

    if (!result.ok) {
        clearAuthCookies(cookies);
        return json({ error: 'Refresh failed' }, { status: 401 });
    }

    setAuthCookies(cookies, {
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
    });

    return json({ accessToken: result.data.accessToken });
};
