"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images, Maximize2, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";
import { IbsSectionHeading } from "./IbsSectionHeading";

export function EditionGallery({ edition }: { edition: IbsEdition }) {
	const { locale } = useI18n();
	const [activeIndex, setActiveIndex] = useState<number | null>(null);
	const labels = ibsOverview.editionLabels;
	const isAr = locale === "ar";

	const closeLightbox = useCallback(() => setActiveIndex(null), []);
	const showPrevious = useCallback(() => {
		setActiveIndex((current) => current === null ? null : (current - 1 + edition.gallery.length) % edition.gallery.length);
	}, [edition.gallery.length]);
	const showNext = useCallback(() => {
		setActiveIndex((current) => current === null ? null : (current + 1) % edition.gallery.length);
	}, [edition.gallery.length]);

	useEffect(() => {
		if (activeIndex === null) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") closeLightbox();
			if (event.key === "ArrowLeft") showPrevious();
			if (event.key === "ArrowRight") showNext();
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [activeIndex, closeLightbox, showNext, showPrevious]);

	if (!edition.gallery.length) return null;
	const activeImage = activeIndex === null ? null : edition.gallery[activeIndex];

	return (
		<section className="relative overflow-hidden bg-[var(--color-warm)] py-20 lg:py-24">
			<div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-teal)]/20 to-transparent" />
			<Container>
				<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
					<IbsSectionHeading overline={labels.gallery[locale]} title={isAr ? "لقطات من القمة." : "Frames from the floor."} />
					<div className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-xs font-bold text-[var(--color-slate)] shadow-sm sm:self-auto">
						<Images className="h-4 w-4 text-[var(--color-teal)]" aria-hidden="true" />
						<span>{edition.gallery.length}</span>
						<span>{isAr ? "صورة" : "photos"}</span>
					</div>
				</div>

				<div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
					{edition.gallery.map((image, index) => (
						<button
							type="button"
							key={image.id}
							onClick={() => setActiveIndex(index)}
							className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[var(--color-line)] bg-[#E8EEF0] text-start shadow-[0_10px_30px_rgba(1,51,77,0.06)] transition-[transform,box-shadow,border-color] duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:border-[var(--color-teal)]/35 hover:shadow-[0_22px_48px_rgba(1,51,77,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-3 motion-reduce:transform-none motion-reduce:transition-none"
							aria-label={isAr ? `عرض الصورة ${index + 1}` : `View photo ${index + 1}`}
						>
							<Image
								src={image.src}
								alt={image.alt[locale] || (isAr ? `صورة من القمة ${index + 1}` : `Summit photo ${index + 1}`)}
								fill
								sizes="(min-width: 1024px) 33vw, 50vw"
								className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035] motion-reduce:transition-none"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.78)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" />
							<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 opacity-0 transition-[opacity,transform] duration-300 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:opacity-100 group-focus-visible:opacity-100 sm:p-4 motion-reduce:transition-none">
								{image.alt[locale] ? <span className="line-clamp-2 text-xs font-semibold leading-5 text-white sm:text-sm">{image.alt[locale]}</span> : <span />}
								<span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/95 text-[var(--color-navy)] shadow-lg" aria-hidden="true"><Maximize2 className="h-4 w-4" /></span>
							</div>
						</button>
					))}
				</div>
			</Container>

			{activeImage && activeIndex !== null ? (
				<div role="dialog" aria-modal="true" aria-label={isAr ? "عارض صور القمة" : "Summit photo viewer"} className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(1,20,31,0.94)] p-4 backdrop-blur-md sm:p-8" onMouseDown={(event) => { if (event.target === event.currentTarget) closeLightbox(); }}>
					<button type="button" onClick={closeLightbox} className="absolute end-4 top-4 z-10 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition-colors duration-200 hover:bg-white hover:text-[var(--color-navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] sm:end-7 sm:top-7" aria-label={isAr ? "إغلاق" : "Close"}><X className="h-5 w-5" /></button>
					<button type="button" onClick={showPrevious} className="absolute start-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition-colors duration-200 hover:bg-white hover:text-[var(--color-navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] sm:start-7" aria-label={isAr ? "الصورة السابقة" : "Previous photo"}><ChevronLeft className={`h-6 w-6 ${isAr ? "rotate-180" : ""}`} /></button>
					<figure className="flex h-full w-full max-w-6xl flex-col items-center justify-center px-10 py-12 sm:px-16">
						<div className="relative min-h-0 w-full flex-1">
							<Image src={activeImage.src} alt={activeImage.alt[locale] || (isAr ? `صورة من القمة ${activeIndex + 1}` : `Summit photo ${activeIndex + 1}`)} fill sizes="100vw" priority className="object-contain" />
						</div>
						<figcaption className="mt-4 flex w-full max-w-3xl items-center justify-between gap-5 text-white">
							<span className="text-sm font-semibold leading-6 text-white/85">{activeImage.alt[locale]}</span>
							<span dir="ltr" className="shrink-0 font-numeric text-xs font-bold text-white/55">{activeIndex + 1} / {edition.gallery.length}</span>
						</figcaption>
					</figure>
					<button type="button" onClick={showNext} className="absolute end-3 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition-colors duration-200 hover:bg-white hover:text-[var(--color-navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] sm:end-7" aria-label={isAr ? "الصورة التالية" : "Next photo"}><ChevronRight className={`h-6 w-6 ${isAr ? "rotate-180" : ""}`} /></button>
				</div>
			) : null}
		</section>
	);
}
