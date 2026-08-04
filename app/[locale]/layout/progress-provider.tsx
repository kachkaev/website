"use client";

import { ProgressProvider as AppProgressProvider } from "@bprogress/next/app";
import type * as React from "react";

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  return (
    <AppProgressProvider
      delay={300}
      disableStyle={true}
      options={{ showSpinner: false }}
      startPosition={0.1}
    >
      {children}
    </AppProgressProvider>
  );
}
