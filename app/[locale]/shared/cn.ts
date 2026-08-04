import { twMerge as mergeTailwindClasses } from "tailwind-merge";

/**
 * Same as `ClassNameValue` from `tailwind-merge`, but without support for
 * arrays (to keep arguments simple)
 */
type ClassNameValue = string | null | undefined | 0 | false;

/**
 * Wrapping class names into this helper lets eslint-plugin-better-tailwindcss
 * check them, which does not happen for plain strings outside `className`.
 *
 * @example `cn('foo', condition && 'bar', condition && 'baz')`
 */
export function cn(...inputs: ClassNameValue[]): string {
  return mergeTailwindClasses(inputs);
}
