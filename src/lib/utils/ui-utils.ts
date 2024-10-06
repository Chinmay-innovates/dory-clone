import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export type PropsWithClassName<T = {}> = T & { className?: string };

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
