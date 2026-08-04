import { notFound } from "next/navigation";

/**
 * Renders not-found.tsx for any pathname that does not match a page
 */
export default function Page(): never {
  notFound();
}
