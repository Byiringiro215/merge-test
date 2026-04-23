import { command, getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import {
    createUserBodySchema,
    deleteUserSchema,
    fetchUsersQuerySchema,
    updateUserCommandSchema,
} from '$lib/types/form-schemas';
import * as fetcher from '@bajustone/fetcher';
import { error } from '@sveltejs/kit';

function authHeader() {
    const event = getRequestEvent();
    const { accessToken } = getAuthCookies(event.cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

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

export const createUser = command(createUserBodySchema, async (body) => {
    const result = await api.post('/auth/users', {
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to create user');
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
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to update user');
    }

    return result.data;
});

export const deleteUser = command(deleteUserSchema, async ({ id }) => {
    const result = await api.delete('/auth/users/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to delete user');
    }

    return result.data;
});
