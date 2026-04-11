import type { Cookies } from '@sveltejs/kit';
import { dev } from '$app/environment';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

const cookieOptions = {
    httpOnly: true,
    secure: !dev,
    sameSite: 'lax' as const,
    path: '/',
};

export function setAuthCookies(
    cookies: Cookies,
    tokens: { accessToken: string; refreshToken: string },
) {
    cookies.set(ACCESS_TOKEN, tokens.accessToken, {
        ...cookieOptions,
        maxAge: 5 * 60, // 5 minutes (matches JWT expiry)
    });
    cookies.set(REFRESH_TOKEN, tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });
}

export function clearAuthCookies(cookies: Cookies) {
    cookies.delete(ACCESS_TOKEN, { path: '/' });
    cookies.delete(REFRESH_TOKEN, { path: '/' });
}

export function getAuthCookies(cookies: Cookies) {
    return {
        accessToken: cookies.get(ACCESS_TOKEN) ?? null,
        refreshToken: cookies.get(REFRESH_TOKEN) ?? null,
    };
}
