import type { ClassValue } from 'clsx';
import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;

export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

export type InputProps = WithElementRef<
    Omit<HTMLInputAttributes, 'type'>
    &({ type: 'file'; files?: FileList } | { type?: InputType; files?: undefined })
>;
