"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Speaker } from "@/data/ibs/types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { EmptyState } from "../EmptyState";

interface Props {
	speakers: Speaker[];
	onAdd: () => void;
	onUpdate: (i: number, s: Speaker) => void;
	onRemove: (i: number) => void;
}

export function SpeakersSection({ speakers, onAdd, onUpdate, onRemove }: Props) {
	if (speakers.length === 0) return <EmptyState label="speakers" onAdd={onAdd} />;

	return (
		<div className="space-y-3">
			{speakers.map((s, i) => (
				<div key={s.id} className="rounded-lg border border-gray-100 bg-white p-2.5 space-y-1.5">
					<div className="flex items-center justify-between">
						<span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Speaker {i + 1}</span>
						<button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 transition">
							<Trash2 className="h-3 w-3" />
						</button>
					</div>
					<div className="flex gap-2">
						<div className="grid flex-1 gap-1.5">
							<div className="grid gap-1.5 md:grid-cols-2">
								<input
									type="text"
									value={s.name.en}
									onChange={(e) => onUpdate(i, { ...s, name: { ...s.name, en: e.target.value } })}
									placeholder="Name EN"
									className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] leading-tight outline-none focus:border-[var(--color-teal)]"
								/>
								<input
									type="text"
									value={s.name.ar}
									onChange={(e) => onUpdate(i, { ...s, name: { ...s.name, ar: e.target.value } })}
									placeholder="Name AR"
									dir="rtl"
									className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] leading-tight outline-none focus:border-[var(--color-teal)]"
								/>
							</div>
							<div className="grid gap-1.5 md:grid-cols-4">
								<input
									type="text"
									value={s.title.en}
									onChange={(e) => onUpdate(i, { ...s, title: { ...s.title, en: e.target.value } })}
									placeholder="Title EN"
									className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] leading-tight outline-none focus:border-[var(--color-teal)]"
								/>
								<input
									type="text"
									value={s.title.ar}
									onChange={(e) => onUpdate(i, { ...s, title: { ...s.title, ar: e.target.value } })}
									placeholder="Title AR"
									dir="rtl"
									className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] leading-tight outline-none focus:border-[var(--color-teal)]"
								/>
								<input
									type="text"
									value={s.org?.en || ""}
									onChange={(e) => onUpdate(i, { ...s, org: { en: e.target.value, ar: s.org?.ar || "" } })}
									placeholder="Org EN"
									className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] leading-tight outline-none focus:border-[var(--color-teal)]"
								/>
								<input
									type="text"
									value={s.org?.ar || ""}
									onChange={(e) => onUpdate(i, { ...s, org: { en: s.org?.en || "", ar: e.target.value } })}
									placeholder="Org AR"
									dir="rtl"
									className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] leading-tight outline-none focus:border-[var(--color-teal)]"
								/>
							</div>
						</div>
						<div className="w-20 shrink-0">
							<ImageUpload
								value={s.photo || ""}
								onChange={(url) => onUpdate(i, { ...s, photo: url })}
								label=""
								compact
								prefix="ibs/speakers/"
							/>
						</div>
					</div>
				</div>
			))}
			<button
				onClick={onAdd}
				className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-navy)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--color-navy-dark)] transition"
			>
				<Plus className="h-3.5 w-3.5" /> Add Speaker
			</button>
		</div>
	);
}
