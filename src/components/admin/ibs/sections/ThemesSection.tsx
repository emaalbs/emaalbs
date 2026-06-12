"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Theme } from "@/data/ibs/types";
import { EmptyState } from "../EmptyState";

interface Props {
	themes: Theme[];
	onAdd: () => void;
	onUpdate: (i: number, t: Theme) => void;
	onRemove: (i: number) => void;
}

export function ThemesSection({ themes, onAdd, onUpdate, onRemove }: Props) {
	if (themes.length === 0) return <EmptyState label="themes" onAdd={onAdd} />;

	return (
		<div className="space-y-3">
			{themes.map((t, i) => (
				<div key={i} className="rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-gray-400">Theme {i + 1}</span>
						<button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 transition">
							<Trash2 className="h-4 w-4" />
						</button>
					</div>
					<div className="grid gap-3 md:grid-cols-2">
						<input
							type="text"
							value={t.title.en}
							onChange={(e) => onUpdate(i, { ...t, title: { ...t.title, en: e.target.value } })}
							placeholder="Title EN"
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)]"
						/>
						<input
							type="text"
							value={t.title.ar}
							onChange={(e) => onUpdate(i, { ...t, title: { ...t.title, ar: e.target.value } })}
							placeholder="Title AR"
							dir="rtl"
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)]"
						/>
					</div>
					<div className="grid gap-3 md:grid-cols-2">
						<textarea
							value={t.description.en}
							onChange={(e) => onUpdate(i, { ...t, description: { ...t.description, en: e.target.value } })}
							placeholder="Description EN"
							rows={2}
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)] resize-y"
						/>
						<textarea
							value={t.description.ar}
							onChange={(e) => onUpdate(i, { ...t, description: { ...t.description, ar: e.target.value } })}
							placeholder="Description AR"
							rows={2}
							dir="rtl"
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)] resize-y"
						/>
					</div>
				</div>
			))}
			<button
				onClick={onAdd}
				className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-navy)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--color-navy-dark)] transition"
			>
				<Plus className="h-3.5 w-3.5" /> Add Theme
			</button>
		</div>
	);
}
