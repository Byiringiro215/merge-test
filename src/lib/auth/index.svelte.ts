import { goto } from "$app/navigation";
import { PUBLIC_API_URL } from "$env/static/public";
import type { AuthUser } from "./schemas";

// -- State --------------------------------------------------------------------

let accessToken: string | null = $state(null);
let refreshToken: string | null = $state(null);
let user: AuthUser | null = $state(null);
let isLoading: boolean = $state(true);
const isAuthenticated: boolean = $derived(accessToken !== null);

let refreshTimerId: ReturnType<typeof setTimeout> | null = null;
let refreshPromise: Promise<boolean> | null = null;

// Refresh 1 minute before expiry (access token is 5 min = 300s)
const REFRESH_INTERVAL_MS = 4 * 60 * 1000;

// -- Helpers ------------------------------------------------------------------

async function authFetch<T>(
	path: string,
	options?: RequestInit,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
	try {
		const response = await fetch(`${PUBLIC_API_URL}${path}`, {
			...options,
			headers: {
				"Content-Type": "application/json",
				...options?.headers,
			},
		});

		const json = await response.json();

		if (!response.ok) {
			const message =
				json?.error?.message ?? json?.message ?? response.statusText;
			return { ok: false, error: message };
		}

		return { ok: true, data: json as T };
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Network error",
		};
	}
}

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
	};
}

export function getAccessToken(): string | null {
	return accessToken;
}

export async function login(
	email: string,
	password: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
	const result = await authFetch<{
		data: {
			accessToken: string;
			refreshToken: string;
			user: AuthUser;
		};
	}>("/v1/auth/login", {
		method: "POST",
		body: JSON.stringify({ email, password }),
	});

	if (!result.ok) {
		return { ok: false, error: result.error };
	}

	accessToken = result.data.data.accessToken;
	refreshToken = result.data.data.refreshToken;

	await fetchUser();
	scheduleRefresh();

	return { ok: true };
}

export async function logout() {
	if (refreshToken) {
		await authFetch("/v1/auth/logout", {
			method: "POST",
			body: JSON.stringify({ refreshToken }),
		});
	}

	accessToken = null;
	refreshToken = null;
	user = null;
	clearRefreshTimer();
	refreshPromise = null;

	goto("/signin");
}

export async function fetchUser(): Promise<void> {
	if (!accessToken) return;

	const result = await authFetch<{
		data: AuthUser;
	}>("/v1/auth/me", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	if (result.ok) {
		user = result.data.data;
	}
}

export async function refreshAccessToken(): Promise<boolean> {
	if (refreshPromise) return refreshPromise;

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

	const result = await authFetch<{
		data: { accessToken: string; refreshToken: string };
	}>("/v1/auth/refresh", {
		method: "POST",
		body: JSON.stringify({ refreshToken }),
	});

	if (!result.ok) {
		await logout();
		return false;
	}

	accessToken = result.data.data.accessToken;
	refreshToken = result.data.data.refreshToken;
	scheduleRefresh();
	return true;
}

export function tryRestoreSession() {
	isLoading = false;
}
