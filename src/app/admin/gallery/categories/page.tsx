"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import type { GalleryCategory, GalleryCategoryInput } from "@/data/gallery";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { normalizeGallerySlug } from "@/lib/gallery-validation";

function emptyCategory(): GalleryCategoryInput {
	return { slug: "", name: { en: "", ar: "" }, description: { en: "", ar: "" }, coverImageUrl: "", published: false, sortOrder: 0 };
}

function toInput(category: GalleryCategory): GalleryCategoryInput {
	return { slug: category.slug, name: category.name, description: category.description, coverImageUrl: category.coverImageUrl, published: category.published, sortOrder: category.sortOrder };
}

export default function GalleryCategoriesAdminPage() {
	const [categories, setCategories] = useState<GalleryCategory[]>([]);
	const [editingId, setEditingId] = useState<number | null>(null);
	const [category, setCategory] = useState<GalleryCategoryInput>(emptyCategory());
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	async function load() {
		setLoading(true);
		const response = await fetch("/api/gallery/categories?admin=1");
		const data = (await response.json()) as GalleryCategory[] | { error?: string };
		if (response.ok && Array.isArray(data)) setCategories(data);
		else setError("error" in data ? data.error || "Failed to load categories" : "Failed to load categories");
		setLoading(false);
	}

	useEffect(() => { void load(); }, []);

	function startEdit(item?: GalleryCategory) {
		setEditingId(item?.id || null);
		setCategory(item ? toInput(item) : emptyCategory());
		setError("");
		setSuccess(false);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	async function save() {
		setSaving(true);
		setError("");
		setSuccess(false);
		try {
			const response = await fetch(editingId ? `/api/gallery/categories/${editingId}` : "/api/gallery/categories", {
				method: editingId ? "PUT" : "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(category),
			});
			const data = (await response.json()) as { error?: string };
			if (!response.ok) throw new Error(data.error || "Failed to save category");
			setSuccess(true);
			setEditingId(null);
			setCategory(emptyCategory());
			await load();
		} catch (saveError) {
			setError(saveError instanceof Error ? saveError.message : "Failed to save category");
		} finally {
			setSaving(false);
		}
	}

	async function remove(item: GalleryCategory) {
		if (!confirm(`Delete “${item.name.en || item.name.ar}” and all ${item.albumCount} album(s) inside it? This cannot be undone.`)) return;
		const response = await fetch(`/api/gallery/categories/${item.id}`, { method: "DELETE" });
		if (response.ok) { if (editingId === item.id) startEdit(); await load(); }
	}

	return (
		<div className="pb-12">
			<div className="mb-7 flex items-center gap-3">
				<Link href="/admin/gallery" className="grid h-11 w-11 place-items-center rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50" aria-label="Back"><ArrowLeft className="h-4 w-4" /></Link>
				<div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#007F84]">Gallery Portfolio</p><h1 className="mt-1 text-2xl font-bold text-gray-900">Categories</h1></div>
			</div>

			<div className="grid gap-7 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
				<section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
					<div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold text-gray-900">{editingId ? "Edit category" : "Add category"}</h2><p className="mt-1 text-sm text-gray-500">Use categories for each summit, event family, or portfolio theme.</p></div>{editingId ? <button type="button" onClick={() => startEdit()} className="text-sm font-bold text-[#007F84]">New category</button> : null}</div>
					<div className="mt-6 space-y-6">
						<BilingualField label="Category name" required enValue={category.name.en} arValue={category.name.ar} onEnChange={(value) => setCategory((current) => ({ ...current, name: { ...current.name, en: value }, slug: current.slug || normalizeGallerySlug(value) }))} onArChange={(value) => setCategory((current) => ({ ...current, name: { ...current.name, ar: value } }))} />
						<div><label className="text-sm font-medium text-gray-700">URL slug <span className="text-red-500">*</span></label><input dir="ltr" value={category.slug} onChange={(event) => setCategory((current) => ({ ...current, slug: normalizeGallerySlug(event.target.value) }))} placeholder="health-insurance-summit" className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007F84]" /></div>
						<BilingualField label="Category description" multiline rows={3} enValue={category.description.en} arValue={category.description.ar} onEnChange={(value) => setCategory((current) => ({ ...current, description: { ...current.description, en: value } }))} onArChange={(value) => setCategory((current) => ({ ...current, description: { ...current.description, ar: value } }))} />
						<ImageUpload value={category.coverImageUrl} onChange={(url) => setCategory((current) => ({ ...current, coverImageUrl: url }))} label="Category cover image" hint="Optional — used as a visual accent in category views." preset="gallery" prefix="gallery/categories/" />
						<div className="grid gap-4 sm:grid-cols-2"><label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"><span>Published</span><input type="checkbox" checked={category.published} onChange={(event) => setCategory((current) => ({ ...current, published: event.target.checked }))} className="h-4 w-4 accent-[#007F84]" /></label><label className="block text-sm font-medium text-gray-700">Sort order<input type="number" value={category.sortOrder} onChange={(event) => setCategory((current) => ({ ...current, sortOrder: Number(event.target.value) || 0 }))} className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 outline-none focus:border-[#007F84]" /></label></div>
						{error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
						{success ? <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> Category saved</p> : null}
						<button type="button" onClick={() => void save()} disabled={saving} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#01334D] px-5 text-sm font-bold text-white transition hover:bg-[#011E2F] disabled:opacity-60">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}{editingId ? "Save changes" : "Add category"}</button>
					</div>
				</section>

				<section><div className="mb-4 flex items-end justify-between"><div><h2 className="text-lg font-bold text-gray-900">Existing categories</h2><p className="text-sm text-gray-500">Deleting a category also deletes its albums.</p></div><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">{categories.length}</span></div>
					{loading ? <div className="h-44 animate-pulse rounded-2xl bg-white" /> : <div className="space-y-3">{categories.map((item) => <article key={item.id} className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#011E2F] to-[#007F84]">{item.coverImageUrl ? <img src={item.coverImageUrl} alt="" className="h-full w-full object-cover" /> : null}</div><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><h3 className="truncate font-bold text-gray-900">{item.name.en || item.name.ar}</h3><p className="mt-1 text-xs text-gray-400">{item.albumCount} album(s) · /{item.slug}</p></div><span title={item.published ? "Published" : "Draft"}>{item.published ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4 text-gray-400" />}</span></div><div className="mt-3 flex gap-2"><button type="button" onClick={() => startEdit(item)} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 px-3 text-xs font-bold text-gray-600 hover:bg-gray-50"><Pencil className="h-3.5 w-3.5" /> Edit</button><button type="button" onClick={() => void remove(item)} className="grid h-8 w-8 place-items-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button></div></div></article>)}</div>}
				</section>
			</div>
		</div>
	);
}
