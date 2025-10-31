// Inspired by:
// https://github.com/apal21/nextjs-progressbar/issues/86#issuecomment-1447977706
// https://github.com/vercel/next.js/discussions/41745#discussioncomment-4208449

"use client";
import NProgress from "nprogress";
import * as React from "react";

type PushStateInput = [
  data: unknown,
  unused: string,
  url?: string | URL | null | undefined,
];

export default function NextAppNprogress({
  color = "#29d",
  height = "2px",
}: {
  color?: string | undefined;
  height?: string | number | undefined;
}) {
  const styles = (
    <style>
      {/* Source: https://github.com/rstacruz/nprogress/blob/e1a8b7fb6e059085df5f83c45d3c2308a147ca18/nprogress.css */}
      {`
        #nprogress {
          pointer-events: none;
        }
        #nprogress .bar {
          background: ${color};
          position: fixed;
          z-index: 99999;
          top: 0;
          left: 0;
          width: 100%;
          height: ${typeof height === `string` ? height : `${height}px`};
        }
        #nprogress .peg {
          display: block;
          position: absolute;
          right: 0px;
          width: 100px;
          height: 100%;
          box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
          opacity: 1.0;
          -webkit-transform: rotate(3deg) translate(0px, -4px);
              -ms-transform: rotate(3deg) translate(0px, -4px);
                  transform: rotate(3deg) translate(0px, -4px);
        }
    `}
    </style>
  );

  React.useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleAnchorClick = (event: MouseEvent) => {
      const targetUrl = (event.currentTarget as HTMLAnchorElement).href;
      const currentUrl = location.href;
      if (targetUrl !== currentUrl) {
        NProgress.start();
      }
    };

    const handleMutation = () => {
      const anchorElements = document.querySelectorAll("a");
      for (const anchor of anchorElements) {
        anchor.addEventListener("click", handleAnchorClick);
      }
    };

    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document, { childList: true, subtree: true });
    handleMutation();

    window.history.pushState = new Proxy(
      window.history.pushState.bind(window.history),
      {
        apply: (target, thisArg, argArray: PushStateInput) => {
          NProgress.done();

          target.apply(thisArg, argArray);
        },
      },
    );
  });

  return styles;
}
