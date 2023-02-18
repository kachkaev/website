import { getDictionary } from "../../get-dictionary";
import type { Locale } from "../../i18n-config";

export default async function IndexPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div>
      <h1 className="text-3xl font-bold">
        {dictionary.index["h1.firstName"]} {dictionary.index["h1.lastName"]}
      </h1>
      <p>Current locale: {lang}</p>
    </div>
  );
}
