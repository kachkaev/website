import { routing } from "../../i18n/routing";
import { Shell } from "./layout/shell";

export default function Root({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
