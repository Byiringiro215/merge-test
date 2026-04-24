import { command, getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import {
    addGroupMemberSchema,
    createGroupBodySchema,
    deleteGroupSchema,
    fetchGroupsQuerySchema,
    removeGroupMemberSchema,
    searchUsersSchema,
    updateGroupCommandSchema,
} from '$lib/types/form-schemas';
import * as fetcher from '@bajustone/fetcher';
import * as s from '@bajustone/fetcher/schema';
import { error } from '@sveltejs/kit';

function authHeader() {
    const event = getRequestEvent();
    const { accessToken } = getAuthCookies(event.cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

export const fetchAllGroups = query(fetchGroupsQuerySchema, async (args) => {
    const result = await api.get('/iam/groups', {
        query: {
            ...(args.limit !== undefined && { limit: args.limit }),
            ...(args.offset !== undefined && { offset: args.offset }),
        },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        return { groups: [], total: 0 };
    }

    return result.data;
});

export const fetchGroupWithMembers = query(s.number(), async (id) => {
    const result = await api.get('/iam/groups/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(404, fetcher.extractErrorMessage(result.error) || 'Group not found');
    }

    return result.data;
});

export const searchUsersForGroup = query(searchUsersSchema, async (args) => {
    const result = await api.get('/auth/users', {
        query: {
            limit: args.limit ?? 50,
            ...(args.search && { search: args.search }),
        },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        return { users: [], total: 0 };
    }

    return result.data;
});

export const createGroup = command(createGroupBodySchema, async (body) => {
    const result = await api.post('/iam/groups', {
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to create group');
    }

    return result.data;
});

export const updateGroup = command(updateGroupCommandSchema, async ({ id, ...body }) => {
    const result = await api.put('/iam/groups/{id}', {
        params: { id },
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to update group');
    }

    return result.data;
});

export const deleteGroup = command(deleteGroupSchema, async ({ id }) => {
    const result = await api.delete('/iam/groups/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to delete group');
    }

    return result.data;
});

export const addGroupMember = command(addGroupMemberSchema, async ({ id, userId }) => {
    const result = await api.post('/iam/groups/{id}/users', {
        params: { id },
        body: { userId },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to add member');
    }

    return result.data;
});

export const removeGroupMember = command(removeGroupMemberSchema, async ({ id, userId }) => {
    const result = await api.delete('/iam/groups/{id}/users/{userId}', {
        params: { id, userId },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to remove member');
    }

    return result.data;
});
