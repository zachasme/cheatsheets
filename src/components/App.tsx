import React from "react";

import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";

import CheatSheet from "./CheatSheet";
import "./App.css";

async function loadCatalog(locale: string) {
  const catalog = await import(`@lingui/loader!../locales/${locale}.po`);
  i18n.load(locale, catalog);
}

i18n.on("activate", loadCatalog);
i18n.activate("en");

export default () => {
  return (
    <I18nProvider i18n={i18n}>
      <CheatSheet />
    </I18nProvider>
  );
};
