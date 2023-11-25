"use client"
import React from "react";
import { setLanguage } from "./shared/libs/i18n";
import { APP_LANGUAGES_TYPE } from "./shared/constants/languages";

const Lang = ({ lang }: { lang: APP_LANGUAGES_TYPE }) => {
  setLanguage(lang);

  return <></>;
};

export default Lang