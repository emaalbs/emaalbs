"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Stat } from "@/data/ibs/types";
import { EmptyState } from "../EmptyState";

interface Props {
	stats: Stat[];
	onAdd: () => void;
	onUpdate: (i: number, s: Stat) => void;
	onRemove: (i: number) => void;
}

export function StatsSection({ stats, onAdd, onUpdate, onRemove }: Props) {
	if (stats.length === 0) return <EmptyState label="stats" onAdd={onAdd} />;

	return (
		<div className="space-y-3">
			{stats.map((s, i) => (
				<div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
					<div className="flex-1 grid gap-3 md:grid-cols-3">
						<input
							type="text"
							value={s.value}
							onChange={(e) => onUpdate(i, { ...s, value: e.target.value })}
							placeholder="Value (e.g., 500+)"
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)]"
						/>
						<input
							type="text"
							value={s.label.en}
							onChange={(e) => onUpdate(i, { ...s, label: { ...s.label, en: e.target.value } })}
							placeholder="Label EN"
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)]"
						/>
						<input
							type="text"
							value={s.label.ar}
							onChange={(e) => onUpdate(i, { ...s, label: { ...s.label, ar: e.target.value } })}
							placeholder="Label AR"
							dir="rtl"
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)]"
						/>
					</div>
					<button onClick={() => onRemove(i)} className="mt-1 text-red-400 hover:text-red-600 transition">
						<Trash2 className="h-4 w-4" />
					</button>
				</div>
			))}
			<button
				onClick={onAdd}
				className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-navy)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--color-navy-dark)] transition"
			>
				<Plus className="h-3.5 w-3.5" /> Add Stat
			</button>
		</div>
	);
}
