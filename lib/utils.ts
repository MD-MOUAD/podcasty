import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// todo: remove this
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
