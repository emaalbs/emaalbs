"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, ExternalLink, LoaderCircle, Save, Trash2 } from "lucide-react";
import type { GalleryAlbum, GalleryAlbumInput, GalleryCategory } from "@/data/gallery";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryImagesEditor } from "@/components/admin/gallery/GalleryImagesEditor";
import { normalizeGallerySlug } from "@/lib/gallery-validation";

function emptyAlbum(): GalleryAlbumInput {
	return { categoryId: 0, slug: "", title: { en: "", ar: "" }, description: { en: "", ar: "" }, coverImageUrl: "", eventDate: "", location: { en: "", ar: "" }, published: false, featured: false, sortOrder: 0, images: [] };
}

function toInput(album: GalleryAlbum): GalleryAlbumInput {
	return { categoryId: album.categoryId, slug: album.slug, title: album.title, description: album.description, coverImageUrl: album.coverImageUrl, eventDate: album.eventDate, location: album.location, published: album.published, featured: album.featured, sortOrder: album.sortOrder, images: album.images };
}

export default function GalleryAlbumEditor({ params }: { params: Promise<{ id: string }> }) {
	const router = useRouter();
	const [id, setId] = useState<string | null>(null);
	const [album, setAlbum] = useState<GalleryAlbumInput>(emptyAlbum());
	const [categories, setCategories] = useState<GalleryCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		params.then(async ({ id: value }) => {
			setId(value);
			const categoriesResponse = await fetch("/api/gallery/categories?admin=1");
			const categoriesData = (await categoriesResponse.json()) as GalleryCategory[];
			if (Array.isArray(categoriesData)) setCategories(categoriesData);
			if (value !== "new") {
				const response = await fetch(`/api/gallery/albums/${value}`);
				const data = (await response.json()) as GalleryAlbum | { error?: string };
				if (response.ok && "id" in data) setAlbum(toInput(data));
				else setError("error" in data ? data.error || "Failed to load album" : "Failed to load album");
			} else if (Array.isArray(categoriesData) && categoriesData[0]) {
				setAlbum((current) => ({ ...current, categoryId: categoriesData[0].id }));
			}
			setLoading(false);
		});
	}, [params]);

	async function save() {
		setSaving(true);
		setError("");
		setSuccess(false);
		try {
			const response = await fetch(id === "new" ? "/api/gallery/albums" : `/api/gallery/albums/${id}`, {
				method: id === "new" ? "POST" : "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(album),
			});
			const data = (await response.json()) as { id?: number; error?: string };
			if (!response.ok) throw new Error(data.error || "Failed to save gallery album");
			setSuccess(true);
			if (id === "new" && data.id) router.replace(`/admin/gallery/${data.id}`);
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "Failed to save gallery album");
		} finally {
			setSaving(false);
		}
	}

	async function remove() {
		if (!id || id === "new" || !confirm("Delete this album and all its images? This cannot be undone.")) return;
		const response = await fetch(`/api/gallery/albums/${id}`, { method: "DELETE" });
		if (response.ok) router.push("/admin/gallery");
	}

	if (loading) return <div className="flex items-center gap-2 text-sm text-gray-400"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading gallery album...</div>;

	return (
		<div className="pb-12">
			<div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
				<div className="flex items-center gap-3"><button type="button" onClick={() => router.push("/admin/gallery")} className="grid h-11 w-11 place-items-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50" aria-label="Back"><ArrowLeft className="h-4 w-4" /></button><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#007F84]">Gallery Portfolio</p><h1 className="mt-1 text-2xl font-bold text-gray-900">{id === "new" ? "Create album" : "Edit album"}</h1></div></div>
				<div className="flex flex-wrap gap-2">{id !== "new" && album.published ? <a href={`/en/gallery/${album.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700"><ExternalLink className="h-4 w-4" /> View album</a> : null}{id !== "new" ? <button type="button" onClick={() => void remove()} className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-sm font-semibold text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete</button> : null}<button type="button" onClick={() => void save()} disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#01334D] px-5 text-sm font-bold text-white hover:bg-[#011E2F] disabled:opacity-60">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save album</button></div>
			</div>

			{categories.length === 0 ? <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">Create at least one category before saving an album. <button type="button" onClick={() => router.push("/admin/gallery/categories")} className="font-bold underline">Manage categories</button></div> : null}
			{error ? <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
			{success ? <div className="mb-5 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Album saved successfully</div> : null}

			<div className="space-y-6">
				<section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"><div><h2 className="text-lg font-bold text-gray-900">Album identity</h2><p className="mt-1 text-sm text-gray-500">The main information visitors see before opening the photos.</p></div><div className="mt-6 space-y-6">
					<div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span><select value={album.categoryId} onChange={(event) => setAlbum((current) => ({ ...current, categoryId: Number(event.target.value) }))} className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 outline-none focus:border-[#007F84]"><option value={0}>Choose category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name.en || category.name.ar}{category.published ? "" : " — Draft"}</option>)}</select></label><label className="text-sm font-medium text-gray-700">URL slug <span className="text-red-500">*</span><input dir="ltr" value={album.slug} onChange={(event) => setAlbum((current) => ({ ...current, slug: normalizeGallerySlug(event.target.value) }))} placeholder="insurance-summit-2026" className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#007F84]" /></label></div>
					<BilingualField label="Album title" required enValue={album.title.en} arValue={album.title.ar} onEnChange={(value) => setAlbum((current) => ({ ...current, title: { ...current.title, en: value }, slug: current.slug || normalizeGallerySlug(value) }))} onArChange={(value) => setAlbum((current) => ({ ...current, title: { ...current.title, ar: value } }))} />
					<BilingualField label="Main description" multiline rows={5} enValue={album.description.en} arValue={album.description.ar} onEnChange={(value) => setAlbum((current) => ({ ...current, description: { ...current.description, en: value } }))} onArChange={(value) => setAlbum((current) => ({ ...current, description: { ...current.description, ar: value } }))} />
					<div className="grid gap-5 md:grid-cols-2"><label className="text-sm font-medium text-gray-700">Event date<input type="date" value={album.eventDate} onChange={(event) => setAlbum((current) => ({ ...current, eventDate: event.target.value }))} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#007F84]" /></label><BilingualField label="Location" enValue={album.location.en} arValue={album.location.ar} onEnChange={(value) => setAlbum((current) => ({ ...current, location: { ...current.location, en: value } }))} onArChange={(value) => setAlbum((current) => ({ ...current, location: { ...current.location, ar: value } }))} /></div>
					<ImageUpload value={album.coverImageUrl} onChange={(url) => setAlbum((current) => ({ ...current, coverImageUrl: url }))} label="Album cover" hint="Optional. If empty, the first image becomes the cover automatically." preset="gallery" prefix="gallery/covers/" />
					<div className="grid gap-4 sm:grid-cols-3"><label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"><span>Published</span><input type="checkbox" checked={album.published} onChange={(event) => setAlbum((current) => ({ ...current, published: event.target.checked }))} className="h-4 w-4 accent-[#007F84]" /></label><label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"><span>Featured</span><input type="checkbox" checked={album.featured} onChange={(event) => setAlbum((current) => ({ ...current, featured: event.target.checked }))} className="h-4 w-4 accent-[#EEC13B]" /></label><label className="text-sm font-medium text-gray-700">Sort order<input type="number" value={album.sortOrder} onChange={(event) => setAlbum((current) => ({ ...current, sortOrder: Number(event.target.value) || 0 }))} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#007F84]" /></label></div>
				</div></section>

				<section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><h2 className="text-lg font-bold text-gray-900">Album images</h2><p className="mt-1 text-sm text-gray-500">Upload one or many images, reorder them, choose the cover, and add bilingual details.</p></div><span className="rounded-full bg-[#01334D]/5 px-3 py-1 text-xs font-bold text-[#01334D]">{album.images.length} / 100 images</span></div><div className="mt-6"><GalleryImagesEditor images={album.images} coverImageUrl={album.coverImageUrl} onChange={(images) => setAlbum((current) => ({ ...current, images }))} onCoverChange={(coverImageUrl) => setAlbum((current) => ({ ...current, coverImageUrl }))} /></div></section>
			</div>
		</div>
	);
}
