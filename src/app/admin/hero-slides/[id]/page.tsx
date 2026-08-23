"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Eye, Save } from "lucide-react";
import type { HeroSlide, HeroSlideInput } from "@/data/hero-slides";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUpload } from "@/components/admin/ImageUpload";

const emptySlide: HeroSlideInput = {
	overline: { en: "", ar: "" },
	titleLine1: { en: "", ar: "" },
	titleLine2: { en: "", ar: "" },
	description: { en: "", ar: "" },
	imageUrl: "",
	imagePosition: "center",
	sortOrder: 0,
	published: true,
};

type FieldErrors = Partial<Record<"overlineEn" | "overlineAr" | "title1En" | "title1Ar" | "title2En" | "title2Ar" | "descriptionEn" | "descriptionAr" | "imageUrl", string>>;

export default function HeroSlideEditorPage({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter();
	const [id, setId] = useState<string | null>(null);
	const [slide, setSlide] = useState<HeroSlideInput>(emptySlide);
	const [previewLocale, setPreviewLocale] = useState<"en" | "ar">("en");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [errors, setErrors] = useState<FieldErrors>({});
	const [requestError, setRequestError] = useState("");

	useEffect(() => {
		params.then(async ({ id: routeId }) => {
			setId(routeId);
			try {
				if (routeId === "new") {
					const response = await fetch("/api/hero-slides?admin=1");
					const existing = response.ok ? ((await response.json()) as HeroSlide[]) : [];
					const nextOrder = existing.reduce((max, item) => Math.max(max, item.sortOrder), -1) + 1;
					setSlide({ ...emptySlide, sortOrder: nextOrder });
				} else {
					const response = await fetch(`/api/hero-slides/${routeId}`);
					const data = (await response.json()) as HeroSlide | { error?: string };
					if (!response.ok || !("id" in data)) throw new Error("error" in data && data.error ? data.error : "Unable to load banner");
					const { id: _slideId, ...input } = data;
					void _slideId;
					setSlide(input);
				}
			} catch (err) {
				setRequestError(err instanceof Error ? err.message : "Unable to load banner");
			} finally {
				setLoading(false);
			}
		});
	}, [params]);

	function updateLocalized(
		field: "overline" | "titleLine1" | "titleLine2" | "description",
		locale: "en" | "ar",
		value: string
	) {
		setSlide((current) => ({
			...current,
			[field]: { ...current[field], [locale]: value },
		}));
	}

	function validate(): boolean {
		const next: FieldErrors = {};
		if (!slide.overline.en.trim()) next.overlineEn = "English overline is required";
		if (!slide.overline.ar.trim()) next.overlineAr = "Arabic overline is required";
		if (!slide.titleLine1.en.trim()) next.title1En = "English first line is required";
		if (!slide.titleLine1.ar.trim()) next.title1Ar = "Arabic first line is required";
		if (!slide.titleLine2.en.trim()) next.title2En = "English second line is required";
		if (!slide.titleLine2.ar.trim()) next.title2Ar = "Arabic second line is required";
		if (!slide.description.en.trim()) next.descriptionEn = "English description is required";
		if (!slide.description.ar.trim()) next.descriptionAr = "Arabic description is required";
		if (!slide.imageUrl) next.imageUrl = "Banner image is required";
		setErrors(next);
		return Object.keys(next).length === 0;
	}

	async function save() {
		if (!validate() || !id) return;
		setSaving(true);
		setRequestError("");
		try {
			const response = await fetch(id === "new" ? "/api/hero-slides" : `/api/hero-slides/${id}`, {
				method: id === "new" ? "POST" : "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(slide),
			});
			const data = (await response.json()) as { error?: string };
			if (!response.ok) throw new Error(data.error || "Unable to save banner");
			router.push("/admin/hero-slides");
			router.refresh();
		} catch (err) {
			setRequestError(err instanceof Error ? err.message : "Unable to save banner");
		} finally {
			setSaving(false);
		}
	}

	if (loading) return <div className="text-sm text-gray-400">Loading banner editor...</div>;

	const isArPreview = previewLocale === "ar";
	const previewContent = {
		overline: slide.overline[previewLocale],
		titleLine1: slide.titleLine1[previewLocale],
		titleLine2: slide.titleLine2[previewLocale],
		description: slide.description[previewLocale],
	};

	return (
		<div className="pb-12">
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<button
						type="button"
						onClick={() => router.push("/admin/hero-slides")}
						className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-[#01334D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007F84]"
					>
						<ArrowLeft className="h-4 w-4" />
						Homepage Banners
					</button>
					<h1 className="text-2xl font-bold text-gray-900">{id === "new" ? "Add Homepage Banner" : "Edit Homepage Banner"}</h1>
				</div>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={() => router.push("/admin/hero-slides")}
						className="h-11 rounded-lg border border-gray-200 px-4 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={save}
						disabled={saving}
						className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#01334D] px-5 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#011E2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007F84] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
					>
						<Save className="h-4 w-4" />
						{saving ? "Saving..." : "Save Banner"}
					</button>
				</div>
			</div>

			{requestError && <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{requestError}</div>}

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)]">
				<div className="space-y-6">
					<section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
						<div className="mb-5">
							<h2 className="text-base font-semibold text-gray-900">Bilingual content</h2>
							<p className="mt-1 text-sm text-gray-500">Both languages are required so every banner remains complete when visitors switch languages.</p>
						</div>
						<div className="space-y-5">
							<BilingualField
								label="Overline"
								required
								enValue={slide.overline.en}
								arValue={slide.overline.ar}
								onEnChange={(value) => updateLocalized("overline", "en", value)}
								onArChange={(value) => updateLocalized("overline", "ar", value)}
								enError={errors.overlineEn}
								arError={errors.overlineAr}
								placeholderEn="EMAAL Business Space"
								placeholderAr="أعمال بيزنس سبيس"
							/>
							<BilingualField
								label="Title — first line"
								required
								enValue={slide.titleLine1.en}
								arValue={slide.titleLine1.ar}
								onEnChange={(value) => updateLocalized("titleLine1", "en", value)}
								onArChange={(value) => updateLocalized("titleLine1", "ar", value)}
								enError={errors.title1En}
								arError={errors.title1Ar}
							/>
							<BilingualField
								label="Title — highlighted line"
								required
								enValue={slide.titleLine2.en}
								arValue={slide.titleLine2.ar}
								onEnChange={(value) => updateLocalized("titleLine2", "en", value)}
								onArChange={(value) => updateLocalized("titleLine2", "ar", value)}
								enError={errors.title2En}
								arError={errors.title2Ar}
							/>
							<BilingualField
								label="Description"
								required
								multiline
								rows={5}
								enValue={slide.description.en}
								arValue={slide.description.ar}
								onEnChange={(value) => updateLocalized("description", "en", value)}
								onArChange={(value) => updateLocalized("description", "ar", value)}
								enError={errors.descriptionEn}
								arError={errors.descriptionAr}
							/>
						</div>
					</section>

					<section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
						<h2 className="mb-5 text-base font-semibold text-gray-900">Image and display</h2>
						<ImageUpload
							value={slide.imageUrl}
							onChange={(imageUrl) => setSlide((current) => ({ ...current, imageUrl }))}
							label={<>Banner Image <span className="text-red-500">*</span></>}
							hint="Recommended: landscape image, 1920 × 1080 or larger"
							error={errors.imageUrl}
							preset="ibs-hero"
							prefix="hero-slides/"
						/>

						<div className="mt-5 grid gap-4 sm:grid-cols-2">
							<div>
								<label className="mb-1.5 block text-sm font-medium text-gray-700">Image focus</label>
								<select
									value={slide.imagePosition}
									onChange={(event) => setSlide((current) => ({ ...current, imagePosition: event.target.value }))}
									className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#007F84] focus:ring-1 focus:ring-[#007F84]/20"
								>
									<option value="center">Center</option>
									<option value="center top">Top</option>
									<option value="center 35%">Upper center</option>
									<option value="center 45%">Middle upper</option>
									<option value="center bottom">Bottom</option>
								</select>
							</div>
							<div>
								<label className="mb-1.5 block text-sm font-medium text-gray-700">Display order</label>
								<input
									type="number"
									min={0}
									value={slide.sortOrder}
									onChange={(event) => setSlide((current) => ({ ...current, sortOrder: Math.max(0, Number(event.target.value) || 0) }))}
									className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-[#007F84] focus:ring-1 focus:ring-[#007F84]/20"
								/>
								<p className="mt-1 text-xs text-gray-400">Lower numbers appear first.</p>
							</div>
						</div>

						<label className="mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-[#007F84]/30">
							<div>
								<span className="block text-sm font-semibold text-gray-800">Published</span>
								<span className="block text-xs leading-5 text-gray-500">Show this banner in the homepage carousel.</span>
							</div>
							<input
								type="checkbox"
								checked={slide.published}
								onChange={(event) => setSlide((current) => ({ ...current, published: event.target.checked }))}
								className="h-5 w-5 rounded border-gray-300 accent-[#007F84]"
							/>
						</label>
					</section>
				</div>

				<aside className="xl:sticky xl:top-0 xl:self-start">
					<div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
						<div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
							<div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
								<Eye className="h-4 w-4 text-[#007F84]" />
								Live preview
							</div>
							<div className="flex rounded-lg bg-gray-100 p-1">
								{(["en", "ar"] as const).map((locale) => (
									<button
										key={locale}
										type="button"
										onClick={() => setPreviewLocale(locale)}
										className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${previewLocale === locale ? "bg-white text-[#01334D] shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
									>
										{locale.toUpperCase()}
									</button>
								))}
							</div>
						</div>

						<div
							dir={isArPreview ? "rtl" : "ltr"}
							className="relative isolate min-h-[540px] overflow-hidden bg-[#011E2F] px-6 py-10 text-white"
						>
							{slide.imageUrl ? (
								<img src={slide.imageUrl} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" style={{ objectPosition: slide.imagePosition }} />
							) : null}
							<div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#011E2F]/55 via-[#01334D]/45 to-[#011E2F]/80" />
							<div className={`absolute inset-0 -z-10 ${isArPreview ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-[#011E2F]/65 via-[#011E2F]/15 to-transparent`} />
							<div className="flex min-h-[460px] flex-col justify-center">
								<div className="flex items-center gap-2 text-[10px] font-bold text-[#F4C430]">
									<span className="h-px w-7 bg-[#007F84]" />
									<span className={isArPreview ? "tracking-normal" : "uppercase tracking-[0.16em]"}>{previewContent.overline || "Overline"}</span>
								</div>
								<h2 className={`mt-5 text-[clamp(1.8rem,4vw,2.5rem)] font-bold ${isArPreview ? "leading-[1.45]" : "leading-[1.08] tracking-[-0.025em]"}`}>
									{previewContent.titleLine1 || "First title line"}
									<br />
									<span className="text-[#F4C430]">{previewContent.titleLine2 || "Highlighted title line"}</span>
								</h2>
								<p className={`mt-5 border-s-2 border-[#007F84]/70 ps-3 text-sm text-white/80 ${isArPreview ? "leading-8" : "leading-6"}`}>
									{previewContent.description || "Banner description will appear here."}
								</p>
								<div className="mt-7 inline-flex h-10 w-fit items-center gap-2 rounded-lg bg-[#F4C430] px-4 text-xs font-bold text-[#01334D]">
									<Check className="h-3.5 w-3.5" />
									{isArPreview ? "استكشف قمة العراق للأعمال" : "Explore Iraq Business Summit"}
								</div>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
