"use client";

import { Plus, Trash2 } from "lucide-react";
import type { GalleryItem } from "@/data/ibs/types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { EmptyState } from "../EmptyState";

interface Props {
	gallery: GalleryItem[];
	onAdd: () => void;
	onUpdate: (i: number, g: GalleryItem) => void;
	onRemove: (i: number) => void;
}

export function GallerySection({ gallery, onAdd, onUpdate, onRemove }: Props) {
	if (gallery.length === 0) return <EmptyState label="gallery items" onAdd={onAdd} />;

	return (
		<div className="space-y-3">
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{gallery.map((g, i) => (
					<div key={g.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">#{i + 1}</span>
							<button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 transition">
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						</div>
						<ImageUpload
							value={g.src}
							onChange={(url) => onUpdate(i, { ...g, src: url })}
							compact
							fit="contain"
							prefix="ibs/gallery/"
						/>
						<div className="grid gap-2">
							<input
								type="text"
								value={g.alt.en}
								onChange={(e) => onUpdate(i, { ...g, alt: { ...g.alt, en: e.target.value } })}
								placeholder="Alt EN"
								className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[var(--color-teal)]"
							/>
							<input
								type="text"
								value={g.alt.ar}
								onChange={(e) => onUpdate(i, { ...g, alt: { ...g.alt, ar: e.target.value } })}
								placeholder="Alt AR"
								dir="rtl"
								className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-[var(--color-teal)]"
							/>
						</div>
					</div>
				))}
			</div>
			<button
				onClick={onAdd}
				className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-navy)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--color-navy-dark)] transition"
			>
				<Plus className="h-3.5 w-3.5" /> Add Image
			</button>
		</div>
	);
}
