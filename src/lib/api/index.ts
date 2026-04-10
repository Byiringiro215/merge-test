import { PUBLIC_API_URL } from "$env/static/public";
import { createFetch, bearerWithRefresh } from "@bajustone/fetcher";
import type { paths } from "./paths";
import { routes } from "virtual:fetcher";
import { getAccessToken, refreshAccessToken } from "$lib/auth/index.svelte";

export const api = createFetch<paths>({
	baseUrl: `${PUBLIC_API_URL}/v1`,
	routes,
	middleware: [
		bearerWithRefresh<paths>({
			getToken: getAccessToken,
			refresh: async () => {
				const ok = await refreshAccessToken();
				if (!ok) throw new Error("token refresh failed");
				const token = getAccessToken();
				if (!token) throw new Error("token refresh produced no token");
				return token;
			},
			exclude: ["/auth/login", "/auth/logout", "/auth/refresh"],
		}),
	],
});
