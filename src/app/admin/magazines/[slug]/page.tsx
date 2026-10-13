"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Magazine } from "@/data/magazines";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { PdfUpload } from "@/components/admin/PdfUpload";
import { AutoTranslateSync } from "@/components/admin/AutoTranslateSync";

function toSlug(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

function emptyMagazine(): Omit<Magazine, "id"> {
	return {
		slug: "",
		title: { en: "", ar: "" },
		description: { en: "", ar: "" },
		cover_image: "",
		pdf_url: "",
		pdf_url_en: "",
		pdf_url_ar: "",
		date: new Date().toISOString().split("T")[0],
	};
}

export default function MagazineEditorPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const router = useRouter();
	const [slug, setSlug] = useState<string | null>(null);
	const [mag, setMag] = useState<Omit<Magazine, "id">>(emptyMagazine());
	const [saving, setSaving] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState("");
	const [saveError, setSaveError] = useState("");
	const [uploads, setUploads] = useState<Record<string, boolean>>({});
	const uploading = Object.values(uploads).some(Boolean);
	const [activeLocale, setActiveLocale] = useState<"en" | "ar">("en");
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		params.then((p) => {
			setSlug(p.slug);
			if (p.slug !== "new") {
				fetch(`/api/magazines/${p.slug}`)
					.then((r) => { if (!r.ok) throw new Error("Could not load this magazine. Please refresh the page."); return r.json(); })
					.then((data) => {
						const m = data as Magazine;
						setMag({
							slug: m.slug,
							title: m.title,
							description: m.description,
							cover_image: m.cover_image,
							pdf_url: m.pdf_url,
							pdf_url_en: m.pdf_url_en || "",
							pdf_url_ar: m.pdf_url_ar || "",
							date: m.date,
						});
					}).catch(e => setLoadError(e.message)).finally(() => setLoading(false));
			} else setLoading(false);
		});
	}, [params]);

	function setField<K extends keyof Omit<Magazine, "id">>(
		field: K,
		value: Omit<Magazine, "id">[K]
	) {
		setMag((prev) => ({ ...prev, [field]: value }));
	}

	function validate(): boolean {
		const next: Record<string, string> = {};
		if (!mag.title.en.trim()) next.titleEn = "English title is required";
		if (!mag.title.ar.trim()) next.titleAr = "Arabic title is required";
		if (!mag.cover_image) next.cover_image = "Cover image is required";
		if (!mag.pdf_url && !mag.pdf_url_en && !mag.pdf_url_ar) next.pdf_url = "Upload at least one PDF — English or Arabic. The second version is optional.";
		if (!mag.date) next.date = "Date is required";
		setErrors(next);
		return Object.keys(next).length === 0;
	}

	async function save() {
		if (loading || loadError || uploading || saving) return;
		if (!validate()) return;
		setSaving(true);
		setSaveError("");
		const url = slug === "new" ? "/api/magazines" : `/api/magazines/${slug}`;
		const method = slug === "new" ? "POST" : "PUT";
		try {
			const response = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(mag),
			});
			if (!response.ok) { const result = await response.json() as { error?: string }; throw new Error(result.error || "Save failed. Please try again."); }
			router.push("/admin/magazines");
		} catch (e) { setSaveError(e instanceof Error ? e.message : "Save failed. Please try again."); }
		finally { setSaving(false); }
	}
	if (loading) return <p className="text-gray-500">Loading magazine…</p>;
	if (loadError) return <p role="alert" className="text-red-600">{loadError}</p>;

	return (
		<div>
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-bold text-gray-900">
					{slug === "new" ? "New Magazine" : "Edit Magazine"}
				</h1>
				<div className="flex gap-3">
					<button
						onClick={() => router.push("/admin/magazines")}
						className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						onClick={save}
						disabled={saving || uploading}
						className="rounded-lg bg-[#01334D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#011E2F] disabled:opacity-50"
					>
						{uploading ? "Uploading PDF…" : saving ? "Saving..." : "Save"}
					</button>
				</div>
			</div>

			{saveError && <p role="alert" className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">{saveError}</p>}
			<div className="space-y-6">
				{/* Title + Date */}
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="mb-4 flex gap-2">
						{(["en", "ar"] as const).map((loc) => (
							<button
								key={loc}
								onClick={() => setActiveLocale(loc)}
								className={`relative rounded-lg px-3 py-1.5 text-sm font-medium transition ${
									activeLocale === loc
										? "bg-[#01334D] text-white"
										: "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
								}`}
							>
								{loc.toUpperCase()}
								{errors[`title${loc === "en" ? "En" : "Ar"}`] && (
									<span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
										!
									</span>
								)}
							</button>
						))}
					</div>

					<div className="grid gap-4 md:grid-cols-2">
						<div>
							<label className="mb-1 block text-sm text-gray-500">
								Title ({activeLocale}) <span className="text-red-500">*</span>
							</label>
							<input
								value={mag.title[activeLocale]}
								onChange={(e) => {
									const value = e.target.value;
									setMag((prev) => {
										const next = {
											...prev,
											title: { ...prev.title, [activeLocale]: value },
										};
										if (activeLocale === "en" && slug === "new") {
											next.slug = toSlug(value);
										}
										return next;
									});
									const key = `title${activeLocale === "en" ? "En" : "Ar"}`;
									if (errors[key]) setErrors((p) => { const n = { ...p }; delete n[key]; return n; });
								}}
								className={`w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 ${
									errors[`title${activeLocale === "en" ? "En" : "Ar"}`]
										? "border-red-300"
										: "border-gray-200"
								}`}
								placeholder={activeLocale === "en" ? "Magazine title in English" : "عنوان المجلة بالعربية"}
							/>
							{errors[`title${activeLocale === "en" ? "En" : "Ar"}`] && (
								<p className="mt-1 text-xs text-red-500">
									{errors[`title${activeLocale === "en" ? "En" : "Ar"}`]}
								</p>
							)}
						</div>

						<div>
							<label className="mb-1 block text-sm text-gray-500">
								Date <span className="text-red-500">*</span>
							</label>
							<input
								type="date"
								value={mag.date}
								onChange={(e) => setField("date", e.target.value)}
								className={`w-full rounded-lg border bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500 ${
									errors.date ? "border-red-300" : "border-gray-200"
								}`}
							/>
							{errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
						</div>
					</div>
					<AutoTranslateSync
						className="mt-4"
						enValue={mag.title.en}
						arValue={mag.title.ar}
						onEnChange={(value) => setMag((prev) => ({ ...prev, title: { ...prev.title, en: value }, slug: slug === "new" ? toSlug(value) : prev.slug }))}
						onArChange={(value) => setMag((prev) => ({ ...prev, title: { ...prev.title, ar: value } }))}
					/>

					<div className="mt-4">
						<label className="mb-1 block text-sm text-gray-500">
							Description ({activeLocale})
						</label>
						<textarea
							value={mag.description[activeLocale]}
							onChange={(e) => {
								setMag((prev) => ({
									...prev,
									description: { ...prev.description, [activeLocale]: e.target.value },
								}));
							}}
							rows={3}
							className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-gray-900 outline-none focus:border-blue-500"
							placeholder={activeLocale === "en" ? "Short description in English" : "وصف مختصر بالعربية"}
						/>
					</div>
					<AutoTranslateSync
						className="mt-2"
						enValue={mag.description.en}
						arValue={mag.description.ar}
						onEnChange={(value) => setMag((prev) => ({ ...prev, description: { ...prev.description, en: value } }))}
						onArChange={(value) => setMag((prev) => ({ ...prev, description: { ...prev.description, ar: value } }))}
					/>

					<div>
						<label className="mb-1 block text-sm text-gray-400">Slug</label>
						<div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2">
							<span className="text-sm text-gray-400">{mag.slug || "—"}</span>
						</div>
						<p className="mt-1 text-xs text-gray-400">{slug === "new" ? "Auto-generated from the English title" : "Existing link is preserved when editing the title"}</p>
					</div>
				</div>

				{/* Cover + PDF */}
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="grid gap-6 md:grid-cols-2">
						<ImageUpload
							value={mag.cover_image}
							onChange={(url) => {
								setField("cover_image", url);
								if (errors.cover_image && url)
									setErrors((p) => { const n = { ...p }; delete n.cover_image; return n; });
							}}
							label={<>Cover Image <span className="text-red-500">*</span></>}
							hint="Portrait cover used in the magazine library."
							error={errors.cover_image}
							preset="magazine-cover"
							prefix="magazine-covers/"
							fit="contain"
						/>

						<div className="min-w-0 space-y-5" id="magazine-pdfs">
							<div><h2 className="font-semibold text-[var(--color-navy)]">PDF language versions / نسخ الملف</h2>
							<p className="mt-2 text-sm leading-6 text-gray-600">Upload English, Arabic, or both. Visitors receive the version matching the website language. If only one version exists, it is used for both languages.</p>
							<p dir="rtl" className="mt-2 text-sm leading-7 text-gray-600">ارفع نسخة عربية أو إنكليزية أو كلتيهما. النسخة الثانية اختيارية. عند توفر نسخة واحدة تُعرض في اللغتين.</p></div>
							{errors.pdf_url && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.pdf_url}</p>}
							{(["en", "ar"] as const).map(lang => <div key={lang} className="min-w-0 rounded-xl border border-gray-200 p-4">
								<PdfUpload value={mag[`pdf_url_${lang}`]} disabled={saving}
									onChange={url => { setField(`pdf_url_${lang}`, url); if (url) setErrors(p => { const n = {...p}; delete n.pdf_url; return n; }); }}
									onUploadingChange={busy => setUploads(p => ({...p, [lang]: busy}))}
									label={lang === "en" ? "English PDF / النسخة الإنكليزية" : "Arabic PDF / النسخة العربية"}
									hint="Optional when another PDF is provided. PDF format only."
									prefix={`magazines/${lang}/`} />
							</div>)}
							{mag.pdf_url && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
								<PdfUpload value={mag.pdf_url} onChange={url => setField("pdf_url", url)} disabled={saving}
									onUploadingChange={busy => setUploads(p => ({...p, legacy: busy}))}
									label="Existing PDF — language not assigned"
									hint="Your original file is preserved. Assign its language below; no upload is needed. New language versions take priority."
									prefix="magazines/" />
								<div className="mt-3 flex flex-wrap gap-2">{(["en", "ar"] as const).map(lang => <button key={lang} type="button" disabled={saving || uploading || !!mag[`pdf_url_${lang}`]}
									onClick={() => setMag(p => ({...p, [`pdf_url_${lang}`]: p.pdf_url, pdf_url: ""}))}
									className="min-h-11 rounded-lg border border-amber-300 bg-white px-3 text-sm text-[var(--color-navy)] transition-colors hover:bg-amber-100 focus-visible:outline-2 disabled:opacity-40">{lang === "en" ? "Use as English" : "Use as Arabic"}</button>)}</div>
							</div>}
							<p className="text-xs leading-6 text-gray-500">Removing a version here detaches it after Save; it does not delete the stored file.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
