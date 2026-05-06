"use client";

import { useEffect } from "react";
import { useI18n } from "@/i18n/provider";

export function HtmlAttrs() {
	const { locale, dir } = useI18n();
	useEffect(() => {
		document.documentElement.lang = locale;
		document.documentElement.dir = dir;
	}, [locale, dir]);
	return null;
}
