import { PUBLIC_API_URL } from "$env/static/public";
import { ZodType } from "zod/v4";

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
        if (json.message) {
            return {
                ...response,
                result: Err(new Error(json.message)),
            };
        } else {
            return {
                ...response,
                result: Err(new Error(response.statusText)),
            };
        }
    }
    if (!bodySchema) {
        return {
            ...response,
            result: Ok(json as T),
        };
    }
    // const contentType = response.headers.get("content-type");
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
    // const contentType = response.headers.get("content-type");
    return {
        ...response,
        result: Err(new Error("cannot handler result")),
    };
}

const ResponseHandlers: Record<
    string,
    <T>(
        response: Response,
        bodySchema?: ZodType<T>,
    ) => Promise<FetcherResponse<T>>
> = {
    "application/json": jsonResultHandler,
    default: defaultResultHandler,
};
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
    const {
        bodySchema,
        defaultFetch = fetch,
        ...init
    } = options ?? {};
    const baseUrl = PUBLIC_API_URL;
    const endpoint = new URL(`${baseUrl}${path}`);
    for (const [k, v] of Object.entries(queries ?? {})) {
        endpoint.searchParams.append(k, v);
    }
    if (options?.body)
        init.headers = {
            "Content-Type": "application/json",
        };
    const response = await defaultFetch(endpoint, {
        ...init,
    });
    const contentType = response.headers.get("content-type");

    const responseHandler = contentType
        ? ResponseHandlers[contentType]
        : ResponseHandlers["default"];

    return responseHandler(response, bodySchema);
}
