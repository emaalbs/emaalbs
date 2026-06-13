"use client";

import { Plus, Trash2, X } from "lucide-react";
import type { Initiative } from "@/data/ibs/types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { EmptyState } from "../EmptyState";

interface Props {
	initiatives: Initiative[];
	onAdd: () => void;
	onUpdate: (i: number, init: Initiative) => void;
	onRemove: (i: number) => void;
}

export function InitiativesSection({ initiatives, onAdd, onUpdate, onRemove }: Props) {
	if (initiatives.length === 0) return <EmptyState label="initiatives" onAdd={onAdd} />;

	return (
		<div className="space-y-3">
			{initiatives.map((init, i) => (
				<div key={i} className="rounded-lg border border-gray-100 bg-white p-3 space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Initiative {i + 1}</span>
						<button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 transition">
							<Trash2 className="h-3.5 w-3.5" />
						</button>
					</div>
					<div className="grid gap-2 md:grid-cols-[1fr_140px]">
						<div className="grid gap-1.5">
							<div className="grid gap-1.5 md:grid-cols-2">
								<input
									type="text"
									value={init.title.en}
									onChange={(e) => onUpdate(i, { ...init, title: { ...init.title, en: e.target.value } })}
									placeholder="Title EN"
									className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] outline-none focus:border-[var(--color-teal)]"
								/>
								<input
									type="text"
									value={init.title.ar}
									onChange={(e) => onUpdate(i, { ...init, title: { ...init.title, ar: e.target.value } })}
									placeholder="Title AR"
									dir="rtl"
									className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] outline-none focus:border-[var(--color-teal)]"
								/>
							</div>
							<div className="grid gap-1.5 md:grid-cols-2">
								<input
									type="text"
									value={init.description.en}
									onChange={(e) => onUpdate(i, { ...init, description: { ...init.description, en: e.target.value } })}
									placeholder="Description EN"
									className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] outline-none focus:border-[var(--color-teal)]"
								/>
								<input
									type="text"
									value={init.description.ar}
									onChange={(e) => onUpdate(i, { ...init, description: { ...init.description, ar: e.target.value } })}
									placeholder="Description AR"
									dir="rtl"
									className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] outline-none focus:border-[var(--color-teal)]"
								/>
							</div>
							<div className="grid gap-1.5 md:grid-cols-2">
								<input
									type="text"
									value={init.highlight?.en || ""}
									onChange={(e) => onUpdate(i, { ...init, highlight: { en: e.target.value, ar: init.highlight?.ar || "" } })}
									placeholder="Highlight EN"
									className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] outline-none focus:border-[var(--color-teal)]"
								/>
								<input
									type="text"
									value={init.highlight?.ar || ""}
									onChange={(e) => onUpdate(i, { ...init, highlight: { en: init.highlight?.en || "", ar: e.target.value } })}
									placeholder="Highlight AR"
									dir="rtl"
									className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] outline-none focus:border-[var(--color-teal)]"
								/>
							</div>
							{/* Partners as boxes */}
							<div className="flex flex-wrap items-center gap-1.5">
								{(init.partners ?? []).map((p, pi) => (
									<span key={pi} className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700">
										{p}
										<button
											onClick={() => onUpdate(i, { ...init, partners: init.partners?.filter((_, j) => j !== pi) })}
											className="text-gray-400 hover:text-red-500"
										>
											<X className="h-2.5 w-2.5" />
										</button>
									</span>
								))}
								<button
									onClick={() => {
										const name = window.prompt("Partner name:");
										if (name?.trim()) onUpdate(i, { ...init, partners: [...(init.partners || []), name.trim()] });
									}}
									className="inline-flex items-center gap-0.5 rounded border border-dashed border-gray-300 px-2 py-0.5 text-[10px] text-gray-500 hover:border-gray-400 hover:text-gray-600 transition"
								>
									<Plus className="h-2.5 w-2.5" /> Add
								</button>
							</div>
						</div>
						<div className="w-[140px] shrink-0">
							<ImageUpload
								value={init.image || ""}
								onChange={(url) => onUpdate(i, { ...init, image: url })}
								label=""
								compact
								prefix="ibs/initiatives/"
							/>
						</div>
					</div>
				</div>
			))}
			<button
				onClick={onAdd}
				className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-navy)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--color-navy-dark)] transition"
			>
				<Plus className="h-3.5 w-3.5" /> Add Initiative
			</button>
		</div>
	);
}
