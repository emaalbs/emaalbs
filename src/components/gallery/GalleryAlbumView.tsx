"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Check, ChevronLeft, ChevronRight, Images, MapPin, Share2, X } from "lucide-react";
import type { GalleryAlbum, GalleryImage, GalleryLocale } from "@/data/gallery";

type Props = { album: GalleryAlbum; locale: GalleryLocale; initialImageId?: number };

export function GalleryAlbumView({ album, locale, initialImageId }: Props) {
	const isAr = locale === "ar";
	const initialIndex = initialImageId ? album.images.findIndex((image) => image.id === initialImageId) : -1;
	const [activeIndex, setActiveIndex] = useState(initialIndex);
	const [copiedId, setCopiedId] = useState<number | "album" | null>(null);
	const [visibleCount, setVisibleCount] = useState(36);
	const activeImage = activeIndex >= 0 ? album.images[activeIndex] : null;
	const labels = isAr ? { back: "كل المعرض", photos: "صور", shareAlbum: "مشاركة الألبوم", shareImage: "مشاركة الصورة", copied: "تم نسخ الرابط", close: "إغلاق", next: "الصورة التالية", previous: "الصورة السابقة", loadMore: "عرض المزيد من الصور" } : { back: "All gallery", photos: "Photos", shareAlbum: "Share album", shareImage: "Share image", copied: "Link copied", close: "Close", next: "Next image", previous: "Previous image", loadMore: "Load more photos" };

	const close = useCallback(() => {
		setActiveIndex(-1);
		window.history.replaceState(null, "", window.location.pathname);
	}, []);
	const show = useCallback((index: number) => {
		const normalized = (index + album.images.length) % album.images.length;
		setActiveIndex(normalized);
		window.history.replaceState(null, "", `${window.location.pathname}?photo=${album.images[normalized].id}`);
	}, [album.images]);

	useEffect(() => {
		if (!activeImage) return;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		function handleKey(event: KeyboardEvent) {
			if (event.key === "Escape") close();
			if (event.key === "ArrowRight") show(activeIndex + (isAr ? -1 : 1));
			if (event.key === "ArrowLeft") show(activeIndex + (isAr ? 1 : -1));
		}
		window.addEventListener("keydown", handleKey);
		return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handleKey); };
	}, [activeImage, activeIndex, close, isAr, show]);

	async function share(image?: GalleryImage) {
		const url = image ? `${window.location.origin}/${locale}/gallery/${album.slug}?photo=${image.id}` : `${window.location.origin}/${locale}/gallery/${album.slug}`;
		const title = image ? image.title[locale] || album.title[locale] : album.title[locale];
		try {
			if (navigator.share) await navigator.share({ title, text: image?.description[locale] || album.description[locale], url });
			else await navigator.clipboard.writeText(url);
			setCopiedId(image?.id || "album");
			window.setTimeout(() => setCopiedId(null), 2200);
		} catch (error) {
			if (error instanceof DOMException && error.name === "AbortError") return;
			try { await navigator.clipboard.writeText(url); setCopiedId(image?.id || "album"); } catch { window.prompt(isAr ? "انسخ الرابط" : "Copy this link", url); }
		}
	}

	return (
		<main className="bg-[#061923] text-white">
			<section className="relative isolate min-h-[72vh] overflow-hidden pt-24 lg:pt-28"><img src={album.coverImageUrl} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#061923] via-[#061923]/60 to-[#011E2F]/35" /><div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_78%_18%,rgba(238,193,59,.18),transparent_30%)]" /><div className="mx-auto flex min-h-[calc(72vh-6rem)] w-full max-w-[1400px] flex-col justify-end px-6 pb-14 sm:px-8 lg:px-12 lg:pb-20"><Link href={`/${locale}/gallery`} className="gallery-enter mb-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-xs font-bold text-white/80 backdrop-blur-md transition hover:border-white/35 hover:text-white">{isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}{labels.back}</Link><div className="gallery-enter gallery-enter-delay-1 max-w-4xl"><span className="inline-flex rounded-full bg-[#EEC13B] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-[#011E2F] rtl:tracking-normal">{album.categoryName[locale] || album.categoryName.en || album.categoryName.ar}</span><h1 className="mt-5 font-display text-[clamp(2.6rem,7vw,6.8rem)] font-semibold leading-[.96] tracking-[-0.055em] text-white rtl:leading-[1.2] rtl:tracking-normal">{album.title[locale] || album.title.en || album.title.ar}</h1><div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-white/65">{album.eventDate ? <span className="inline-flex items-center gap-2"><Calendar className="h-4 w-4 text-[#EEC13B]" />{album.eventDate}</span> : null}{album.location[locale] ? <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#EEC13B]" />{album.location[locale]}</span> : null}<span className="inline-flex items-center gap-2"><Images className="h-4 w-4 text-[#EEC13B]" />{album.imageCount} {labels.photos}</span></div></div></div></section>

			<section className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 py-16 sm:px-8 lg:grid-cols-12 lg:px-12 lg:py-24"><div className="lg:col-span-8"><p className="max-w-4xl text-lg leading-[1.8] text-white/70 rtl:text-[18px] rtl:leading-[2]">{album.description[locale] || album.description.en || album.description.ar}</p></div><div className="lg:col-span-4 lg:flex lg:justify-end"><button type="button" onClick={() => void share()} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-5 text-sm font-bold text-white transition duration-300 hover:border-[#EEC13B] hover:bg-[#EEC13B] hover:text-[#011E2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEC13B]"><Share2 className="h-4 w-4" />{copiedId === "album" ? labels.copied : labels.shareAlbum}</button></div></section>

			<section className="mx-auto w-full max-w-[1400px] px-6 pb-24 sm:px-8 lg:px-12 lg:pb-32"><div className="columns-1 gap-5 sm:columns-2 lg:columns-3">{album.images.slice(0, visibleCount).map((image, index) => <figure key={image.id} className="group relative mb-5 break-inside-avoid overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04]"><button type="button" onClick={() => show(index)} className="relative block w-full overflow-hidden text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EEC13B]" aria-label={`${image.title[locale] || album.title[locale]} — ${index + 1}`}><img src={image.imageUrl} alt={image.alt[locale] || image.title[locale] || album.title[locale]} loading="lazy" className="h-auto w-full object-cover transition duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.035] motion-reduce:transition-none" /><span className="absolute inset-0 bg-gradient-to-t from-[#011E2F]/85 via-transparent to-transparent opacity-60 transition duration-500 group-hover:opacity-100" />{image.title[locale] || image.description[locale] ? <span className="absolute inset-x-0 bottom-0 block p-5 sm:p-6"><span className="block text-base font-bold leading-relaxed text-white">{image.title[locale]}</span>{image.description[locale] ? <span className="mt-1 line-clamp-2 block text-xs leading-6 text-white/65">{image.description[locale]}</span> : null}</span> : null}</button><button type="button" onClick={() => void share(image)} className="absolute end-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#011E2F]/60 text-white opacity-100 backdrop-blur-md transition duration-300 hover:border-[#EEC13B] hover:bg-[#EEC13B] hover:text-[#011E2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEC13B] lg:opacity-0 lg:group-hover:opacity-100" aria-label={labels.shareImage}>{copiedId === image.id ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}</button></figure>)}</div>{visibleCount < album.images.length ? <div className="mt-10 flex justify-center"><button type="button" onClick={() => setVisibleCount((current) => Math.min(album.images.length, current + 36))} className="inline-flex min-h-12 items-center rounded-full border border-[#EEC13B]/60 px-6 text-sm font-bold text-[#EEC13B] transition duration-300 hover:bg-[#EEC13B] hover:text-[#011E2F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EEC13B]">{labels.loadMore}</button></div> : null}</section>

			{activeImage ? <div role="dialog" aria-modal="true" aria-label={activeImage.title[locale] || album.title[locale]} className="fixed inset-0 z-[100] flex flex-col bg-[#020B10]/96 backdrop-blur-xl"><div className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6"><span className="font-numeric text-xs font-bold text-white/50" dir="ltr">{activeIndex + 1} / {album.images.length}</span><div className="flex items-center gap-2"><button type="button" onClick={() => void share(activeImage)} className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-3.5 text-xs font-bold text-white hover:border-[#EEC13B] hover:text-[#EEC13B]" aria-label={labels.shareImage}>{copiedId === activeImage.id ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}<span className="hidden sm:inline">{copiedId === activeImage.id ? labels.copied : labels.shareImage}</span></button><button type="button" onClick={close} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white hover:border-white/40" aria-label={labels.close}><X className="h-5 w-5" /></button></div></div><div className="relative flex min-h-0 flex-1 items-center justify-center p-4 sm:p-8"><img src={activeImage.imageUrl} alt={activeImage.alt[locale] || activeImage.title[locale] || album.title[locale]} className="gallery-lightbox-image max-h-full max-w-full object-contain" /><button type="button" onClick={() => show(activeIndex + (isAr ? 1 : -1))} className="absolute start-3 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-[#011E2F]/55 text-white backdrop-blur hover:border-[#EEC13B] hover:text-[#EEC13B] sm:start-6" aria-label={labels.previous}>{isAr ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}</button><button type="button" onClick={() => show(activeIndex + (isAr ? -1 : 1))} className="absolute end-3 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-[#011E2F]/55 text-white backdrop-blur hover:border-[#EEC13B] hover:text-[#EEC13B] sm:end-6" aria-label={labels.next}>{isAr ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}</button></div>{activeImage.title[locale] || activeImage.description[locale] ? <div className="shrink-0 border-t border-white/10 px-6 py-5 text-center"><h2 className="font-display text-lg font-bold text-white">{activeImage.title[locale]}</h2>{activeImage.description[locale] ? <p className="mx-auto mt-1 max-w-3xl text-sm leading-6 text-white/55">{activeImage.description[locale]}</p> : null}</div> : null}</div> : null}
		</main>
	);
}
