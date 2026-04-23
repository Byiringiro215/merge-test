import { command, getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import {
    permissionListResponseSchema,
    rolePermissionResponseSchema,
} from '$lib/types/api-schemas';
import {
    addPermissionToRoleSchema,
    bindRoleToGroupSchema,
    bindRoleToUserSchema,
    createRoleCommandSchema,
    deleteRoleSchema,
    searchGroupsSchema,
    searchUsersSchema,
    unbindRoleSchema,
    updateRoleCommandSchema,
} from '$lib/types/form-schemas';
import * as fetcher from '@bajustone/fetcher';
import * as s from '@bajustone/fetcher/schema';
import { error } from '@sveltejs/kit';

function authHeader() {
    // Build the Authorization header from the access-token cookie on the current request.
    const event = getRequestEvent();
    const { accessToken } = getAuthCookies(event.cookies);
    return { Authorization: `Bearer ${accessToken}` };
}

export const fetchAllRoles = query(async () => {
    // Fetch every role from the IAM service; returns an empty array on failure.
    const result = await api.get('/iam/roles', {
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        return [];
    }

    return result.data;
});

export const fetchRoleById = query(s.number(), async (id) => {
    // Fetch a single role with its full permissions list; used to populate the edit form.
    const result = await api.get('/iam/roles/{id}', {
        params: { id },
        headers: authHeader(),
        responseSchema: rolePermissionResponseSchema,
    }).result();

    if (!result.ok) {
        error(404, fetcher.extractErrorMessage(result.error) || 'Role not found');
    }

    return result.data;
});

export const searchUsers = query(searchUsersSchema, async (args) => {
    // Search users by email/name with an optional result limit (default 10).
    const result = await api.get('/auth/users', {
        query: {
            limit: args.limit ?? 10,
            ...(args.search && { search: args.search }),
        },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        return { users: [], total: 0 };
    }

    return result.data;
});

export const searchGroups = query(searchGroupsSchema, async (args) => {
    // List groups with an optional limit (default 50); used for role-binding pickers.
    const result = await api.get('/iam/groups', {
        query: { limit: args.limit ?? 50 },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        return { groups: [], total: 0 };
    }

    return result.data;
});

// Create a new role with its initial permission set; throws 400 on server failure.
// Schema is the `/iam/roles` POST body validator straight from OpenAPI.
export const createRole = command(createRoleCommandSchema, async (input) => {
    const result = await api.post('/iam/roles', {
        body: input,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to create role');
    }

    return result.data;
});

export const updateRole = command(updateRoleCommandSchema, async (input) => {
    // Update a role's name/description and attach any newly added permissions in a single call.
    const updated = await api.put('/iam/roles/{id}', {
        params: { id: input.id },
        body: { name: input.name, description: input.description },
        headers: authHeader(),
    }).result();

    if (!updated.ok) {
        error(400, fetcher.extractErrorMessage(updated.error) || 'Failed to update role');
    }

    for (const permission of input.addedPermissions ?? []) {
        const r = await api.post('/iam/roles/{id}/permissions', {
            params: { id: input.id },
            body: permission,
            headers: authHeader(),
        }).result();

        if (!r.ok) {
            error(
                400,
                fetcher.extractErrorMessage(r.error) || 'Failed to add permission to role',
            );
        }
    }

    return updated.data;
});

export const deleteRole = command(deleteRoleSchema, async ({ id }) => {
    const result = await api.delete('/iam/roles/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to delete role');
    }

    return result.data;
});

export const bindRoleToUser = command(bindRoleToUserSchema, async ({ id, ...body }) => {
    // Assign the given role to a specific user.
    const result = await api.post('/iam/roles/{id}/bind/user', {
        params: { id },
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to bind role to user');
    }

    return result.data;
});

export const bindRoleToGroup = command(bindRoleToGroupSchema, async ({ id, ...body }) => {
    // Assign the given role to a specific group.
    const result = await api.post('/iam/roles/{id}/bind/group', {
        params: { id },
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to bind role to group');
    }

    return result.data;
});

export const fetchAllPermissions = query(async () => {
    // Fetch the full, unfiltered list of permissions; returns an empty array on failure.
    const result = await api.get('/iam/permissions', {
        headers: authHeader(),
        responseSchema: permissionListResponseSchema,
    }).result();

    if (!result.ok) {
        return [];
    }

    return result.data;
});

export const addPermissionToRole = command(
    addPermissionToRoleSchema,
    async ({ id, permission }) => {
        // Attach a single permission to an existing role.
        const result = await api.post('/iam/roles/{id}/permissions', {
            params: { id },
            body: permission,
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            error(400, fetcher.extractErrorMessage(result.error) || 'Failed to add permission');
        }

        return result.data;
    },
);

export const unbindRole = command(unbindRoleSchema, async ({ id, ...body }) => {
    // Remove a role binding from a subject (user, group, or service account).
    const result = await api.delete('/iam/roles/{id}/bind', {
        params: { id },
        body,
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, fetcher.extractErrorMessage(result.error) || 'Failed to unbind role');
    }

    return result.data;
});
