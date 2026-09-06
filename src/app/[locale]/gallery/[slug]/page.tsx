import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { GalleryAlbumView } from "@/components/gallery/GalleryAlbumView";
import { getPublishedGalleryAlbumBySlug } from "@/lib/db/gallery";
import { buildMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: string; slug: string }>; searchParams: Promise<{ photo?: string }> };

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale: rawLocale, slug } = await params;
	const locale = rawLocale === "ar" ? "ar" : "en";
	const album = await getPublishedGalleryAlbumBySlug(slug);
	if (!album) return {};
	return buildMetadata({ type: "galleryAlbum", locale, slug, title: album.title[locale] || album.title.en || album.title.ar, description: album.description[locale] || album.description.en || album.description.ar, image: album.coverImageUrl });
}

export default async function GalleryAlbumPage({ params, searchParams }: Props) {
	const [{ locale: rawLocale, slug }, query] = await Promise.all([params, searchParams]);
	const locale = rawLocale === "ar" ? "ar" : "en";
	const album = await getPublishedGalleryAlbumBySlug(slug);
	if (!album) notFound();
	const photoId = query.photo && /^\d+$/.test(query.photo) ? Number(query.photo) : undefined;
	return <><Header /><GalleryAlbumView album={album} locale={locale} initialImageId={photoId} /><Footer /></>;
}
