import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { GalleryExplorer } from "@/components/gallery/GalleryExplorer";
import { listGalleryAlbums, listGalleryCategories } from "@/lib/db/gallery";
import { buildMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	return buildMetadata({ type: "gallery", locale: locale === "ar" ? "ar" : "en" });
}

export default async function GalleryPage({ params }: Props) {
	const { locale: rawLocale } = await params;
	const locale = rawLocale === "ar" ? "ar" : "en";
	const [categories, albums] = await Promise.all([listGalleryCategories(), listGalleryAlbums()]);
	return <><Header /><main className="bg-[#061923]"><section className="relative isolate overflow-hidden px-6 pb-20 pt-36 sm:px-8 lg:px-12 lg:pb-28 lg:pt-44"><div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_76%_18%,rgba(0,127,132,.3),transparent_28%),radial-gradient(circle_at_18%_72%,rgba(238,193,59,.13),transparent_25%),linear-gradient(135deg,#011E2F_0%,#061923_60%,#092B3C_100%)]" /><div className="absolute inset-0 -z-10 opacity-[.08] [background-image:linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] [background-size:64px_64px]" /><div className="mx-auto w-full max-w-[1400px]"><p className="gallery-enter text-xs font-black uppercase tracking-[0.24em] text-[#EEC13B] rtl:tracking-normal">{locale === "ar" ? "أرشيف أعمال البصري" : "EMAAL visual archive"}</p><div className="mt-5 grid items-end gap-8 lg:grid-cols-12"><h1 className="gallery-enter gallery-enter-delay-1 font-display text-[clamp(3.25rem,9vw,8.5rem)] font-semibold leading-[.88] tracking-[-0.065em] text-white rtl:leading-[1.12] rtl:tracking-normal lg:col-span-8">{locale === "ar" ? <>لحظات تصنع<br /><span className="text-white/35">الأثر.</span></> : <>Moments that<br /><span className="text-white/35">move business.</span></>}</h1><p className="gallery-enter gallery-enter-delay-2 max-w-lg text-base leading-[1.8] text-white/60 rtl:text-[18px] rtl:leading-[2] lg:col-span-4">{locale === "ar" ? "استكشف مؤتمرات أعمال وفعالياتها وشراكاتها من خلال قصص مصوّرة منظّمة حسب القمة والموضوع." : "Explore EMAAL summits, events, and partnerships through visual stories organized by platform and theme."}</p></div></div></section><GalleryExplorer categories={categories} albums={albums} locale={locale} /></main><Footer /></>;
}
