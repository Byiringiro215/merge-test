import { command, getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import { extractErrorMessage } from '@bajustone/fetcher';
import { error } from '@sveltejs/kit';

function authHeader() {
    const event = getRequestEvent();
    const { accessToken } = getAuthCookies(event.cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

export interface FetchUsersArgs {
    limit?: number;
    offset?: number;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export const fetchAllUsers = query('unchecked', async (args: FetchUsersArgs = {}) => {
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

export interface CreateUserInput {
    name: string;
    email: string;
    password?: string;
    isActive?: boolean;
}

export interface UpdateUserInput extends CreateUserInput {
    id: number;
}

export const createUser = command('unchecked', async (input: CreateUserInput) => {
    const result = await api.post('/auth/users', {
        body: input,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, extractErrorMessage(result.error) || 'Failed to create user');
    }

    return result.data;
});

export const updateUser = command('unchecked', async ({ id, ...body }: UpdateUserInput) => {
    const result = await api.put('/auth/users/{id}', {
        params: { id },
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, extractErrorMessage(result.error) || 'Failed to update user');
    }

    return result.data;
});

export const deleteUser = command('unchecked', async ({ id }: { id: number }) => {
    const result = await api.delete('/auth/users/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, extractErrorMessage(result.error) || 'Failed to delete user');
    }

    return result.data;
});
