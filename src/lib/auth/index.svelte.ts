import type { Schema } from '$lib/api/paths';
import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { api } from '$lib/api';
import { extractErrorMessage } from '@bajustone/fetcher';

// -- Types --------------------------------------------------------------------

export type AuthUser = Schema<'User'>;
export type Permission = Schema<'Permission'>;
export type Resource = Permission['resource'];
export type Action = Permission['action'];

// -- State --------------------------------------------------------------------

let accessToken: string | null = $state(null);
let refreshToken: string | null = $state(null);
let user: AuthUser | null = $state(null);
let isLoading: boolean = $state(true);
const isAuthenticated: boolean = $derived(accessToken !== null);

let permissions: Permission[] = $state([]);
let permissionsLoaded: boolean = $state(false);
const checkCache = new Map<string, boolean>();

let refreshTimerId: ReturnType<typeof setTimeout> | null = null;
let refreshPromise: Promise<boolean> | null = null;

// Refresh 1 minute before expiry (access token is 5 min = 300s)
const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

// -- Helpers ------------------------------------------------------------------

function clearRefreshTimer() {
  if (refreshTimerId !== null) {
    clearTimeout(refreshTimerId);
    refreshTimerId = null;
  }
}

function scheduleRefresh() {
  clearRefreshTimer();
  refreshTimerId = setTimeout(() => {
    refreshAccessToken();
  }, REFRESH_INTERVAL_MS);
}

// -- Permissions --------------------------------------------------------------

async function fetchPermissions(): Promise<void> {
  if (!user)
return;
  const result = await api
    .get('/iam/users/{id}/permissions', {
      params: { id: String(user.id) },
    })
    .result();
  if (result.ok) {
    permissions = result.data;
    permissionsLoaded = true;
    checkCache.clear();
  }
}

function evaluateLocal(resource: Resource, action: Action): boolean {
  const matching = permissions.filter(
    p => p.resource === resource && p.action === action,
  );
  if (matching.length === 0)
return false;
  if (matching.some(p => p.effect === 'DENY'))
return false;
  return matching.some(p => p.effect === 'ALLOW');
}

export async function checkPermission(
  resource: Resource,
  action: Action,
): Promise<boolean> {
  if (permissionsLoaded) {
    return evaluateLocal(resource, action);
  }
  const key = `${resource}:${action}`;
  if (checkCache.has(key))
return checkCache.get(key)!;
  if (!user)
return false;
  const result = await api
    .post('/iam/check', {
      body: { userId: user.id, resource, action },
    })
    .result();
  const allowed = result.ok ? result.data.allowed : false;
  checkCache.set(key, allowed);
  return allowed;
}

export function hasPermission(resource: Resource, action: Action): boolean {
  if (!permissionsLoaded)
return false;
  return evaluateLocal(resource, action);
}

// -- Public API ---------------------------------------------------------------

export function getAuthState() {
  return {
    get user() {
      return user;
    },
    get isAuthenticated() {
      return isAuthenticated;
    },
    get isLoading() {
      return isLoading;
    },
    get permissionsLoaded() {
      return permissionsLoaded;
    },
  };
}

export function getAccessToken(): string | null {
  return accessToken;
}

export async function login(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await api.post('/auth/login', {
    body: { identifier: email, password },
  }).result();

  if (!result.ok) {
    return { ok: false, error: extractErrorMessage(result.error) };
  }

  // `AuthResponse` is a discriminated union over `status`. Only `success`
  // hands out tokens — `pending` (email verification) and `impersonation`
  // (admin acting-as) are deferred until product flows for them exist.
  const body = result.data;

  if (body.status !== 'success') {
    const message
      = body.status === 'pending'
        ? 'Account pending verification.'
        : 'Impersonation login is not supported yet.';
    return { ok: false, error: message };
  }

  accessToken = body.accessToken;
  refreshToken = body.refreshToken;
  user = body.user;
  scheduleRefresh();
  fetchPermissions();

  return { ok: true };
}

export async function logout() {
  if (refreshToken) {
    await api.post('/auth/logout', {
      body: { refreshToken },
    });
  }

  accessToken = null;
  refreshToken = null;
  user = null;
  permissions = [];
  permissionsLoaded = false;
  checkCache.clear();
  clearRefreshTimer();
  refreshPromise = null;

  goto(resolve('/signin'));
}

export async function fetchUser(): Promise<void> {
  if (!accessToken)
return;

  const result = await api.get('/auth/me').result();

  if (result.ok) {
    user = result.data;
  }
}

export async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise)
return refreshPromise;

  refreshPromise = doRefresh();
  const result = await refreshPromise;
  refreshPromise = null;
  return result;
}

async function doRefresh(): Promise<boolean> {
  if (!refreshToken) {
    await logout();
    return false;
  }

  const result = await api.post('/auth/refresh', {
    body: { refreshToken },
  }).result();

  if (!result.ok) {
    await logout();
    return false;
  }

  const body = result.data;
  accessToken = body.accessToken;
  refreshToken = body.refreshToken;
  scheduleRefresh();
  fetchPermissions();
  return true;
}

export function setSession(data: { accessToken: string; refreshToken: string; user: AuthUser }) {
  accessToken = data.accessToken;
  refreshToken = data.refreshToken;
  user = data.user;
  scheduleRefresh();
  fetchPermissions();
}

export function tryRestoreSession() {
  isLoading = false;
}
