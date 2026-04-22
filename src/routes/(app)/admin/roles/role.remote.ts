import type { Schema } from '$lib/api/paths';
import type { Permission, PermissionInput } from '$lib/datamodel/admin';
import { command, getRequestEvent, query } from '$app/server';
import { serverApi as api } from '$lib/api';
import { getAuthCookies } from '$lib/auth/cookies';
import { permissionListResponseSchema, rolePermissionResponseSchema } from '$lib/types/api-schemas';
import { extractErrorMessage } from '@bajustone/fetcher';
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

export const fetchRoleById = query('unchecked', async (id: number) => {
    // Fetch a single role with its full permissions list; used to populate the edit form.
    const result = await api.get('/iam/roles/{id}', {
        params: { id },
        headers: authHeader(),
        responseSchema: rolePermissionResponseSchema,
    }).result();

    if (!result.ok) {
        error(404, extractErrorMessage(result.error) || 'Role not found');
    }

    return result.data;
});

export interface SearchUsersArgs {
    search?: string;
    limit?: number;
}

export const searchUsers = query(
    'unchecked',
    async (args: SearchUsersArgs = {}) => {
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
    },
);

export interface SearchGroupsArgs {
    limit?: number;
}

export const searchGroups = query(
    'unchecked',
    async (args: SearchGroupsArgs = {}) => {
        // List groups with an optional limit (default 50); used for role-binding pickers.
        const result = await api.get('/iam/groups', {
            query: { limit: args.limit ?? 50 },
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            return { groups: [], total: 0 };
        }

        return result.data;
    },
);

export interface CreateRoleInput {
    name: string;
    permissions: PermissionInput[];
    description?: string;
}

// Create a new role with its initial permission set; throws 400 on server failure.
export const createRole = command('unchecked', async (input: CreateRoleInput) => {
    const result = await api.post('/iam/roles', {
        body: {
            name: input.name,
            description: input.description,
            permissions: input.permissions,
        },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, extractErrorMessage(result.error) || 'Failed to create role');
    }

    return result.data;
});

export interface UpdateRoleInput {
    id: number;
    name: string;
    description?: string;
    addedPermissions?: Permission[];
}

export const updateRole = command('unchecked', async (input: UpdateRoleInput) => {
    // Update a role's name/description and attach any newly added permissions in a single call.

    const updated = await api.put('/iam/roles/{id}', {
        params: { id: input.id },
        body: { name: input.name, description: input.description },
        headers: authHeader(),
    }).result();

    if (!updated.ok) {
        error(400, extractErrorMessage(updated.error) || 'Failed to update role');
    }

    for (const permission of input.addedPermissions ?? []) {
        const r = await api.post('/iam/roles/{id}/permissions', {
            params: { id: input.id },
            body: permission as never,
            headers: authHeader(),
        }).result();

        if (!r.ok) {
            error(
                400,
                extractErrorMessage(r.error) || 'Failed to add permission to role',
            );
        }
    }

    return updated.data;
});

export const deleteRole = command('unchecked', async ({ id }: { id: number }) => {
    // Delete a role by id; throws 400 on server failure.
    const result = await api.delete('/iam/roles/{id}', {
        params: { id },
        headers: authHeader(),
    }).result();

    if (!result.ok) {
        error(400, extractErrorMessage(result.error) || 'Failed to delete role');
    }

    return result.data;
});

export const bindRoleToUser = command(
    'unchecked',
    async ({ id, userId }: { id: number; userId: number }) => {
        // Assign the given role to a specific user.
        const result = await api.post('/iam/roles/{id}/bind/user', {
            params: { id },
            body: { userId },
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            error(
                400,
                extractErrorMessage(result.error) || 'Failed to bind role to user',
            );
        }

        return result.data;
    },
);

export const bindRoleToGroup = command(
    'unchecked',
    async ({ id, groupId }: { id: number; groupId: number }) => {
        // Assign the given role to a specific group.
        const result = await api.post('/iam/roles/{id}/bind/group', {
            params: { id },
            body: { groupId },
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            error(
                400,
                extractErrorMessage(result.error) || 'Failed to bind role to group',
            );
        }

        return result.data;
    },
);

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

export interface AddPermissionToRoleInput {
    id: number;
    permission: Schema<'PermissionInput'>;
}

export const addPermissionToRole = command(
    'unchecked',
    async ({ id, permission }: AddPermissionToRoleInput) => {
        // Attach a single permission to an existing role.
        const result = await api.post('/iam/roles/{id}/permissions', {
            params: { id },
            body: permission,
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            error(
                400,
                extractErrorMessage(result.error) || 'Failed to add permission',
            );
        }

        return result.data;
    },
);

export interface UnbindRoleInput {
    id: number;
    subjectType: 'USER' | 'GROUP' | 'SERVICE_ACCOUNT';
    subjectId: number;
}

export const unbindRole = command(
    'unchecked',
    async ({ id, subjectType, subjectId }: UnbindRoleInput) => {
        // Remove a role binding from a subject (user, group, or service account).
        const result = await api.delete('/iam/roles/{id}/bind', {
            params: { id },
            body: { subjectType, subjectId },
            headers: authHeader(),
        }).result();

        if (!result.ok) {
            error(400, extractErrorMessage(result.error) || 'Failed to unbind role');
        }

        return result.data;
    },
);
