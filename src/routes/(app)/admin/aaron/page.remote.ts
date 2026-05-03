import { command, getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import {
    createUserBodySchema,
    deleteUserSchema,
    fetchUserApiKeysSchema,
    fetchUsersQuerySchema,
    mintUserApiKeyCommandSchema,
    revokeUserApiKeySchema,
    updateUserCommandSchema,
} from '$lib/types/form-schemas';
import * as fetcher from '@bajustone/fetcher';
import * as s from '@bajustone/fetcher/schema';
import { error } from '@sveltejs/kit';

function authHeader() {
    const event = getRequestEvent();
    const { accessToken } = getAuthCookies(event.cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

// Pass the backend's documented ErrorResponse ({ code, message, statusCode })
// through with its real HTTP status so the UI distinguishes 401/403/404 from
// a generic 400 — and the user sees why (e.g. "missing apiKey:manage").
function failBackend(err: fetcher.FetcherError, fallback: string): never {
    if (err.kind === 'http') {
        const body = err.body as { message?: string; code?: string } | undefined;
        const message = body?.message || fetcher.extractErrorMessage(err) || fallback;
        error(err.status as Parameters<typeof error>[0], message);
    }
    error(500, fetcher.extractErrorMessage(err) || fallback);
}
// get paginated users
export const fetchAllUsers = query(fetchUsersQuerySchema, async (args) => {
    const result = await api.get('/auth/users', {
        query: {
            ...(args.limit !== undefined && { limit: args.limit }),
            ...(args.offset !== undefined && { offset: args.offset }),
            ...(args.search && { search: args.search }),
            ...(args.sortBy && { sortBy: args.sortBy }),
            ...(args.sortDirection && { sortDirection: args.sortDirection }),
        },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        return { users: [], total: 0 };
    }

    return result.data;
});

// create new user
export const createUser = command(createUserBodySchema, async (body) => {
    const result = await api.post('/auth/users', {
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        failBackend(result.error, 'Failed to create user');
    }

    return result.data;
});

export const updateUser = command(updateUserCommandSchema, async ({ id, ...body }) => {
    const result = await api.put('/auth/users/{id}', {
        params: { id },
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        failBackend(result.error, 'Failed to update user');
    }

    return result.data;
});

export const deleteUser = command(deleteUserSchema, async ({ id }) => {
    const result = await api.delete('/auth/users/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        failBackend(result.error, 'Failed to delete user');
    }

    return result.data;
});

// fetch a single user (used by the api-keys page header).
export const fetchUserById = query(s.number(), async (id) => {
    const result = await api.get('/auth/users/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        failBackend(result.error, 'User not found');
    }

    return result.data;
});

// fetch a user's active API keys (raw keys/hashes are never returned).
export const fetchUserApiKeys = query(
    fetchUserApiKeysSchema,
    async ({ userId }) => {
        const result = await api.get('/admin/users/{userId}/api-keys', {
            params: { userId },
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            return { keys: [] };
        }

        return result.data;
    },
);

// Returns the raw key in `key` — caller MUST surface it once and never refetch.
export const mintUserApiKey = command(
    mintUserApiKeyCommandSchema,
    async ({ userId, ...body }) => {
        const result = await api.post('/admin/users/{userId}/api-keys', {
            params: { userId },
            body,
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            failBackend(result.error, 'Failed to mint API key');
        }

        return result.data;
    },
);

export const revokeUserApiKey = command(
    revokeUserApiKeySchema,
    async ({ userId, id }) => {
        const result = await api.delete(
            '/admin/users/{userId}/api-keys/{id}',
            {
                params: { userId, id },
                headers: authHeader(),
            },
        ).result();

        if (!result.ok) {
            failBackend(result.error, 'Failed to revoke API key');
        }

        return result.data;
    },
);
