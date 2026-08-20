"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Save, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { HomeHeroSettings, HomeHeroSlide, LocalizedText } from "@/data/home-hero";

type Locale = "en" | "ar";
type LocalizedSlideField = "alt" | "overline" | "titleLine1" | "titleLine2" | "description" | "primaryCtaLabel" | "secondaryCtaLabel";

const inputClass = "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#007C91] focus:ring-2 focus:ring-[#007C91]/10";

function Field({ label, value, onChange, multiline = false, direction }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; direction?: "ltr" | "rtl" }) {
	return (
		<label className="block text-sm font-medium text-gray-700">
			{label}
			{multiline
				? <textarea dir={direction} value={value} onChange={(event) => onChange(event.target.value)} rows={4} className={inputClass} />
				: <input dir={direction} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />}
		</label>
	);
}

export default function HomeHeroEditorPage() {
	const [settings, setSettings] = useState<HomeHeroSettings | null>(null);
	const [activeSlideId, setActiveSlideId] = useState("");
	const [locale, setLocale] = useState<Locale>("en");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

	useEffect(() => {
		fetch("/api/home-hero")
			.then(async (response) => {
				if (!response.ok) throw new Error("Could not load the homepage hero.");
				return response.json() as Promise<HomeHeroSettings>;
			})
			.then((data) => {
				setSettings(data);
				setActiveSlideId(data.slides[0]?.id ?? "");
			})
			.catch((error: unknown) => setMessage({ type: "error", text: error instanceof Error ? error.message : "Could not load the homepage hero." }))
			.finally(() => setLoading(false));
	}, []);

	function updateSlide(index: number, patch: Partial<HomeHeroSlide>) {
		setSettings((current) => {
			if (!current) return current;
			const slides = [...current.slides];
			slides[index] = { ...slides[index], ...patch };
			return { ...current, slides };
		});
	}

	function updateLocalized(index: number, field: LocalizedSlideField, value: string) {
		if (!settings) return;
		const localized = settings.slides[index][field] as LocalizedText;
		updateSlide(index, { [field]: { ...localized, [locale]: value } });
	}

	function moveSlide(index: number, direction: -1 | 1) {
		setSettings((current) => {
			if (!current) return current;
			const target = index + direction;
			if (target < 0 || target >= current.slides.length) return current;
			const slides = [...current.slides];
			[slides[index], slides[target]] = [slides[target], slides[index]];
			return { ...current, slides };
		});
	}

	function addSlide() {
		if (!settings) return;
		const source = settings.slides.find((slide) => slide.id === activeSlideId) ?? settings.slides[0];
		const slide: HomeHeroSlide = {
			...structuredClone(source),
			id: crypto.randomUUID(),
			imageUrl: "",
			alt: { en: "", ar: "" },
		};
		setSettings({ ...settings, slides: [...settings.slides, slide] });
		setActiveSlideId(slide.id);
	}

	function removeSlide(index: number) {
		if (!settings || settings.slides.length === 1) return;
		const slides = settings.slides.filter((_, itemIndex) => itemIndex !== index);
		setSettings({ ...settings, slides });
		if (settings.slides[index].id === activeSlideId) setActiveSlideId(slides[Math.min(index, slides.length - 1)].id);
	}

	async function save() {
		if (!settings) return;
		setSaving(true);
		setMessage(null);
		try {
			const response = await fetch("/api/home-hero", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
			const data = await response.json() as HomeHeroSettings | { error: string };
			if (!response.ok) throw new Error("error" in data ? data.error : "Could not save the homepage hero.");
			setSettings(data as HomeHeroSettings);
			setMessage({ type: "success", text: "Hero slides saved. Each image will now change together with its content." });
		} catch (error) {
			setMessage({ type: "error", text: error instanceof Error ? error.message : "Could not save the homepage hero." });
		} finally {
			setSaving(false);
		}
	}

	if (loading) return <div className="text-gray-400">Loading homepage hero...</div>;
	if (!settings) return <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{message?.text || "Could not load the homepage hero."}</div>;

	const activeIndex = Math.max(0, settings.slides.findIndex((slide) => slide.id === activeSlideId));
	const activeSlide = settings.slides[activeIndex];
	const direction = locale === "ar" ? "rtl" : "ltr";

	return (
		<div className="mx-auto max-w-6xl">
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Homepage Hero Slides</h1>
					<p className="mt-1 text-sm text-gray-500">Every image has its own bilingual content and buttons.</p>
				</div>
				<button onClick={save} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#01334D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#011E2F] disabled:opacity-50">
					<Save className="h-4 w-4" /> {saving ? "Saving..." : "Save slides"}
				</button>
			</div>

			{message && <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{message.text}</div>}

			<section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h2 className="text-lg font-semibold text-gray-900">Slides</h2>
						<p className="mt-1 text-sm text-gray-500">Select a slide to edit it. Use the up/down arrows to set its position; the displayed order is saved exactly as shown.</p>
					</div>
					<label className="flex shrink-0 items-center gap-2 text-sm font-medium text-gray-700">
						Change every
						<select value={settings.slideIntervalMs} onChange={(event) => setSettings({ ...settings, slideIntervalMs: Number(event.target.value) })} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#007C91]">
							{[3, 4, 5, 6, 8, 10, 15].map((seconds) => <option key={seconds} value={seconds * 1000}>{seconds} seconds</option>)}
						</select>
					</label>
				</div>

				<div className="mt-6 grid gap-5 lg:grid-cols-2">
					{settings.slides.map((slide, index) => (
						<div key={slide.id} className={`rounded-xl border-2 p-4 transition ${slide.id === activeSlideId ? "border-[#007C91] bg-[#007C91]/5" : "border-gray-200 bg-gray-50"}`}>
							<div className="mb-3 flex items-center justify-between">
								<button onClick={() => setActiveSlideId(slide.id)} className="text-sm font-semibold text-[#01334D]">Slide {index + 1} · Edit content</button>
								<div className="flex gap-1">
									<button onClick={() => moveSlide(index, -1)} disabled={index === 0} title="Move slide up" aria-label={`Move slide ${index + 1} up`} className="rounded-md p-2 text-gray-500 hover:bg-white disabled:opacity-25"><ArrowUp className="h-4 w-4" /></button>
									<button onClick={() => moveSlide(index, 1)} disabled={index === settings.slides.length - 1} title="Move slide down" aria-label={`Move slide ${index + 1} down`} className="rounded-md p-2 text-gray-500 hover:bg-white disabled:opacity-25"><ArrowDown className="h-4 w-4" /></button>
									<button onClick={() => removeSlide(index)} disabled={settings.slides.length === 1} title="Remove slide" className="rounded-md p-2 text-red-500 hover:bg-red-50 disabled:opacity-25"><Trash2 className="h-4 w-4" /></button>
								</div>
							</div>
							<div onClick={() => setActiveSlideId(slide.id)}>
								<ImageUpload value={slide.imageUrl} onChange={(imageUrl) => updateSlide(index, { imageUrl })} label={null} compact preset="home-hero" prefix="home/hero/" />
							</div>
							<p className="mt-2 truncate text-xs text-gray-500">{slide.titleLine1.en || "Untitled slide"}</p>
						</div>
					))}
				</div>

				<button onClick={addSlide} disabled={settings.slides.length >= 20} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 px-4 py-4 text-sm font-semibold text-gray-500 transition hover:border-[#007C91] hover:text-[#007C91] disabled:opacity-40">
					<ImagePlus className="h-5 w-5" /> Add slide
				</button>
			</section>

			<section className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
				<div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="text-lg font-semibold text-gray-900">Slide {activeIndex + 1} content</h2>
						<p className="text-sm text-gray-500">This content appears only with the selected image.</p>
					</div>
					<div className="inline-flex self-start rounded-lg border border-gray-200 bg-gray-50 p-1">
						{(["en", "ar"] as const).map((item) => <button key={item} onClick={() => setLocale(item)} className={`rounded-md px-5 py-2 text-sm font-semibold transition ${locale === item ? "bg-[#01334D] text-white" : "text-gray-500 hover:bg-white"}`}>{item === "en" ? "English" : "العربية"}</button>)}
					</div>
				</div>

				<div className="grid gap-5 md:grid-cols-2" dir={direction}>
					<Field label="Image alt text" direction={direction} value={activeSlide.alt[locale]} onChange={(value) => updateLocalized(activeIndex, "alt", value)} />
					<Field label="Overline" direction={direction} value={activeSlide.overline[locale]} onChange={(value) => updateLocalized(activeIndex, "overline", value)} />
					<Field label="Title — first line" direction={direction} value={activeSlide.titleLine1[locale]} onChange={(value) => updateLocalized(activeIndex, "titleLine1", value)} />
					<Field label="Title — highlighted line" direction={direction} value={activeSlide.titleLine2[locale]} onChange={(value) => updateLocalized(activeIndex, "titleLine2", value)} />
					<div className="md:col-span-2"><Field label="Description" direction={direction} multiline value={activeSlide.description[locale]} onChange={(value) => updateLocalized(activeIndex, "description", value)} /></div>
					<Field label="Primary button label" direction={direction} value={activeSlide.primaryCtaLabel[locale]} onChange={(value) => updateLocalized(activeIndex, "primaryCtaLabel", value)} />
					<Field label="Secondary button label" direction={direction} value={activeSlide.secondaryCtaLabel[locale]} onChange={(value) => updateLocalized(activeIndex, "secondaryCtaLabel", value)} />
				</div>
				<div className="mt-6 grid gap-5 border-t border-gray-100 pt-6 md:grid-cols-2" dir="ltr">
					<Field label="Primary button link" value={activeSlide.primaryCtaHref} onChange={(value) => updateSlide(activeIndex, { primaryCtaHref: value })} />
					<Field label="Secondary button link" value={activeSlide.secondaryCtaHref} onChange={(value) => updateSlide(activeIndex, { secondaryCtaHref: value })} />
				</div>
				<p className="mt-2 text-xs text-gray-400">Use a local path such as /ibs or a full https:// link.</p>
			</section>
		</div>
	);
}
