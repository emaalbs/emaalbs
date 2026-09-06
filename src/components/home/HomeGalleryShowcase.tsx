import Link from "next/link";
import { ArrowUpRight, Images } from "lucide-react";
import type { GalleryAlbum, GalleryLocale } from "@/data/gallery";
import { Container } from "@/components/ui/Container";

export function HomeGalleryShowcase({ albums, locale }: { albums: GalleryAlbum[]; locale: GalleryLocale }) {
	if (!albums.length) return null;
	const isAr = locale === "ar";
	return (
		<section className="bg-[#061923] py-20 text-white lg:py-28">
			<Container size="wide">
				<div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#EEC13B] rtl:tracking-normal">{isAr ? "معرض أعمال" : "EMAAL Gallery"}</p><h2 className="mt-4 max-w-3xl font-display text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.045em] rtl:leading-[1.3] rtl:tracking-normal">{isAr ? "قصص تُروى بالصورة." : "Stories, told in frames."}</h2></div><Link href={`/${locale}/gallery`} className="group inline-flex min-h-12 items-center gap-2 self-start rounded-full border border-white/15 px-5 text-sm font-bold text-white transition hover:border-[#EEC13B] hover:text-[#EEC13B] sm:self-auto">{isAr ? "عرض كل المعرض" : "View full gallery"}<ArrowUpRight className={`h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${isAr ? "-scale-x-100" : ""}`} /></Link></div>
				<div className="mt-12 grid gap-4 lg:grid-cols-12">{albums.slice(0, 3).map((album, index) => <Link key={album.id} href={`/${locale}/gallery/${album.slug}`} className={`group relative min-h-[360px] overflow-hidden rounded-[1.5rem] border border-white/10 ${index === 0 ? "lg:col-span-6 lg:row-span-2 lg:min-h-[620px]" : "lg:col-span-6 lg:min-h-[302px]"}`}><img src={album.coverImageUrl} alt={album.title[locale] || album.title.en || album.title.ar} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-700 [transition-timing-function:cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04] motion-reduce:transition-none" /><div className="absolute inset-0 bg-gradient-to-t from-[#011E2F]/90 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 p-6 sm:p-8"><span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EEC13B]"><Images className="h-4 w-4" />{album.imageCount} {isAr ? "صورة" : "images"}</span><h3 className="mt-3 max-w-2xl font-display text-2xl font-semibold leading-[1.25] text-white rtl:leading-[1.5]">{album.title[locale] || album.title.en || album.title.ar}</h3></div></Link>)}</div>
			</Container>
		</section>
	);
}
