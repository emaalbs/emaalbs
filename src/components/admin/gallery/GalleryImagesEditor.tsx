"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, LoaderCircle, Star, Trash2 } from "lucide-react";
import type { GalleryImageInput } from "@/data/gallery";
import { BilingualField } from "@/components/admin/BilingualField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { optimizeImage } from "@/lib/image-optimizer";

type Props = {
	images: GalleryImageInput[];
	coverImageUrl: string;
	onChange: (images: GalleryImageInput[]) => void;
	onCoverChange: (url: string) => void;
};

function blankImage(imageUrl: string, sortOrder: number): GalleryImageInput {
	return {
		imageUrl,
		title: { en: "", ar: "" },
		description: { en: "", ar: "" },
		alt: { en: "", ar: "" },
		sortOrder,
	};
}

export function GalleryImagesEditor({ images, coverImageUrl, onChange, onCoverChange }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState("");

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
		const selected = Array.from(files).slice(0, Math.max(0, 100 - images.length));
		if (!selected.length) return;
		setUploading(true);
		setProgress(0);
		setError("");
		const uploaded: GalleryImageInput[] = [];
		try {
			for (let index = 0; index < selected.length; index += 1) {
				const file = selected[index];
				const optimized = await optimizeImage(file, "gallery");
				const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-");
				const formData = new FormData();
				formData.append("file", optimized.blob, `${baseName}.${optimized.extension}`);
				formData.append("prefix", "gallery/albums/");
				const response = await fetch("/api/media/upload", { method: "POST", body: formData });
				const data = (await response.json()) as { url?: string; error?: string };
				if (!response.ok || !data.url) throw new Error(data.error || `Failed to upload ${file.name}`);
				uploaded.push(blankImage(data.url, images.length + uploaded.length));
				setProgress(index + 1);
			}
			onChange([...images, ...uploaded]);
			if (!coverImageUrl && uploaded[0]) onCoverChange(uploaded[0].imageUrl);
		} catch (uploadError) {
			if (uploaded.length) onChange([...images, ...uploaded]);
			setError(uploadError instanceof Error ? uploadError.message : "Image upload failed");
		} finally {
			setUploading(false);
			if (inputRef.current) inputRef.current.value = "";
		}
	}

	return (
		<div className="space-y-5">
			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				disabled={uploading || images.length >= 100}
				className="flex min-h-36 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 text-center text-gray-500 transition duration-300 hover:border-[#007F84] hover:bg-[#007F84]/5 hover:text-[#01334D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007F84] disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none"
			>
				{uploading ? <LoaderCircle className="h-8 w-8 animate-spin motion-reduce:animate-none" /> : <ImagePlus className="h-8 w-8" />}
				<span className="text-sm font-bold">{uploading ? `Optimizing and uploading ${progress}/${Math.min(100 - images.length, inputRef.current?.files?.length || 0)}` : "Upload one image or select multiple images"}</span>
				<span className="text-xs text-gray-400">Images are optimized automatically. Maximum 100 images per album.</span>
			</button>
			<input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => event.target.files && void uploadFiles(event.target.files)} />
			{error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

			<div className="space-y-4">
				{images.map((image, index) => (
					<details key={image.id || `${image.imageUrl}-${index}`} open={images.length <= 2} className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
						<summary className="flex cursor-pointer list-none items-center gap-4 p-4 marker:hidden">
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
									<ImageUpload value={image.imageUrl} onChange={(url) => updateImage(index, { ...image, imageUrl: url })} label={null} compact preset="gallery" prefix="gallery/albums/" />
									<button type="button" onClick={() => onCoverChange(image.imageUrl)} className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-amber-200 bg-amber-50 text-xs font-bold text-amber-800 transition hover:bg-amber-100">
										<Star className="h-3.5 w-3.5" /> Use as album cover
									</button>
									<div className="flex gap-2">
										<button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="grid h-9 flex-1 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30" aria-label="Move image up"><ArrowUp className="h-4 w-4" /></button>
										<button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} className="grid h-9 flex-1 place-items-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30" aria-label="Move image down"><ArrowDown className="h-4 w-4" /></button>
										<button type="button" onClick={() => onChange(images.filter((_, currentIndex) => currentIndex !== index).map((item, order) => ({ ...item, sortOrder: order })))} className="grid h-9 flex-1 place-items-center rounded-lg border border-red-100 text-red-600 hover:bg-red-50" aria-label="Remove image"><Trash2 className="h-4 w-4" /></button>
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
