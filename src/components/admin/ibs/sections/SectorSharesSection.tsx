"use client";

import { Plus, Trash2 } from "lucide-react";
import type { SectorShare } from "@/data/ibs/types";
import { EmptyState } from "../EmptyState";

interface Props {
	sectorShares: SectorShare[];
	onAdd: () => void;
	onUpdate: (i: number, s: SectorShare) => void;
	onRemove: (i: number) => void;
}

export function SectorSharesSection({ sectorShares, onAdd, onUpdate, onRemove }: Props) {
	if (sectorShares.length === 0) return <EmptyState label="sector shares" onAdd={onAdd} />;

	return (
		<div className="space-y-3">
			{sectorShares.map((s, i) => (
				<div key={i} className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
					<div className="flex-1 grid gap-3 md:grid-cols-3">
						<input
							type="text"
							value={s.sector.en}
							onChange={(e) => onUpdate(i, { ...s, sector: { ...s.sector, en: e.target.value } })}
							placeholder="Sector EN"
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)]"
						/>
						<input
							type="text"
							value={s.sector.ar}
							onChange={(e) => onUpdate(i, { ...s, sector: { ...s.sector, ar: e.target.value } })}
							placeholder="Sector AR"
							dir="rtl"
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)]"
						/>
						<div className="flex items-center gap-2">
							<input
								type="number"
								min={0}
								max={100}
								value={s.percent}
								onChange={(e) => onUpdate(i, { ...s, percent: Number(e.target.value) })}
								placeholder="Percent"
								className="w-24 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)]"
							/>
							<span className="text-sm text-gray-400">%</span>
						</div>
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
				<Plus className="h-3.5 w-3.5" /> Add Sector
			</button>
		</div>
	);
}
