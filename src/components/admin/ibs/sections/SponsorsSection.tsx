"use client";

import { Plus, Trash2 } from "lucide-react";
import type { Sponsor, SponsorTier } from "@/data/ibs/types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { EmptyState } from "../EmptyState";

const TIERS: SponsorTier[] = ["strategic", "platinum", "gold", "silver", "supporting"];

interface Props {
	sponsors: Sponsor[];
	onAdd: () => void;
	onUpdate: (i: number, s: Sponsor) => void;
	onRemove: (i: number) => void;
}

export function SponsorsSection({ sponsors, onAdd, onUpdate, onRemove }: Props) {
	if (sponsors.length === 0) return <EmptyState label="sponsors" onAdd={onAdd} />;

	return (
		<div className="space-y-3">
			{sponsors.map((s, i) => (
				<div key={s.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4 space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-gray-400">Sponsor {i + 1}</span>
						<button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 transition">
							<Trash2 className="h-4 w-4" />
						</button>
					</div>
					<div className="grid gap-3 md:grid-cols-3">
						<input
							type="text"
							value={s.name}
							onChange={(e) => onUpdate(i, { ...s, name: e.target.value })}
							placeholder="Name"
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)]"
						/>
						<select
							value={s.tier}
							onChange={(e) => onUpdate(i, { ...s, tier: e.target.value as SponsorTier })}
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)]"
						>
							{TIERS.map((t) => (
								<option key={t} value={t} className="capitalize">
									{t.charAt(0).toUpperCase() + t.slice(1)}
								</option>
							))}
						</select>
						<input
							type="url"
							value={s.href || ""}
							onChange={(e) => onUpdate(i, { ...s, href: e.target.value })}
							placeholder="Website URL"
							className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--color-teal)]"
						/>
					</div>
					<div className="max-w-[200px]">
						<ImageUpload
							value={s.logo || ""}
							onChange={(url) => onUpdate(i, { ...s, logo: url })}
							label="Logo"
							compact
							prefix="ibs/sponsors/"
						/>
					</div>
				</div>
			))}
			<button
				onClick={onAdd}
				className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-navy)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--color-navy-dark)] transition"
			>
				<Plus className="h-3.5 w-3.5" /> Add Sponsor
			</button>
		</div>
	);
}
