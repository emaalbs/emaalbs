"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Eye, EyeOff, ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import type { HeroSlide } from "@/data/hero-slides";

export default function AdminHeroSlidesPage() {
	const [slides, setSlides] = useState<HeroSlide[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	const loadSlides = useCallback(async () => {
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/hero-slides?admin=1", { credentials: "same-origin" });
			const data = (await response.json()) as HeroSlide[] | { error?: string };
			if (!response.ok || !Array.isArray(data)) {
				throw new Error(!Array.isArray(data) && data.error ? data.error : "Unable to load homepage banners");
			}
			setSlides(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Unable to load homepage banners");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadSlides();
	}, [loadSlides]);

	async function deleteSlide(id: number) {
		if (!confirm("Delete this homepage banner? This action cannot be undone.")) return;
		const response = await fetch(`/api/hero-slides/${id}`, { method: "DELETE" });
		if (!response.ok) {
			const data = (await response.json()) as { error?: string };
			setError(data.error || "Unable to delete banner");
			return;
		}
		loadSlides();
	}

	return (
		<div>
			<div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#007F84]">Homepage</p>
					<h1 className="text-2xl font-bold text-gray-900">Homepage Banners</h1>
					<p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
						Manage each hero image, its Arabic and English copy, display order, and publishing status.
					</p>
				</div>
				<Link
					href="/admin/hero-slides/new"
					className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#01334D] px-4 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#011E2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007F84] focus-visible:ring-offset-2 motion-reduce:transition-none"
				>
					<Plus className="h-4 w-4" />
					Add Banner
				</Link>
			</div>

			{error && (
				<div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{error}
				</div>
			)}

			{loading ? (
				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{[0, 1, 2].map((item) => (
						<div key={item} className="h-80 animate-pulse rounded-xl border border-gray-200 bg-white" />
					))}
				</div>
			) : slides.length === 0 ? (
				<div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center shadow-sm">
					<div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gray-100 text-gray-400">
						<ImageIcon className="h-6 w-6" />
					</div>
					<h2 className="mt-4 text-base font-semibold text-gray-900">No homepage banners yet</h2>
					<p className="mt-1 text-sm text-gray-500">Create the first banner to start managing the homepage carousel.</p>
					<Link href="/admin/hero-slides/new" className="mt-4 inline-flex text-sm font-semibold text-[#007F84] hover:underline">
						Create first banner
					</Link>
				</div>
			) : (
				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{slides.map((slide, index) => (
						<article
							key={slide.id}
							className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg motion-reduce:transition-none"
						>
							<div className="relative h-48 overflow-hidden bg-[#011E2F]">
								{slide.imageUrl ? (
									<img
										src={slide.imageUrl}
										alt=""
										className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
										style={{ objectPosition: slide.imagePosition }}
									/>
								) : null}
								<div className="absolute inset-0 bg-gradient-to-t from-[#011E2F]/85 via-[#011E2F]/15 to-transparent" />
								<div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#01334D] shadow-sm backdrop-blur-sm">
									Position {index + 1}
								</div>
								<div className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm backdrop-blur-sm ${slide.published ? "bg-emerald-50/95 text-emerald-700" : "bg-gray-100/95 text-gray-600"}`}>
									{slide.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
									{slide.published ? "Published" : "Draft"}
								</div>
								<div className="absolute inset-x-4 bottom-4">
									<p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#F4C430]">{slide.overline.en}</p>
									<h2 className="mt-1 line-clamp-2 text-lg font-bold leading-snug text-white">
										{slide.titleLine1.en} {slide.titleLine2.en}
									</h2>
								</div>
							</div>

							<div className="p-4">
								<div dir="rtl" className="min-h-12 border-s-2 border-[#007F84]/30 ps-3 text-sm font-semibold leading-6 text-gray-700">
									{slide.titleLine1.ar} {slide.titleLine2.ar}
								</div>
								<div className="mt-4 flex items-center gap-2">
									<Link
										href={`/admin/hero-slides/${slide.id}`}
										className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 transition hover:border-[#007F84]/40 hover:bg-[#007F84]/5 hover:text-[#01334D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007F84] motion-reduce:transition-none"
									>
										<Pencil className="h-4 w-4" />
										Edit
									</Link>
									<button
										type="button"
										onClick={() => deleteSlide(slide.id)}
										className="grid h-10 w-10 place-items-center rounded-lg border border-red-100 text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 motion-reduce:transition-none"
										aria-label={`Delete banner ${index + 1}`}
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>
						</article>
					))}
				</div>
			)}
		</div>
	);
}
