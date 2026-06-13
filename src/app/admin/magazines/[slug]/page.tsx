"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Magazine } from "@/data/magazines";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { PdfUpload } from "@/components/admin/PdfUpload";

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
	const [activeLocale, setActiveLocale] = useState<"en" | "ar">("en");
	const [errors, setErrors] = useState<Record<string, string>>({});

	useEffect(() => {
		params.then((p) => {
			setSlug(p.slug);
			if (p.slug !== "new") {
				fetch(`/api/magazines/${p.slug}`)
					.then((r) => r.json())
					.then((data) => {
						const m = data as Magazine;
						setMag({
							slug: m.slug,
							title: m.title,
							description: m.description,
							cover_image: m.cover_image,
							pdf_url: m.pdf_url,
							date: m.date,
						});
					});
			}
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
		if (!mag.pdf_url) next.pdf_url = "PDF file is required";
		if (!mag.date) next.date = "Date is required";
		setErrors(next);
		return Object.keys(next).length === 0;
	}

	async function save() {
		if (!validate()) return;
		setSaving(true);
		const url = slug === "new" ? "/api/magazines" : `/api/magazines/${mag.slug}`;
		const method = slug === "new" ? "POST" : "PUT";
		await fetch(url, {
			method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(mag),
		});
		setSaving(false);
		router.push("/admin/magazines");
	}

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
						disabled={saving}
						className="rounded-lg bg-[#01334D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#011E2F] disabled:opacity-50"
					>
						{saving ? "Saving..." : "Save"}
					</button>
				</div>
			</div>

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
										if (activeLocale === "en") {
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

					<div>
						<label className="mb-1 block text-sm text-gray-400">Slug</label>
						<div className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-2">
							<span className="text-sm text-gray-400">{mag.slug || "—"}</span>
						</div>
						<p className="mt-1 text-xs text-gray-400">Auto-generated from the English title</p>
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
							hint="Recommended: portrait format (e.g. 600 × 850)"
							error={errors.cover_image}
							preset="blog-cover"
							prefix="magazine-covers/"
							fit="contain"
						/>

						<PdfUpload
							value={mag.pdf_url}
							onChange={(url) => {
								setField("pdf_url", url);
								if (errors.pdf_url && url)
									setErrors((p) => { const n = { ...p }; delete n.pdf_url; return n; });
							}}
							label={<>PDF File <span className="text-red-500">*</span></>}
							hint="Upload the magazine PDF"
							error={errors.pdf_url}
							prefix="magazines/"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
