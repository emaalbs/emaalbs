"use client";

import { Plus } from "lucide-react";

interface Props {
	label: string;
	onAdd: () => void;
}

export function EmptyState({ label, onAdd }: Props) {
	return (
		<div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 py-10 text-center">
			<p className="text-sm text-gray-400">No {label} yet.</p>
			<button
				onClick={onAdd}
				className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-navy)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--color-navy-dark)] transition"
			>
				<Plus className="h-3.5 w-3.5" /> Add {label}
			</button>
		</div>
	);
}
