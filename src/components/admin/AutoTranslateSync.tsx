"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftRight, Check, Languages, LoaderCircle } from "lucide-react";

type Locale = "en" | "ar";
type Status = "idle" | "translating" | "success" | "error";

type Props = {
	enValue: string;
	arValue: string;
	onEnChange: (value: string) => void;
	onArChange: (value: string) => void;
	delayMs?: number;
	className?: string;
};

export function AutoTranslateSync({
	enValue,
	arValue,
	onEnChange,
	onArChange,
	delayMs = 900,
	className = "",
}: Props) {
	const [autoTranslate, setAutoTranslate] = useState(true);
	const [status, setStatus] = useState<Status>("idle");
	const [direction, setDirection] = useState<`${Locale}-${Locale}` | null>(null);
	const [error, setError] = useState("");
	const previousValues = useRef({ en: enValue, ar: arValue });
	const applyingLocale = useRef<Locale | null>(null);
	const requestId = useRef(0);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const translate = useCallback(async (sourceLocale: Locale) => {
		const targetLocale: Locale = sourceLocale === "en" ? "ar" : "en";
		const text = sourceLocale === "en" ? enValue : arValue;
		if (text.trim().length < 2) return;

		const currentRequest = ++requestId.current;
		setStatus("translating");
		setDirection(`${sourceLocale}-${targetLocale}`);
		setError("");

		try {
			const response = await fetch("/api/admin/translate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text, sourceLocale, targetLocale }),
			});
			const data = (await response.json()) as { translatedText?: string; error?: string };
			if (!response.ok || !data.translatedText) throw new Error(data.error || "Translation failed");
			if (currentRequest !== requestId.current) return;

			applyingLocale.current = targetLocale;
			if (targetLocale === "ar") onArChange(data.translatedText);
			else onEnChange(data.translatedText);
			setStatus("success");
		} catch (err) {
			if (currentRequest !== requestId.current) return;
			setStatus("error");
			setError(err instanceof Error ? err.message : "Translation failed");
		}
	}, [arValue, enValue, onArChange, onEnChange]);

	useEffect(() => {
		const previous = previousValues.current;
		const enChanged = enValue !== previous.en;
		const arChanged = arValue !== previous.ar;
		previousValues.current = { en: enValue, ar: arValue };

		if (applyingLocale.current) {
			const appliedChange = applyingLocale.current === "en" ? enChanged : arChanged;
			if (appliedChange) applyingLocale.current = null;
			return;
		}
		if (!autoTranslate || enChanged === arChanged) return;

		const sourceLocale: Locale = enChanged ? "en" : "ar";
		const sourceText = sourceLocale === "en" ? enValue : arValue;
		if (sourceText.trim().length < 2) return;

		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(() => void translate(sourceLocale), delayMs);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [arValue, autoTranslate, delayMs, enValue, translate]);

	useEffect(() => {
		if (status !== "success") return;
		const timer = setTimeout(() => setStatus("idle"), 1800);
		return () => clearTimeout(timer);
	}, [status]);

	const actionClass = "inline-flex min-h-8 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2.5 text-[11px] font-semibold text-gray-600 transition hover:border-[#007F84]/40 hover:bg-[#007F84]/5 hover:text-[#01334D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007F84] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none";

	return (
		<div className={`flex flex-wrap items-center gap-2 ${className}`}>
			<button
				type="button"
				onClick={() => setAutoTranslate((current) => !current)}
				aria-pressed={autoTranslate}
				className={`inline-flex min-h-8 items-center gap-1.5 rounded-md px-2.5 text-[11px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007F84] motion-reduce:transition-none ${autoTranslate ? "bg-[#007F84]/10 text-[#00666A]" : "bg-gray-100 text-gray-500"}`}
			>
				<Languages className="h-3.5 w-3.5" />
				Auto translate {autoTranslate ? "on" : "off"}
			</button>
			<button type="button" onClick={() => void translate("en")} disabled={status === "translating" || enValue.trim().length < 2} className={actionClass}>
				EN <ArrowLeftRight className="h-3 w-3" /> AR
			</button>
			<button type="button" onClick={() => void translate("ar")} disabled={status === "translating" || arValue.trim().length < 2} className={actionClass}>
				AR <ArrowLeftRight className="h-3 w-3" /> EN
			</button>
			{status === "translating" && (
				<span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#007F84]">
					<LoaderCircle className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" />
					Translating {direction === "en-ar" ? "to Arabic" : "to English"}...
				</span>
			)}
			{status === "success" && (
				<span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600">
					<Check className="h-3.5 w-3.5" /> Updated — you can edit the result
				</span>
			)}
			{status === "error" && <span className="text-[11px] font-medium text-red-600">{error}</span>}
		</div>
	);
}
