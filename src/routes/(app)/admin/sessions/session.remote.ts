import { command, getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import {
    revokeAllSessionsSchema,
    revokeSessionSchema,
} from '$lib/types/form-schemas';
import * as fetcher from '@bajustone/fetcher';
import { error } from '@sveltejs/kit';

function authHeader() {
    const event = getRequestEvent();
    const { accessToken } = getAuthCookies(event.cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

export const fetchAllSessions = query(async () => {
    const result = await api.get('/auth/sessions', {
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        return [];
    }

    return result.data;
});

export const revokeSession = command(revokeSessionSchema, async ({ id }) => {
    const result = await api.delete('/auth/sessions/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to revoke session');
    }

    return result.data;
});

export const revokeAllOtherSessions = command(revokeAllSessionsSchema, async (body) => {
    const result = await api.delete('/auth/sessions', {
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(
            400,
            fetcher.extractErrorMessage(result.error) || 'Failed to revoke other sessions',
        );
    }

    return result.data;
});
