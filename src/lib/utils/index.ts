import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomArray(size: number, min: number = 1, max: number = 100): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatComplexity(complexity: string): string {
  return complexity.replace(/\*\*/g, '^').replace(/log/g, 'log');
}

export function getSpeedDelay(speed: number): number {
  // Convert speed (1-10) to delay in milliseconds
  // Speed 1 = 1000ms, Speed 10 = 50ms
  return Math.max(50, 1050 - speed * 100);
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, delay);
    }
  };
}

export const ALGORITHM_COLORS = {
  sorting: 'from-blue-500 to-purple-600',
  searching: 'from-green-500 to-teal-600', 
  graph: 'from-orange-500 to-red-600',
  dataStructures: 'from-pink-500 to-rose-600',
  stringProcessing: 'from-indigo-500 to-blue-600',
} as const;
