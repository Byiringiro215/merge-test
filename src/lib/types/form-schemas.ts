// Schemas used by both `.remote.ts` handlers (as their validation argument)
// and by `.svelte` components (for client-side `parseForm()` before
// submitting a command, or `form.preflight(schema)` on a remote `form`).
//
// These intentionally live outside any `.remote.ts` file: SvelteKit forbids
// non-remote exports from `*.remote.ts` files that would be read on the
// client.
//
// Where an API route body, query, or named component already describes the
// shape, we reuse the validator emitted by the fetcher vite plugin from
// `src/lib/api/openapi.json` via `virtual:fetcher`. Hand-written schemas
// are kept only for:
//   1. UI-only pickers (`subjectPickerSchema`, `permissionPickerSchema`),
//   2. URL-param-only commands (`{id: number}`),
//   3. The login form, whose `_password` field name is a SvelteKit form
//      convention (strips on failed-submit retry) incompatible with the
//      API's `password` body key.

import { routes, validators } from '$lib/api/typed-routes';
import * as s from '@bajustone/fetcher/schema';

// -- Auth ---------------------------------------------------------------------

// Hand-written: `_password` (SvelteKit strip-on-retry convention) != API's
// `password` body field. The login.remote.ts handler remaps before posting.
export const loginSchema = s.object({
    identifier: s.string({ minLength: 1 }),
    _password: s.string({ minLength: 1 }),
});
export type LoginInput = s.Infer<typeof loginSchema>;

// Each slot on PathsToRoutes (`body`, `query`, `params`, `response`,
// `errorResponse`) is typed `?:` — optional — because not every route
// declares every slot. At call sites we know the slot exists (body on
// POST/PUT, query on list endpoints, etc.) so we assert with `!`. This
// is a type-only assertion; the runtime validator was emitted by the
// plugin from `openapi.json`.

// -- Users (create + edit) ----------------------------------------------------

export const createUserBodySchema = routes['/auth/users'].POST.body!;
export type CreateUserBody = s.Infer<typeof createUserBodySchema>;

export const updateUserCommandSchema = s.extendSchema(
    routes['/auth/users/{id}'].PUT.body!,
    { id: s.number() },
);
export type UpdateUserCommand = s.Infer<typeof updateUserCommandSchema>;

export const deleteUserSchema = routes['/auth/users/{id}'].DELETE.params!;
export type DeleteUserInput = s.Infer<typeof deleteUserSchema>;

export const fetchUsersQuerySchema = routes['/auth/users'].GET.query!;
export type FetchUsersQuery = s.Infer<typeof fetchUsersQuerySchema>;

// -- Roles --------------------------------------------------------------------

export const createRoleCommandSchema = routes['/iam/roles'].POST.body!;
export type CreateRoleCommand = s.Infer<typeof createRoleCommandSchema>;

export const updateRoleCommandSchema = s.extendSchema(
    routes['/iam/roles/{id}'].PUT.body!,
    {
        id: s.number(),
        addedPermissions: s.optional(s.array(validators.PermissionInput)),
    },
);
export type UpdateRoleCommand = s.Infer<typeof updateRoleCommandSchema>;

export const deleteRoleSchema = s.object({ id: s.number() });
export type DeleteRoleInput = s.Infer<typeof deleteRoleSchema>;

// Form-side state shape for RoleFormDialog (create + edit). `id` optional;
// `originalPermissionIds` is UI-only (used to compute the diff on save).
export const roleFormSchema = s.extendSchema(
    routes['/iam/roles'].POST.body!,
    {
        id: s.optional(s.number()),
        originalPermissionIds: s.optional(s.array(s.number())),
    },
);
export type RoleFormInput = s.Infer<typeof roleFormSchema>;

// -- Role bindings ------------------------------------------------------------

// Each bind/unbind endpoint's body describes the subject payload; the command
// additionally receives the role `id` path param, so we extend.
export const bindRoleToUserSchema = s.extendSchema(
    routes['/iam/roles/{id}/bind/user'].POST.body!,
    { id: s.number() },
);
export type BindRoleToUserInput = s.Infer<typeof bindRoleToUserSchema>;

export const bindRoleToGroupSchema = s.extendSchema(
    routes['/iam/roles/{id}/bind/group'].POST.body!,
    { id: s.number() },
);
export type BindRoleToGroupInput = s.Infer<typeof bindRoleToGroupSchema>;

export const unbindRoleSchema = s.extendSchema(
    routes['/iam/roles/{id}/bind'].DELETE.body!,
    { id: s.number() },
);
export type UnbindRoleInput = s.Infer<typeof unbindRoleSchema>;

// -- Permissions --------------------------------------------------------------

// addPermissionToRole: URL-param role id + a PermissionInput payload.
export const addPermissionToRoleSchema = s.object({
    id: s.number(),
    permission: validators.PermissionInput,
});
export type AddPermissionToRoleInput = s.Infer<typeof addPermissionToRoleSchema>;

export const createPermissionBodySchema = routes['/iam/permissions'].POST.body!;
export type CreatePermissionBody = s.Infer<typeof createPermissionBodySchema>;

export const deletePermissionSchema = routes['/iam/permissions/{id}'].DELETE.params!;
export type DeletePermissionInput = s.Infer<typeof deletePermissionSchema>;

export const fetchPermissionsQuerySchema = routes['/iam/permissions'].GET.query!;
export type FetchPermissionsQuery = s.Infer<typeof fetchPermissionsQuerySchema>;

// -- Groups -------------------------------------------------------------------

export const fetchGroupsQuerySchema = routes['/iam/groups'].GET.query!;
export type FetchGroupsQuery = s.Infer<typeof fetchGroupsQuerySchema>;

export const createGroupBodySchema = routes['/iam/groups'].POST.body!;
export type CreateGroupBody = s.Infer<typeof createGroupBodySchema>;

export const updateGroupCommandSchema = s.extendSchema(
    routes['/iam/groups/{id}'].PUT.body!,
    { id: s.number() },
);
export type UpdateGroupCommand = s.Infer<typeof updateGroupCommandSchema>;

export const deleteGroupSchema = routes['/iam/groups/{id}'].DELETE.params!;
export type DeleteGroupInput = s.Infer<typeof deleteGroupSchema>;

// -- Group members ------------------------------------------------------------

export const addGroupMemberSchema = s.extendSchema(
    routes['/iam/groups/{id}/users'].POST.body!,
    { id: s.number() },
);
export type AddGroupMemberInput = s.Infer<typeof addGroupMemberSchema>;

export const removeGroupMemberSchema = routes['/iam/groups/{id}/users/{userId}'].DELETE.params!;
export type RemoveGroupMemberInput = s.Infer<typeof removeGroupMemberSchema>;

// UI-only picker schema for AddGroupMemberDialog.
export const groupMemberPickerSchema = s.object({
    userId: s.refined(
        s.string(),
        v => v.length >= 1,
        'Please select a user',
    ),
});
export type GroupMemberPickerInput = s.Infer<typeof groupMemberPickerSchema>;

// -- Service accounts ---------------------------------------------------------

export const fetchServiceAccountsQuerySchema = routes['/iam/service-accounts'].GET.query!;
export type FetchServiceAccountsQuery = s.Infer<typeof fetchServiceAccountsQuerySchema>;

export const createServiceAccountBodySchema = routes['/iam/service-accounts'].POST.body!;
export type CreateServiceAccountBody = s.Infer<typeof createServiceAccountBodySchema>;

export const updateServiceAccountCommandSchema = s.extendSchema(
    routes['/iam/service-accounts/{id}'].PATCH.body!,
    { id: s.number() },
);
export type UpdateServiceAccountCommand = s.Infer<typeof updateServiceAccountCommandSchema>;

export const deleteServiceAccountSchema = routes['/iam/service-accounts/{id}'].DELETE.params!;
export type DeleteServiceAccountInput = s.Infer<typeof deleteServiceAccountSchema>;

// Service account → role binding (path id = role id, body has serviceAccountId).
export const bindRoleToServiceAccountSchema = s.extendSchema(
    routes['/iam/roles/{id}/bind/service-account'].POST.body!,
    { id: s.number() },
);
export type BindRoleToServiceAccountInput = s.Infer<typeof bindRoleToServiceAccountSchema>;

// Direct permission bind/unbind for a service account.
export const bindPermissionToServiceAccountBodySchema
    = routes['/iam/permissions/bind/service-account'].POST.body!;
export type BindPermissionToServiceAccountInput = s.Infer<
    typeof bindPermissionToServiceAccountBodySchema
>;

export const unbindPermissionFromServiceAccountBodySchema
    = routes['/iam/permissions/bind/service-account'].DELETE.body!;
export type UnbindPermissionFromServiceAccountInput = s.Infer<
    typeof unbindPermissionFromServiceAccountBodySchema
>;

// Effective permissions list — path id + optional tenant query.
export const fetchServiceAccountPermissionsSchema = s.object({
    id: s.number(),
    tenantId: s.optional(s.string()),
});
export type FetchServiceAccountPermissionsInput = s.Infer<
    typeof fetchServiceAccountPermissionsSchema
>;

// Service account → API keys.
export const fetchServiceAccountApiKeysSchema = s.object({ id: s.number() });
export type FetchServiceAccountApiKeysInput = s.Infer<
    typeof fetchServiceAccountApiKeysSchema
>;

export const mintServiceAccountApiKeyCommandSchema = s.extendSchema(
    routes['/admin/service-accounts/{id}/api-keys'].POST.body!,
    { id: s.number() },
);
export type MintServiceAccountApiKeyCommand = s.Infer<
    typeof mintServiceAccountApiKeyCommandSchema
>;

export const revokeServiceAccountApiKeySchema
    = routes['/admin/service-accounts/{id}/api-keys/{keyId}'].DELETE.params!;
export type RevokeServiceAccountApiKeyInput = s.Infer<
    typeof revokeServiceAccountApiKeySchema
>;

// -- Sessions -----------------------------------------------------------------

export const revokeSessionSchema = routes['/auth/sessions/{id}'].DELETE.params!;
export type RevokeSessionInput = s.Infer<typeof revokeSessionSchema>;

export const revokeAllSessionsSchema = routes['/auth/sessions'].DELETE.body!;
export type RevokeAllSessionsInput = s.Infer<typeof revokeAllSessionsSchema>;

// -- Query args (searches) ----------------------------------------------------

export const searchUsersSchema = routes['/auth/users'].GET.query!;
export type SearchUsersInput = s.Infer<typeof searchUsersSchema>;

export const searchGroupsSchema = routes['/iam/groups'].GET.query!;
export type SearchGroupsInput = s.Infer<typeof searchGroupsSchema>;

// -- UI-only pickers (no API counterpart) -------------------------------------

// Subject-picker (user or group) form schema used by both halves of
// RoleBindingSheet.
export const subjectPickerSchema = s.object({
    subjectId: s.refined(
        s.string(),
        v => v.length >= 1,
        'Please select one',
    ),
});
export type SubjectPickerInput = s.Infer<typeof subjectPickerSchema>;

// AddPermissionRoleDialog's picker.
export const permissionPickerSchema = s.object({
    permissionId: s.refined(
        s.string(),
        v => v.length >= 1,
        'Please select a permission',
    ),
});
export type PermissionPickerInput = s.Infer<typeof permissionPickerSchema>;
