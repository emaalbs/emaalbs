"use client";

import { useEffect, useState } from "react";
import { Languages, LoaderCircle, Save } from "lucide-react";

type Locale = "en" | "ar";

function shouldTranslate(value: string): boolean {
	const text = value.trim();
	if (text.length < 2) return false;
	if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(text)) return false;
	if (/^[-+\d\s:/.]+$/.test(text)) return false;
	if (/^#[0-9a-f]{3,8}$/i.test(text)) return false;
	return true;
}

async function translateText(text: string, sourceLocale: Locale, targetLocale: Locale): Promise<string> {
	if (!shouldTranslate(text)) return text;
	const response = await fetch("/api/admin/translate", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ text, sourceLocale, targetLocale }),
	});
	const data = (await response.json()) as { translatedText?: string; error?: string };
	if (!response.ok || !data.translatedText) throw new Error(data.error || "Translation failed");
	return data.translatedText;
}

async function translatePayload(value: unknown, sourceLocale: Locale, targetLocale: Locale): Promise<unknown> {
	if (typeof value === "string") return translateText(value, sourceLocale, targetLocale);
	if (Array.isArray(value)) {
		const translated: unknown[] = [];
		for (const item of value) translated.push(await translatePayload(item, sourceLocale, targetLocale));
		return translated;
	}
	if (value && typeof value === "object") {
		const translated: Record<string, unknown> = {};
		for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
			translated[key] = await translatePayload(item, sourceLocale, targetLocale);
		}
		return translated;
	}
	return value;
}

export default function IbsOverviewEditorPage() {
	const [locale, setLocale] = useState<Locale>("en");
	const [documents, setDocuments] = useState<Record<Locale, string>>({ en: "{}", ar: "{}" });
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [translating, setTranslating] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		async function load() {
			setLoading(true);
			setError("");
			try {
				const [enResponse, arResponse] = await Promise.all([
					fetch("/api/ibs/overview?locale=en"),
					fetch("/api/ibs/overview?locale=ar"),
				]);
				if (!enResponse.ok || !arResponse.ok) throw new Error("Unable to load both language versions");
				const [en, ar] = await Promise.all([enResponse.json(), arResponse.json()]);
				setDocuments({ en: JSON.stringify(en, null, 2), ar: JSON.stringify(ar, null, 2) });
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unable to load overview content");
			} finally {
				setLoading(false);
			}
		}
		void load();
	}, []);

	async function save() {
		setSaving(true);
		setMessage("");
		setError("");
		try {
			for (const targetLocale of ["en", "ar"] as const) {
				const parsed = JSON.parse(documents[targetLocale]) as Record<string, unknown>;
				for (const [block, payload] of Object.entries(parsed)) {
					const response = await fetch("/api/ibs/overview", {
						method: "PUT",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ block, locale: targetLocale, payload }),
					});
					if (!response.ok) throw new Error(`Failed to save ${targetLocale.toUpperCase()} block: ${block}`);
				}
			}
			setMessage("Both language versions were saved.");
		} catch (err) {
			setError(err instanceof Error ? err.message : "Save failed");
		} finally {
			setSaving(false);
		}
	}

	async function translateCurrent() {
		const sourceLocale = locale;
		const targetLocale: Locale = locale === "en" ? "ar" : "en";
		setTranslating(true);
		setMessage("");
		setError("");
		try {
			const parsed = JSON.parse(documents[sourceLocale]) as Record<string, unknown>;
			const translated = await translatePayload(parsed, sourceLocale, targetLocale);
			setDocuments((current) => ({ ...current, [targetLocale]: JSON.stringify(translated, null, 2) }));
			setLocale(targetLocale);
			setMessage(`Translated into ${targetLocale === "ar" ? "Arabic" : "English"}. Review and edit the result before saving.`);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Translation failed");
		} finally {
			setTranslating(false);
		}
	}

	return (
		<div>
			<div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">IBS Overview Editor</h1>
					<p className="mt-1 text-sm text-gray-500">Edit either language or translate the complete structured content into the other language.</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<button
						type="button"
						onClick={translateCurrent}
						disabled={loading || translating || saving}
						className="inline-flex h-10 items-center gap-2 rounded-lg border border-[#007F84]/30 bg-[#007F84]/5 px-4 text-sm font-semibold text-[#00666A] transition hover:bg-[#007F84]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007F84] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
					>
						{translating ? <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : <Languages className="h-4 w-4" />}
						{translating ? "Translating..." : locale === "en" ? "Translate EN → AR" : "Translate AR → EN"}
					</button>
					<button
						type="button"
						onClick={save}
						disabled={saving || loading || translating}
						className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#01334D] px-4 text-sm font-semibold text-white transition hover:bg-[#011E2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007F84] disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
					>
						<Save className="h-4 w-4" />
						{saving ? "Saving..." : "Save both languages"}
					</button>
				</div>
			</div>

			<div className="mb-4 flex gap-2">
				{(["en", "ar"] as const).map((itemLocale) => (
					<button
						key={itemLocale}
						type="button"
						onClick={() => setLocale(itemLocale)}
						className={`rounded-lg px-3 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007F84] ${locale === itemLocale ? "bg-[#01334D] text-white" : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"}`}
					>
						{itemLocale.toUpperCase()}
					</button>
				))}
			</div>

			{error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
			{message && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}

			{loading ? (
				<div className="text-gray-400">Loading...</div>
			) : (
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<textarea
						value={documents[locale]}
						onChange={(event) => setDocuments((current) => ({ ...current, [locale]: event.target.value }))}
						dir="ltr"
						className="h-[60vh] w-full rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-900 outline-none transition focus:border-[#007F84] focus:ring-1 focus:ring-[#007F84]/20"
						spellCheck={false}
					/>
				</div>
			)}
		</div>
	);
}
