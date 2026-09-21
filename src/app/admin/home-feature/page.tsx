"use client";

import { useEffect, useState } from "react";
import { Check, Eye, ExternalLink, Save, Sparkles } from "lucide-react";
import type { HomeFeature, HomeFeatureInput } from "@/data/home-feature";
import { EMPTY_HOME_FEATURE } from "@/data/home-feature";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function AdminHomeFeaturePage() {
	const [feature, setFeature] = useState<HomeFeatureInput>({ ...EMPTY_HOME_FEATURE });
	const [previewLocale, setPreviewLocale] = useState<"en" | "ar">("en");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [saved, setSaved] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		fetch("/api/home-feature", { credentials: "same-origin" })
			.then(async (response) => {
				const data = (await response.json()) as HomeFeature | { error?: string };
				if (!response.ok || !("id" in data)) throw new Error("error" in data ? data.error : "Unable to load homepage feature");
				const { id: _id, ...input } = data;
				void _id;
				setFeature(input);
			})
			.catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Unable to load homepage feature"))
			.finally(() => setLoading(false));
	}, []);

	function updateLocalized(field: "kicker" | "title" | "description" | "buttonLabel" | "buttonHref", locale: "en" | "ar", value: string) {
		setFeature((current) => ({ ...current, [field]: { ...current[field], [locale]: value } }));
		setSaved(false);
	}

	async function save() {
		setSaving(true);
		setSaved(false);
		setError("");
		try {
			const response = await fetch("/api/home-feature", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(feature),
			});
			const data = (await response.json()) as HomeFeature | { error?: string };
			if (!response.ok) throw new Error("error" in data && data.error ? data.error : "Unable to save homepage feature");
			setSaved(true);
			window.setTimeout(() => setSaved(false), 2500);
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Unable to save homepage feature");
		} finally {
			setSaving(false);
		}
	}

	if (loading) return <div className="text-sm text-gray-400">Loading homepage feature editor...</div>;

	const localized = {
		kicker: feature.kicker[previewLocale], title: feature.title[previewLocale],
		description: feature.description[previewLocale], buttonLabel: feature.buttonLabel[previewLocale],
	};

	return (
		<div className="pb-12">
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#007F84]">Homepage</p>
					<h1 className="text-2xl font-bold text-gray-900">Homepage Feature</h1>
					<p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Highlight one important blog, news story, or page before the main company introduction.</p>
				</div>
				<button type="button" onClick={save} disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#01334D] px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#011E2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007F84] focus-visible:ring-offset-2 disabled:opacity-50 motion-reduce:transition-none">
					{saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
					{saving ? "Saving..." : saved ? "Saved" : "Save Feature"}
				</button>
			</div>

			{error && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
				<div className="space-y-6">
					<section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
						<div className="mb-5 flex items-start gap-3">
							<div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#007F84]/10 text-[#007F84]"><Sparkles className="h-5 w-5" /></div>
							<div><h2 className="text-base font-semibold text-gray-900">Feature content</h2><p className="mt-1 text-sm text-gray-500">Arabic and English stay editable after automatic translation.</p></div>
						</div>
						<div className="space-y-5">
							<BilingualField label="Small heading" required enValue={feature.kicker.en} arValue={feature.kicker.ar} onEnChange={(value) => updateLocalized("kicker", "en", value)} onArChange={(value) => updateLocalized("kicker", "ar", value)} placeholderEn="Latest from EMAAL" placeholderAr="أحدث أخبار أعمال" />
							<BilingualField label="Main title" required multiline rows={3} enValue={feature.title.en} arValue={feature.title.ar} onEnChange={(value) => updateLocalized("title", "en", value)} onArChange={(value) => updateLocalized("title", "ar", value)} />
							<BilingualField label="Short description" required multiline rows={5} enValue={feature.description.en} arValue={feature.description.ar} onEnChange={(value) => updateLocalized("description", "en", value)} onArChange={(value) => updateLocalized("description", "ar", value)} />
							<BilingualField label="Button text" required enValue={feature.buttonLabel.en} arValue={feature.buttonLabel.ar} onEnChange={(value) => updateLocalized("buttonLabel", "en", value)} onArChange={(value) => updateLocalized("buttonLabel", "ar", value)} placeholderEn="Read the full story" placeholderAr="اقرأ الخبر كاملاً" />
						</div>
					</section>

					<section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
						<h2 className="text-base font-semibold text-gray-900">Button destination</h2>
						<p className="mt-1 text-sm leading-6 text-gray-500">Paste the exact page link for each language. It can point to a blog, news story, gallery, event, or any other website page.</p>
						<div className="mt-5 grid gap-4 md:grid-cols-2">
							<UrlField label="English page URL" value={feature.buttonHref.en} onChange={(value) => updateLocalized("buttonHref", "en", value)} placeholder="/en/blog/article-name" />
							<UrlField label="Arabic page URL" value={feature.buttonHref.ar} onChange={(value) => updateLocalized("buttonHref", "ar", value)} placeholder="/ar/blog/article-name" />
						</div>
					</section>

					<section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
						<h2 className="mb-5 text-base font-semibold text-gray-900">Image and visibility</h2>
						<ImageUpload value={feature.imageUrl} onChange={(imageUrl) => setFeature((current) => ({ ...current, imageUrl }))} label="Feature image" hint="A wide editorial image gives the best result on desktop and mobile." preset="blog-cover" prefix="homepage-feature/" recommendedSize="1600 × 1000 px" />
						<div className="mt-5">
							<label className="mb-1.5 block text-sm font-medium text-gray-700">Image focus</label>
							<select value={feature.imagePosition} onChange={(event) => setFeature((current) => ({ ...current, imagePosition: event.target.value }))} className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none focus:border-[#007F84] sm:max-w-xs">
								<option value="center">Center</option><option value="center top">Top</option><option value="center 35%">Upper center</option><option value="center bottom">Bottom</option>
							</select>
						</div>
						<label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-[#007F84]/30">
							<div><span className="block text-sm font-semibold text-gray-800">Show on homepage</span><span className="block text-xs leading-5 text-gray-500">Turn this off to hide the entire section without deleting its content.</span></div>
							<input type="checkbox" checked={feature.enabled} onChange={(event) => setFeature((current) => ({ ...current, enabled: event.target.checked }))} className="h-5 w-5 rounded border-gray-300 accent-[#007F84]" />
						</label>
					</section>
				</div>

				<aside className="xl:sticky xl:top-0 xl:self-start">
					<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
						<div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
							<div className="flex items-center gap-2 text-sm font-semibold text-gray-800"><Eye className="h-4 w-4 text-[#007F84]" /> Live preview</div>
							<div className="flex rounded-lg bg-gray-100 p-1">{(["en", "ar"] as const).map((locale) => <button key={locale} type="button" onClick={() => setPreviewLocale(locale)} className={`rounded-md px-2.5 py-1 text-xs font-bold ${previewLocale === locale ? "bg-white text-[#01334D] shadow-sm" : "text-gray-500"}`}>{locale.toUpperCase()}</button>)}</div>
						</div>
						<div dir={previewLocale === "ar" ? "rtl" : "ltr"} className="bg-[#011E2F] text-white">
							<div className="relative aspect-[16/10] bg-[#01334D]">{feature.imageUrl && <img src={feature.imageUrl} alt="" className="h-full w-full object-cover" style={{ objectPosition: feature.imagePosition }} />}<div className="absolute inset-0 bg-gradient-to-t from-[#011E2F]/60 to-transparent" /></div>
							<div className="p-6">
								<p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F4C430]">{localized.kicker || "Small heading"}</p>
								<h3 className={`mt-3 text-2xl font-bold ${previewLocale === "ar" ? "leading-10" : "leading-tight"}`}>{localized.title || "Feature title"}</h3>
								<p className="mt-3 text-sm leading-6 text-white/70">{localized.description || "A short feature description appears here."}</p>
								<div className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#F4C430] px-4 text-xs font-bold text-[#011E2F]">{localized.buttonLabel || "Button text"}<ExternalLink className="h-3.5 w-3.5" /></div>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}

function UrlField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
	return <div><label className="mb-1.5 block text-xs font-semibold text-gray-600">{label}</label><input type="text" dir="ltr" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 font-mono text-xs text-gray-900 outline-none focus:border-[#007F84] focus:ring-1 focus:ring-[#007F84]/20" /></div>;
}
