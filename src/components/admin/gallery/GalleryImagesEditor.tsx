"use client";

import { useRef, useState } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, ImagePlus, LoaderCircle, Ruler, Star, Trash2 } from "lucide-react";
import { GALLERY_MAX_IMAGES, type GalleryImage, type GalleryImageInput } from "@/data/gallery";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { optimizeImage } from "@/lib/image-optimizer";
import { sha256Hex } from "@/lib/content-hash";

type Props = {
	albumId: number | null;
	images: GalleryImageInput[];
	coverImageUrl: string;
	onChange: (images: GalleryImageInput[]) => void;
	onCoverChange: (url: string) => void;
};

function blankImage(imageUrl: string, contentHash: string, sortOrder: number): GalleryImageInput {
	return {
		imageUrl,
		contentHash,
		title: { en: "", ar: "" },
		description: { en: "", ar: "" },
		alt: { en: "", ar: "" },
		sortOrder,
	};
}

export function GalleryImagesEditor({ albumId, images, coverImageUrl, onChange, onCoverChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState("");
	const [duplicateNames, setDuplicateNames] = useState<string[]>([]);
	const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
	const [deleting, setDeleting] = useState(false);
	const [savedUploadCount, setSavedUploadCount] = useState(0);

	function updateImage(index: number, image: GalleryImageInput) {
		onChange(images.map((current, currentIndex) => currentIndex === index ? image : current));
	}

	function move(index: number, direction: -1 | 1) {
		const nextIndex = index + direction;
		if (nextIndex < 0 || nextIndex >= images.length) return;
		const next = [...images];
		[next[index], next[nextIndex]] = [next[nextIndex], next[index]];
		onChange(next.map((image, order) => ({ ...image, sortOrder: order })));
	}

	async function uploadFiles(files: FileList) {
		if (!albumId) {
			setError("Save the album details first, then upload images.");
			return;
		}
		const selected = Array.from(files).slice(0, Math.max(0, GALLERY_MAX_IMAGES - images.length));
		if (!selected.length) return;
		setUploading(true);
		setProgress(0);
		setError("");
		setDuplicateNames([]);
		setSavedUploadCount(0);
		const uploaded: GalleryImageInput[] = [];
		const knownHashes = new Set(images.map((image) => image.contentHash).filter(Boolean));
		const duplicates: string[] = [];
		try {
			for (let index = 0; index < selected.length; index += 1) {
				const file = selected[index];
				const optimized = await optimizeImage(file, "gallery");
				const contentHash = await sha256Hex(optimized.blob);
				if (knownHashes.has(contentHash)) {
					duplicates.push(file.name);
					setProgress(index + 1);
					continue;
				}
				const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-");
				const formData = new FormData();
				formData.append("file", optimized.blob, `${baseName}.${optimized.extension}`);
				formData.append("prefix", "gallery/albums/");
				formData.append("contentHash", contentHash);
				formData.append("preventGalleryDuplicate", "1");
				formData.append("galleryAlbumId", String(albumId));
				formData.append("sortOrder", String(images.length + uploaded.length));
				const response = await fetch("/api/media/upload", { method: "POST", body: formData });
				const data = (await response.json()) as { url?: string; error?: string; duplicate?: boolean; galleryImage?: GalleryImage };
				if (response.status === 409 && data.duplicate) {
					duplicates.push(file.name);
					knownHashes.add(contentHash);
					setProgress(index + 1);
					continue;
				}
				if (!response.ok || !data.url) throw new Error(data.error || `Failed to upload ${file.name}`);
				uploaded.push(data.galleryImage || blankImage(data.url, contentHash, images.length + uploaded.length));
				knownHashes.add(contentHash);
				setProgress(index + 1);
			}
			onChange([...images, ...uploaded]);
			setSavedUploadCount(uploaded.length);
			if (!coverImageUrl && uploaded[0]) onCoverChange(uploaded[0].imageUrl);
		} catch (uploadError) {
			if (uploaded.length) onChange([...images, ...uploaded]);
			setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
		} finally {
			setDuplicateNames(duplicates);
			setUploading(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	}

	function toggleSelection(imageUrl: string) {
		setSelectedUrls((current) => {
			const next = new Set(current);
			if (next.has(imageUrl)) next.delete(imageUrl);
			else next.add(imageUrl);
			return next;
		});
	}

	function toggleAll() {
		const allSelected = images.length > 0 && images.every((image) => selectedUrls.has(image.imageUrl));
		setSelectedUrls(allSelected ? new Set() : new Set(images.map((image) => image.imageUrl)));
	}

	async function deleteImages(imageUrls: string[]) {
		const targets = images.filter((image) => imageUrls.includes(image.imageUrl));
		if (!targets.length) return;
		const message = targets.length === 1
			? "Permanently delete this image from the album and Cloudflare storage?"
			: `Permanently delete ${targets.length} selected images from the album and Cloudflare storage?`;
		if (!confirm(message)) return;

		setDeleting(true);
		setError("");
		setSavedUploadCount(0);
		try {
			const persistedIds = targets.flatMap((image) => image.id ? [image.id] : []);
			if (albumId && persistedIds.length) {
				const response = await fetch(`/api/gallery/albums/${albumId}/images`, {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ ids: persistedIds }),
				});
				const data = (await response.json()) as { error?: string };
				if (!response.ok) throw new Error(data.error || "Failed to delete selected images");
			}
			const removed = new Set(targets.map((image) => image.imageUrl));
			const remaining = images.filter((image) => !removed.has(image.imageUrl)).map((image, sortOrder) => ({ ...image, sortOrder }));
			onChange(remaining);
			if (removed.has(coverImageUrl)) onCoverChange(remaining[0]?.imageUrl || "");
			setSelectedUrls(new Set());
		} catch (deleteError) {
			setError(deleteError instanceof Error ? deleteError.message : "Failed to delete selected images");
		} finally {
			setDeleting(false);
		}
	}

	return (
		<div className="space-y-5">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<p className="text-sm font-semibold text-gray-700">Add album images</p>
				<span className="inline-flex items-center gap-1.5 rounded-full border border-[#007F84]/15 bg-[#007F84]/[0.07] px-2.5 py-1 text-[11px] font-semibold text-[#006C71]">
					<Ruler className="h-3 w-3" /> Recommended 1200 × 900 px
				</span>
			</div>
			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				disabled={uploading || deleting || !albumId || images.length >= GALLERY_MAX_IMAGES}
				className="flex min-h-36 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 text-center text-gray-500 transition duration-300 hover:border-[#007F84] hover:bg-[#007F84]/5 hover:text-[#01334D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007F84] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
			>
				{uploading ? <LoaderCircle className="h-8 w-8 animate-spin motion-reduce:animate-none" /> : <ImagePlus className="h-8 w-8" />}
				<span className="text-sm font-bold">{uploading ? `Checking and uploading ${progress}/${Math.min(GALLERY_MAX_IMAGES - images.length, inputRef.current?.files?.length || 0)}` : "Upload one image or select multiple images"}</span>
				<span className="text-xs text-gray-400">{albumId ? <>Images are optimized, checked, and saved automatically. Maximum {GALLERY_MAX_IMAGES} images per album.</> : "Save the album details first to enable image uploads."}</span>
			</button>
			<input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => event.target.files && void uploadFiles(event.target.files)} />
			{error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
			{savedUploadCount ? <p className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {savedUploadCount} image(s) uploaded and saved to the album.</p> : null}
			{duplicateNames.length ? (
				<div role="alert" className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
					<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
					<div><p className="font-bold" dir="rtl">هذه الصورة موجودة مسبقًا في المعرض ولم يتم رفع نسخة مكررة.</p><p className="mt-1 break-all text-xs text-amber-700">{duplicateNames.join(", ")}</p></div>
				</div>
			) : null}

			{images.length ? (
				<div className="sticky top-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
					<label className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-semibold text-gray-700">
						<input type="checkbox" checked={images.every((image) => selectedUrls.has(image.imageUrl))} onChange={toggleAll} className="h-4 w-4 accent-[#007F84]" />
						Select all ({images.length})
					</label>
					<div className="flex items-center gap-3"><span className="text-xs font-semibold text-gray-500">{selectedUrls.size} selected</span><button type="button" onClick={() => void deleteImages([...selectedUrls])} disabled={!selectedUrls.size || deleting || uploading} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition duration-200 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none">{deleting ? <LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" /> : <Trash2 className="h-4 w-4" />} Delete selected</button></div>
				</div>
			) : null}

			<div className="space-y-4">
				{images.map((image, index) => (
					<details key={image.id || `${image.imageUrl}-${index}`} open={images.length <= 2} className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition duration-200 motion-reduce:transition-none ${selectedUrls.has(image.imageUrl) ? "border-[#007F84] ring-2 ring-[#007F84]/15" : "border-gray-200"}`}>
						<summary className="flex cursor-pointer list-none items-center gap-4 p-4 marker:hidden">
							<label onClick={(event) => event.stopPropagation()} className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center rounded-xl border border-gray-200 bg-gray-50" aria-label={`Select image ${index + 1}`}><input type="checkbox" checked={selectedUrls.has(image.imageUrl)} onChange={() => toggleSelection(image.imageUrl)} className="h-4 w-4 accent-[#007F84]" /></label>
							<img src={image.imageUrl} alt="" className="h-16 w-20 shrink-0 rounded-xl bg-gray-100 object-cover" />
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<span className="text-xs font-bold uppercase tracking-wider text-[#007F84]">Image {index + 1}</span>
									{coverImageUrl === image.imageUrl ? <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700"><Star className="h-3 w-3 fill-current" /> Cover</span> : null}
								</div>
								<p className="mt-1 truncate text-sm font-semibold text-gray-800">{image.title.en || image.title.ar || "Add image title and details"}</p>
							</div>
							<span className="text-xs font-semibold text-gray-400 group-open:hidden">Edit details</span>
						</summary>
						<div className="border-t border-gray-100 p-4 sm:p-5">
							<div className="grid gap-5 lg:grid-cols-[240px_1fr]">
								<div className="space-y-3">
									<ImageUpload value={image.imageUrl} onChange={(url) => updateImage(index, { ...image, imageUrl: url })} onContentHashChange={(contentHash) => updateImage(index, { ...image, contentHash })} duplicateHashes={images.filter((_, currentIndex) => currentIndex !== index).map((item) => item.contentHash).filter(Boolean)} preventGalleryDuplicate label={null} compact preset="gallery" prefix="gallery/albums/" />
									<button type="button" onClick={() => onCoverChange(image.imageUrl)} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 text-xs font-bold text-amber-800 transition hover:bg-amber-100">
										<Star className="h-3.5 w-3.5" /> Use as album cover
									</button>
									<div className="flex gap-2">
										<button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="grid h-9 flex-1 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30" aria-label="Move image up"><ArrowUp className="h-4 w-4" /></button>
										<button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} className="grid h-9 flex-1 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30" aria-label="Move image down"><ArrowDown className="h-4 w-4" /></button>
										<button type="button" onClick={() => void deleteImages([image.imageUrl])} disabled={deleting || uploading} className="grid h-9 flex-1 place-items-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50 disabled:opacity-40" aria-label="Delete image permanently"><Trash2 className="h-4 w-4" /></button>
									</div>
								</div>
								<div className="space-y-5">
									<BilingualField label="Image title" enValue={image.title.en} arValue={image.title.ar} onEnChange={(value) => updateImage(index, { ...image, title: { ...image.title, en: value } })} onArChange={(value) => updateImage(index, { ...image, title: { ...image.title, ar: value } })} />
									<BilingualField label="Image description" multiline rows={3} enValue={image.description.en} arValue={image.description.ar} onEnChange={(value) => updateImage(index, { ...image, description: { ...image.description, en: value } })} onArChange={(value) => updateImage(index, { ...image, description: { ...image.description, ar: value } })} />
									<div>
										<label className="text-sm font-medium text-gray-700">Alternative text <span className="text-xs font-normal text-gray-400">— accessibility and SEO</span></label>
										<div className="mt-2 grid gap-3 md:grid-cols-2">
											<input value={image.alt.en} onChange={(event) => updateImage(index, { ...image, alt: { ...image.alt, en: event.target.value } })} placeholder="English alt text" className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007F84]" />
											<input dir="rtl" value={image.alt.ar} onChange={(event) => updateImage(index, { ...image, alt: { ...image.alt, ar: event.target.value } })} placeholder="النص البديل بالعربية" className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#007F84]" />
										</div>
									</div>
								</div>
							</div>
						</div>
					</details>
				))}
			</div>
		</div>
	);
}
