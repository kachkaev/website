import { Shell } from "./layout/shell";

export default function Root({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}

export const dynamic = "force-dynamic";
