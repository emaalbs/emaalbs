"use client";

import { ImageUpload } from "@/components/admin/ImageUpload";
import { VideoUpload } from "@/components/admin/VideoUpload";
import { BilingualField } from "@/components/admin/BilingualField";
import { Globe } from "lucide-react";
import type { IbsEdition } from "@/data/ibs/types";

interface Props {
	edition: IbsEdition;
	isNew: boolean;
	slugAuto: boolean;
	allEditions: IbsEdition[];
	errors: Record<string, string>;
	onChange: (patch: Partial<IbsEdition>) => void;
	onSetSlugAuto: (v: boolean) => void;
	onClearErr: (key: string) => void;
}

export function BasicInfoSection({ edition, isNew, slugAuto, allEditions, errors, onChange, onSetSlugAuto, onClearErr }: Props) {
	const inputCls = (err?: string) =>
		`w-full rounded-lg border bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-[var(--color-teal)] focus:ring-1 focus:ring-[var(--color-teal)]/20 ${err ? "border-red-300" : "border-gray-200"}`;

	return (
		<div className="space-y-5">
			<BilingualField
				label="Title"
				required
				enValue={edition.title.en}
				arValue={edition.title.ar}
				onEnChange={(v) => {
					const patch: Partial<IbsEdition> = { title: { ...edition.title, en: v } };
					if (slugAuto) patch.slug = v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
					onChange(patch);
					onClearErr("title_en");
				}}
				onArChange={(v) => {
					onChange({ title: { ...edition.title, ar: v } });
					onClearErr("title_ar");
				}}
				enError={errors.title_en}
				arError={errors.title_ar}
				placeholderEn="Iraq Business Forum 2026"
				placeholderAr="منتدى الأعمال العراقي 2026"
			/>

			<BilingualField
				label="Tagline"
				required
				enValue={edition.tagline.en}
				arValue={edition.tagline.ar}
				onEnChange={(v) => { onChange({ tagline: { ...edition.tagline, en: v } }); onClearErr("tagline_en"); }}
				onArChange={(v) => { onChange({ tagline: { ...edition.tagline, ar: v } }); onClearErr("tagline_ar"); }}
				enError={errors.tagline_en}
				arError={errors.tagline_ar}
				placeholderEn="Shaping the Future of Iraqi Business"
				placeholderAr="صياغة مستقبل الأعمال العراقية"
			/>

			<BilingualField
				label="Summary"
				required
				multiline
				enValue={edition.summary.en}
				arValue={edition.summary.ar}
				onEnChange={(v) => { onChange({ summary: { ...edition.summary, en: v } }); onClearErr("summary_en"); }}
				onArChange={(v) => { onChange({ summary: { ...edition.summary, ar: v } }); onClearErr("summary_ar"); }}
				enError={errors.summary_en}
				arError={errors.summary_ar}
				rows={4}
				placeholderEn="A brief overview of this edition..."
				placeholderAr="نظرة عامة موجزة عن هذه النسخة..."
			/>

			<div className="grid gap-4 md:grid-cols-2">
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-700">
						Start Date <span className="text-red-500">*</span>
					</label>
					<input
						type="date"
						value={edition.dates.en ? edition.dates.en.split("T")[0] : ""}
						onChange={(e) => {
							const v = e.target.value;
							onChange({ dates: { en: v, ar: v } });
							onClearErr("dates_en");
							onClearErr("dates_ar");
						}}
						className={inputCls(errors.dates_en)}
					/>
					{(errors.dates_en || errors.dates_ar) && (
						<p className="mt-1 text-xs text-red-500">{errors.dates_en || errors.dates_ar}</p>
					)}
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-700">
						Display Date (EN)
					</label>
					<input
						type="text"
						value={edition.dates.en}
						onChange={(e) => onChange({ dates: { ...edition.dates, en: e.target.value } })}
						className={inputCls()}
						placeholder="March 15-17, 2026"
					/>
					<p className="mt-1 text-xs text-gray-400">Override how the date appears on the site</p>
				</div>
			</div>

			<BilingualField
				label="Location"
				required
				enValue={edition.location.en}
				arValue={edition.location.ar}
				onEnChange={(v) => { onChange({ location: { ...edition.location, en: v } }); onClearErr("location_en"); }}
				onArChange={(v) => { onChange({ location: { ...edition.location, ar: v } }); onClearErr("location_ar"); }}
				enError={errors.location_en}
				arError={errors.location_ar}
				placeholderEn="Baghdad International Fairgrounds"
				placeholderAr="معرض بغداد الدولي"
			/>

			{/* Slug + Year + Status row */}
			<div className="grid gap-4 md:grid-cols-3">
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-700">Slug <span className="text-red-500">*</span></label>
					<div className="relative">
						<input
							value={edition.slug}
							onChange={(e) => { onChange({ slug: e.target.value }); onSetSlugAuto(false); }}
							readOnly={!isNew}
							className={`${inputCls(errors.slug)} ${!isNew ? "bg-gray-50 text-gray-400" : ""}`}
							placeholder="iraq-business-forum-2026"
						/>
						{isNew && (
							<label className="mt-1 flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer">
								<input type="checkbox" checked={slugAuto} onChange={(e) => onSetSlugAuto(e.target.checked)} className="rounded border-gray-300" />
								Auto-generate from title
							</label>
						)}
					</div>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-700">Year <span className="text-red-500">*</span></label>
					<input
						type="number"
						value={edition.year}
						onChange={(e) => onChange({ year: parseInt(e.target.value) || new Date().getFullYear() })}
						className={inputCls()}
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-700">Status <span className="text-red-500">*</span></label>
					<select
						value={edition.status}
						onChange={(e) => onChange({ status: e.target.value as IbsEdition["status"] })}
						className={inputCls()}
					>
						<option value="upcoming">Upcoming</option>
						<option value="live">Live</option>
						<option value="past">Past</option>
					</select>
				</div>
			</div>

			{/* Edition Label */}
			<BilingualField
				label="Edition Label"
				enValue={edition.editionLabel.en}
				arValue={edition.editionLabel.ar}
				onEnChange={(v) => onChange({ editionLabel: { ...edition.editionLabel, en: v } })}
				onArChange={(v) => onChange({ editionLabel: { ...edition.editionLabel, ar: v } })}
				placeholderEn="11th Edition"
				placeholderAr="النسخة الحادية عشرة"
			/>

			{/* Hero Image + Recap Video */}
			<div className="grid gap-5 md:grid-cols-2">
				<div>
					<ImageUpload
						value={edition.heroImage}
						onChange={(url) => { onChange({ heroImage: url }); onClearErr("heroImage"); }}
						label="Hero Image"
						hint="16:9 cover image"
						prefix="ibs/hero/"
						error={errors.heroImage}
					/>
				</div>
				<div>
					<VideoUpload
						value={edition.recapVideo || ""}
						onChange={(url) => onChange({ recapVideo: url || undefined })}
						label="Recap Video"
						hint="Upload directly to R2 (up to 2GB)"
						prefix="ibs/videos/"
					/>
				</div>
			</div>

			{/* Registration URL + Next Edition */}
			<div className="grid gap-4 md:grid-cols-2">
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-700">Registration URL</label>
					<input
						type="url"
						value={edition.registrationUrl || ""}
						onChange={(e) => onChange({ registrationUrl: e.target.value || undefined })}
						className={inputCls()}
						placeholder="https://..."
					/>
				</div>
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-700">Next Edition</label>
					<select
						value={edition.nextEditionSlug || ""}
						onChange={(e) => onChange({ nextEditionSlug: e.target.value || undefined })}
						className={inputCls()}
					>
						<option value="">— None —</option>
						{allEditions.map((e) => (
							<option key={e.slug} value={e.slug}>
								{e.title.en} ({e.year})
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
