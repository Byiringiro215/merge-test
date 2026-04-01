import { z } from "zod/v4";

// -- User schemas -------------------------------------------------------------

export const userProfileSchema = z.object({
	id: z.number(),
	email: z.string(),
	name: z.string(),
	isActive: z.boolean(),
	createdAt: z.string(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

// -- Auth response schemas ----------------------------------------------------

export const loginResponseSchema = z.object({
	data: z.object({
		accessToken: z.string(),
		refreshToken: z.string(),
		user: userProfileSchema,
	}),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const refreshResponseSchema = z.object({
	data: z.object({
		accessToken: z.string(),
		refreshToken: z.string(),
	}),
});

export type RefreshResponse = z.infer<typeof refreshResponseSchema>;

export const logoutResponseSchema = z.object({
	data: z.object({
		message: z.string(),
	}),
});

export type LogoutResponse = z.infer<typeof logoutResponseSchema>;

export const meResponseSchema = z.object({
	data: z.object({
		id: z.number(),
		email: z.string(),
		name: z.string(),
		isActive: z.boolean(),
		groups: z.array(z.string()),
	}),
});

export type MeResponse = z.infer<typeof meResponseSchema>;

export type AuthUser = MeResponse["data"];

// -- Error schema -------------------------------------------------------------

export const authErrorSchema = z.object({
	error: z.object({
		message: z.string(),
		statusCode: z.number(),
	}),
});

export type AuthError = z.infer<typeof authErrorSchema>;
