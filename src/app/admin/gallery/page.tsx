"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ExternalLink, Eye, EyeOff, FolderKanban, Images, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import type { GalleryAlbum, GalleryAlbumInput, GalleryCategory } from "@/data/gallery";

export default function GalleryAdminPage() {
	const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
	const [categories, setCategories] = useState<GalleryCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	async function load() {
		setLoading(true);
		setError("");
		try {
			const [albumsResponse, categoriesResponse] = await Promise.all([
				fetch("/api/gallery/albums?admin=1"),
				fetch("/api/gallery/categories?admin=1"),
			]);
			const albumsData = (await albumsResponse.json()) as GalleryAlbum[] | { error?: string };
			const categoriesData = (await categoriesResponse.json()) as GalleryCategory[] | { error?: string };
			if (!albumsResponse.ok || !Array.isArray(albumsData)) throw new Error("error" in albumsData ? albumsData.error : "Failed to load gallery albums");
			if (!categoriesResponse.ok || !Array.isArray(categoriesData)) throw new Error("error" in categoriesData ? categoriesData.error : "Failed to load gallery categories");
			setAlbums(albumsData);
			setCategories(categoriesData);
		} catch (loadError) {
			setError(loadError instanceof Error ? loadError.message : "Failed to load gallery");
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => { void load(); }, []);

	async function togglePublished(album: GalleryAlbum) {
		const detailResponse = await fetch(`/api/gallery/albums/${album.id}`);
		const detail = (await detailResponse.json()) as GalleryAlbum | { error?: string };
		if (!detailResponse.ok || !("id" in detail)) return;
		const payload: GalleryAlbumInput = {
			categoryId: detail.categoryId, slug: detail.slug, title: detail.title, description: detail.description,
			coverImageUrl: detail.coverImageUrl, eventDate: detail.eventDate, location: detail.location,
			published: !detail.published, featured: detail.featured, sortOrder: detail.sortOrder, images: detail.images,
		};
		const response = await fetch(`/api/gallery/albums/${album.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
		if (response.ok) await load();
	}

	async function remove(album: GalleryAlbum) {
		if (!confirm(`Delete “${album.title.en || album.title.ar}” and all ${album.imageCount} image(s)? This cannot be undone.`)) return;
		const response = await fetch(`/api/gallery/albums/${album.id}`, { method: "DELETE" });
		if (response.ok) await load();
	}

	return (
		<div className="pb-12">
			<div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#007F84]">Visual Archive</p><h1 className="mt-2 text-3xl font-bold text-gray-900">Gallery Portfolio</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">Organize event photography into categories and albums, then publish a shareable visual story.</p></div>
				<div className="flex flex-wrap gap-2">
					<a href="/en/gallery" target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-[#007F84]/40 hover:text-[#01334D]"><ExternalLink className="h-4 w-4" /> Preview gallery</a>
					<Link href="/admin/gallery/categories" className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#01334D]/15 bg-[#01334D]/5 px-4 text-sm font-semibold text-[#01334D] transition hover:bg-[#01334D]/10"><FolderKanban className="h-4 w-4" /> Categories</Link>
					<Link href={categories.length ? "/admin/gallery/new" : "/admin/gallery/categories"} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#01334D] px-4 text-sm font-semibold text-white transition hover:bg-[#011E2F]"><Plus className="h-4 w-4" /> Add album</Link>
				</div>
			</div>

			<div className="mb-7 grid gap-4 sm:grid-cols-3">
				<div className="rounded-2xl border border-gray-200 bg-white p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-50 text-cyan-700"><FolderKanban className="h-5 w-5" /></span><div><p className="text-xs font-semibold text-gray-400">Categories</p><p className="text-2xl font-black text-gray-900">{categories.length}</p></div></div></div>
				<div className="rounded-2xl border border-gray-200 bg-white p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700"><Images className="h-5 w-5" /></span><div><p className="text-xs font-semibold text-gray-400">Albums</p><p className="text-2xl font-black text-gray-900">{albums.length}</p></div></div></div>
				<div className="rounded-2xl border border-gray-200 bg-white p-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><Eye className="h-5 w-5" /></span><div><p className="text-xs font-semibold text-gray-400">Published</p><p className="text-2xl font-black text-gray-900">{albums.filter((album) => album.published).length}</p></div></div></div>
			</div>

			{error ? <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
			{loading ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-96 animate-pulse rounded-2xl bg-white" />)}</div> : albums.length === 0 ? (
				<div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center"><Images className="mx-auto h-10 w-10 text-gray-300" /><h2 className="mt-4 font-bold text-gray-900">No gallery albums yet</h2><p className="mt-2 text-sm text-gray-500">Create a category first, then add your first visual story.</p><Link href="/admin/gallery/categories" className="mt-5 inline-flex h-10 items-center rounded-xl bg-[#01334D] px-4 text-sm font-bold text-white">Create category</Link></div>
			) : (
				<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
					{albums.map((album) => <article key={album.id} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl motion-reduce:transition-none">
						<div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#011E2F] to-[#007F84]">{album.coverImageUrl ? <img src={album.coverImageUrl} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] motion-reduce:transition-none" /> : null}<div className="absolute inset-0 bg-gradient-to-t from-[#011E2F]/85 via-transparent to-transparent" /><div className="absolute inset-x-4 top-4 flex items-center justify-between"><span className="rounded-full border border-white/15 bg-[#011E2F]/55 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">{album.categoryName.en || album.categoryName.ar}</span><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${album.published ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{album.published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}{album.published ? "Published" : "Draft"}</span></div><div className="absolute inset-x-4 bottom-4 flex items-center justify-between text-white"><span className="inline-flex items-center gap-1.5 text-xs font-semibold"><Images className="h-4 w-4 text-[#F4C430]" /> {album.imageCount} image(s)</span>{album.featured ? <Star className="h-4 w-4 fill-[#F4C430] text-[#F4C430]" /> : null}</div></div>
						<div className="p-5"><h2 className="line-clamp-2 min-h-12 text-base font-bold leading-6 text-gray-900">{album.title.en || album.title.ar}</h2><div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400">{album.eventDate ? <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{album.eventDate}</span> : null}{(album.location.en || album.location.ar) ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{album.location.en || album.location.ar}</span> : null}</div><div className="mt-5 flex items-center gap-2"><Link href={`/admin/gallery/${album.id}`} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 transition hover:border-[#007F84]/40 hover:bg-[#007F84]/5"><Pencil className="h-4 w-4" /> Edit</Link><button type="button" onClick={() => void togglePublished(album)} className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50" title={album.published ? "Move to draft" : "Publish"}>{album.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button><button type="button" onClick={() => void remove(album)} className="grid h-10 w-10 place-items-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="h-4 w-4" /></button></div></div>
					</article>)}
				</div>
			)}
		</div>
	);
}
