import { PUBLIC_API_URL } from "$env/static/public";
import { ZodType } from "zod/v4";
import { getAccessToken, refreshAccessToken } from "$lib/auth/index.svelte";

export type Result<T> =
    | {
        ok: true;
        value: T;
    }
    | {
        ok: false;
        error: Error;
    };

export function Ok<T>(value: T): Result<T> {
    return {
        ok: true,
        value,
    };
}

export function Err<T = unknown>(error: Error): Result<T> {
    return {
        ok: false,
        error,
    };
}

export type FetcherResponse<T> = Response & {
    result: Result<T>;
};

export type FetcherOptions<T, R = unknown> = RequestInit & {
    bodySchema?: ZodType<T>;
    requestBodySchema?: ZodType<R>;
    auth?: boolean;
    defaultFetch?: (
        input: RequestInfo | URL,
        init?: RequestInit,
    ) => Promise<Response>;
};

async function jsonResultHandler<T>(
    response: Response,
    bodySchema?: ZodType<T>,
): Promise<FetcherResponse<T>> {
    const json = await response.clone().json();

    if (!response.ok) {
        const message =
            json?.error?.message ?? json?.message ?? response.statusText;
        return {
            ...response,
            result: Err(new Error(message)),
        };
    }
    if (!bodySchema) {
        return {
            ...response,
            result: Ok(json as T),
        };
    }
    const parseResult = bodySchema.safeParse(json);
    if (parseResult.error) {
        return {
            ...response,
            result: Err(new Error("")),
        };
    }
    return {
        ...response,
        result: Ok(parseResult.data),
    };
}

async function defaultResultHandler<T>(
    response: Response,
): Promise<FetcherResponse<T>> {
    return {
        ...response,
        result: Err(new Error("cannot handler result")),
    };
}

function getResponseHandler<T>(contentType: string | null) {
    if (contentType && contentType.includes("application/json")) {
        return jsonResultHandler<T>;
    }
    return defaultResultHandler<T>;
}

async function doFetch<T, R = unknown>(
    path: RequestInfo | URL,
    options?: FetcherOptions<T, R>,
    queries?: { [key: string]: string },
): Promise<FetcherResponse<T>> {
    const {
        bodySchema,
        auth: authEnabled = true,
        defaultFetch = fetch,
        ...init
    } = options ?? {};

    const baseUrl = PUBLIC_API_URL;
    const endpoint = new URL(`${baseUrl}${path}`);
    for (const [k, v] of Object.entries(queries ?? {})) {
        endpoint.searchParams.append(k, v);
    }

    const headers = new Headers(init.headers);
    if (options?.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    if (authEnabled) {
        const token = getAccessToken();
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
    }

    const response = await defaultFetch(endpoint, {
        ...init,
        headers,
    });

    const contentType = response.headers.get("content-type");
    const responseHandler = getResponseHandler<T>(contentType);

    return responseHandler(response, bodySchema);
}

/**
 *  this `fetcher` method starts the process of fetching a resource from the network,
 *  returning a promise that is fulfilled once the response is available
 *
 **/
export async function customFetcher<T, R = unknown>(
    path: RequestInfo | URL,
    options?: FetcherOptions<T, R>,
    queries?: { [key: string]: string },
): Promise<FetcherResponse<T>> {
    const response = await doFetch(path, options, queries);

    // Auto-retry on 401 if auth is enabled
    const authEnabled = options?.auth !== false;
    if (response.status === 401 && authEnabled) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            return doFetch(path, options, queries);
        }
    }

    return response;
}
