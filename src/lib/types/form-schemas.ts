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

export const deleteUserSchema = s.object({ id: s.number() });
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
