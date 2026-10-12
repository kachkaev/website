import * as React from "react";

/**
 * Shows a fallback until the images inside have loaded, then fades them in together.
 * This avoids repaints from images appearing one by one.
 *
 * React only waits for images within `<ViewTransition>`, and only for a short time,
 * after which the images are revealed anyway. During server rendering, `<ViewTransition>`
 * needs to be a direct child of `<Suspense>` for this to work.
 *
 * Images must not have `onLoad` or `loading="lazy"`, so `next/image` should be replaced
 * with `<img {...getImageProps(…).props} />`.
 */
export function ImageReveal({
  fallback,
  children,
}: {
  fallback: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <React.Suspense fallback={fallback}>
      <React.ViewTransition>{children}</React.ViewTransition>
    </React.Suspense>
  );
}
