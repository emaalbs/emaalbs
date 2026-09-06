"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Calendar, Images, MapPin, Sparkles } from "lucide-react";
import type { GalleryAlbum, GalleryCategory, GalleryLocale } from "@/data/gallery";

type Props = { categories: GalleryCategory[]; albums: GalleryAlbum[]; locale: GalleryLocale };

export function GalleryExplorer({ categories, albums, locale }: Props) {
	const [activeCategory, setActiveCategory] = useState("all");
	const rootRef = useRef<HTMLDivElement>(null);
	const isAr = locale === "ar";
	const filteredAlbums = useMemo(() => activeCategory === "all" ? albums : albums.filter((album) => album.categorySlug === activeCategory), [activeCategory, albums]);

	useEffect(() => {
		rootRef.current?.classList.add("gallery-motion-ready");
		const elements = rootRef.current?.querySelectorAll<HTMLElement>("[data-gallery-reveal]");
		if (!elements?.length) return;
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("gallery-visible");
					observer.unobserve(entry.target);
				}
			});
		}, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });
		elements.forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	}, [filteredAlbums]);

	const labels = isAr ? {
		all: "كل المعرض", albums: "ألبوم", images: "صورة", empty: "لا توجد ألبومات منشورة في هذه الفئة بعد.", explore: "استكشف الألبوم",
	} : {
		all: "All stories", albums: "Albums", images: "Images", empty: "No published albums in this category yet.", explore: "Explore album",
	};

	return (
		<div ref={rootRef}>
			<div className="sticky top-[72px] z-30 border-y border-white/10 bg-[#071D2A]/90 py-4 backdrop-blur-xl lg:top-[88px]">
				<div className="mx-auto flex w-full max-w-[1400px] gap-2 overflow-x-auto px-6 [scrollbar-width:none] sm:px-8 lg:px-12 [&::-webkit-scrollbar]:hidden">
					<button type="button" onClick={() => setActiveCategory("all")} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-bold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEC13B] ${activeCategory === "all" ? "border-[#EEC13B] bg-[#EEC13B] text-[#011E2F]" : "border-white/15 bg-white/[0.04] text-white/70 hover:border-white/35 hover:text-white"}`}>
						<Sparkles className="h-4 w-4" /> {labels.all}<span className="text-[10px] opacity-60">{albums.length}</span>
					</button>
					{categories.map((category) => <button key={category.id} type="button" onClick={() => setActiveCategory(category.slug)} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-bold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEC13B] ${activeCategory === category.slug ? "border-[#EEC13B] bg-[#EEC13B] text-[#011E2F]" : "border-white/15 bg-white/[0.04] text-white/70 hover:border-white/35 hover:text-white"}`}><span>{category.name[locale] || category.name.en || category.name.ar}</span><span className="text-[10px] opacity-60">{category.albumCount}</span></button>)}
				</div>
			</div>

			<div className="mx-auto w-full max-w-[1400px] px-6 py-16 sm:px-8 lg:px-12 lg:py-24">
				<div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#EEC13B] rtl:tracking-normal">{isAr ? "قصص مصوّرة" : "Visual stories"}</p><h2 className="mt-3 font-display text-[clamp(2rem,4vw,3.75rem)] font-semibold leading-[1.08] tracking-[-0.035em] text-white rtl:leading-[1.35] rtl:tracking-normal">{activeCategory === "all" ? (isAr ? "كل اللحظات، في مكان واحد." : "Every moment, in one place.") : categories.find((category) => category.slug === activeCategory)?.name[locale]}</h2></div><div className="flex gap-5 text-xs font-bold uppercase tracking-wider text-white/45 rtl:tracking-normal"><span>{filteredAlbums.length} {labels.albums}</span><span>{filteredAlbums.reduce((total, album) => total + album.imageCount, 0)} {labels.images}</span></div></div>

			{filteredAlbums.length ? <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
				{filteredAlbums.map((album, index) => {
					const wide = index % 5 === 0 || index % 5 === 3;
					return <Link key={album.id} href={`/${locale}/gallery/${album.slug}`} data-gallery-reveal className={`gallery-reveal group relative isolate min-h-[420px] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#0B2636] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEC13B] ${wide ? "lg:col-span-7" : "lg:col-span-5"}`}>
						<img src={album.coverImageUrl} alt={album.title[locale] || album.title.en || album.title.ar} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.045] motion-reduce:transition-none" />
						<div className="absolute inset-0 bg-gradient-to-t from-[#011E2F] via-[#011E2F]/30 to-transparent" />
						<div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-6"><span className="rounded-full border border-white/15 bg-[#011E2F]/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md rtl:tracking-normal">{album.categoryName[locale] || album.categoryName.en || album.categoryName.ar}</span>{album.featured ? <span className="rounded-full bg-[#EEC13B] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#011E2F] rtl:tracking-normal">{isAr ? "مختار" : "Featured"}</span> : null}</div>
						<div className="absolute inset-x-0 bottom-0 p-6 sm:p-8"><div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-white/65">{album.eventDate ? <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-[#EEC13B]" />{album.eventDate}</span> : null}{album.location[locale] ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#EEC13B]" />{album.location[locale]}</span> : null}<span className="inline-flex items-center gap-1.5"><Images className="h-3.5 w-3.5 text-[#EEC13B]" />{album.imageCount} {labels.images}</span></div><h3 className="mt-4 max-w-2xl font-display text-[clamp(1.65rem,3vw,2.65rem)] font-semibold leading-[1.12] tracking-[-0.03em] text-white rtl:leading-[1.4] rtl:tracking-normal">{album.title[locale] || album.title.en || album.title.ar}</h3><div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#EEC13B]"><span>{labels.explore}</span><ArrowUpRight className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 ${isAr ? "-scale-x-100" : ""}`} /></div></div>
					</Link>;
				})}
			</div> : <div className="rounded-[1.75rem] border border-dashed border-white/15 bg-white/[0.03] px-6 py-20 text-center text-white/55">{labels.empty}</div>}
			</div>
		</div>
	);
}
