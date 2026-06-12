"use client";

import { Plus, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import type { AgendaDay, AgendaItem, AgendaSpeaker } from "@/data/ibs/types";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { EmptyState } from "../EmptyState";

interface Props {
	agenda: AgendaDay[];
	onAddDay: () => void;
	onUpdateDay: (di: number, d: AgendaDay) => void;
	onRemoveDay: (di: number) => void;
	onAddItem: (di: number) => void;
	onUpdateItem: (di: number, ii: number, item: AgendaItem) => void;
	onRemoveItem: (di: number, ii: number) => void;
	onAddSpeaker: (di: number, ii: number) => void;
	onUpdateSpeaker: (di: number, ii: number, si: number, sp: AgendaSpeaker) => void;
	onRemoveSpeaker: (di: number, ii: number, si: number) => void;
}

function ItemCard({
	item,
	ii,
	di,
	onUpdate,
	onRemove,
	onAddSpeaker,
	onUpdateSpeaker,
	onRemoveSpeaker,
}: {
	item: AgendaItem;
	ii: number;
	di: number;
	onUpdate: (di: number, ii: number, item: AgendaItem) => void;
	onRemove: (di: number, ii: number) => void;
	onAddSpeaker: (di: number, ii: number) => void;
	onUpdateSpeaker: (di: number, ii: number, si: number, sp: AgendaSpeaker) => void;
	onRemoveSpeaker: (di: number, ii: number, si: number) => void;
}) {
	const [open, setOpen] = useState(true);

	return (
		<div className="rounded-md border border-gray-200 bg-white p-3 space-y-2">
			<div className="flex w-full items-center justify-between text-left">
				<button
					type="button"
					onClick={() => setOpen(!open)}
					className="flex flex-1 items-center gap-2 text-left"
				>
					<span className="text-xs font-mono text-gray-400">{item.time || "--:--"}</span>
					<span className="text-sm font-medium text-gray-700 truncate">{item.title.en || "Untitled session"}</span>
					<ChevronDown className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${open ? "" : "-rotate-90"}`} />
				</button>
				<button
					onClick={() => onRemove(di, ii)}
					className="ml-2 text-red-400 hover:text-red-600"
				>
					<Trash2 className="h-3.5 w-3.5" />
				</button>
			</div>

			{open && (
				<div className="space-y-2 pt-1">
					<input
						type="text"
						value={item.time}
						onChange={(e) => onUpdate(di, ii, { ...item, time: e.target.value })}
						placeholder="Time (e.g., 09:00 - 10:30)"
						className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs outline-none focus:border-[var(--color-teal)]"
					/>
					<div className="grid gap-2 md:grid-cols-2">
						<input
							type="text"
							value={item.title.en}
							onChange={(e) => onUpdate(di, ii, { ...item, title: { ...item.title, en: e.target.value } })}
							placeholder="Title EN"
							className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs outline-none focus:border-[var(--color-teal)]"
						/>
						<input
							type="text"
							value={item.title.ar}
							onChange={(e) => onUpdate(di, ii, { ...item, title: { ...item.title, ar: e.target.value } })}
							placeholder="Title AR"
							dir="rtl"
							className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs outline-none focus:border-[var(--color-teal)]"
						/>
					</div>
					<div className="grid gap-2 md:grid-cols-2">
						<textarea
							value={item.description?.en || ""}
							onChange={(e) => onUpdate(di, ii, { ...item, description: { en: e.target.value, ar: item.description?.ar || "" } })}
							placeholder="Description EN"
							rows={2}
							className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs outline-none focus:border-[var(--color-teal)] resize-y"
						/>
						<textarea
							value={item.description?.ar || ""}
							onChange={(e) => onUpdate(di, ii, { ...item, description: { en: item.description?.en || "", ar: e.target.value } })}
							placeholder="Description AR"
							rows={2}
							dir="rtl"
							className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs outline-none focus:border-[var(--color-teal)] resize-y"
						/>
					</div>
					<div className="grid gap-2 md:grid-cols-2">
						<input
							type="text"
							value={item.note?.en || ""}
							onChange={(e) => onUpdate(di, ii, { ...item, note: { en: e.target.value, ar: item.note?.ar || "" } })}
							placeholder="Note EN (optional)"
							className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs outline-none focus:border-[var(--color-teal)]"
						/>
						<input
							type="text"
							value={item.note?.ar || ""}
							onChange={(e) => onUpdate(di, ii, { ...item, note: { en: item.note?.en || "", ar: e.target.value } })}
							placeholder="Note AR (optional)"
							dir="rtl"
							className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs outline-none focus:border-[var(--color-teal)]"
						/>
					</div>

					{/* Speakers */}
					<div className="space-y-1 pt-1">
						<div className="flex items-center justify-between">
							<span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Speakers</span>
							<button
								onClick={() => onAddSpeaker(di, ii)}
								className="inline-flex items-center gap-1 rounded bg-[var(--color-navy)] px-2 py-0.5 text-[10px] font-semibold text-white"
							>
								<Plus className="h-3 w-3" /> Add
							</button>
						</div>
						{(item.speakers ?? []).map((sp, si) => (
							<div key={sp.id} className="flex items-start gap-2 rounded border border-gray-100 bg-gray-50/50 p-2">
								<div className="w-14 shrink-0">
									<ImageUpload
										value={sp.photo || ""}
										onChange={(url) => onUpdateSpeaker(di, ii, si, { ...sp, photo: url })}
										label=""
										compact
										prefix="ibs/agenda/"
									/>
								</div>
								<div className="grid flex-1 gap-1.5 md:grid-cols-2">
									<input
										type="text"
										value={sp.name.en}
										onChange={(e) => onUpdateSpeaker(di, ii, si, { ...sp, name: { ...sp.name, en: e.target.value } })}
										placeholder="Name EN"
										className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] outline-none focus:border-[var(--color-teal)]"
									/>
									<input
										type="text"
										value={sp.name.ar}
										onChange={(e) => onUpdateSpeaker(di, ii, si, { ...sp, name: { ...sp.name, ar: e.target.value } })}
										placeholder="Name AR"
										dir="rtl"
										className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] outline-none focus:border-[var(--color-teal)]"
									/>
									<input
										type="text"
										value={sp.org?.en || ""}
										onChange={(e) => onUpdateSpeaker(di, ii, si, { ...sp, org: { en: e.target.value, ar: sp.org?.ar || "" } })}
										placeholder="Org EN"
										className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] outline-none focus:border-[var(--color-teal)]"
									/>
									<input
										type="text"
										value={sp.org?.ar || ""}
										onChange={(e) => onUpdateSpeaker(di, ii, si, { ...sp, org: { en: sp.org?.en || "", ar: e.target.value } })}
										placeholder="Org AR"
										dir="rtl"
										className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-[11px] outline-none focus:border-[var(--color-teal)]"
									/>
								</div>
								<button
									onClick={() => onRemoveSpeaker(di, ii, si)}
									className="mt-1 text-red-400 hover:text-red-600"
								>
									<Trash2 className="h-3 w-3" />
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export function AgendaSection({
	agenda,
	onAddDay,
	onUpdateDay,
	onRemoveDay,
	onAddItem,
	onUpdateItem,
	onRemoveItem,
	onAddSpeaker,
	onUpdateSpeaker,
	onRemoveSpeaker,
}: Props) {
	const days = agenda ?? [];
	if (days.length === 0) return <EmptyState label="agenda days" onAdd={onAddDay} />;

	return (
		<div className="space-y-4">
			{days.map((day, di) => (
				<div key={di} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-navy)] text-[10px] font-bold text-white">
								{di + 1}
							</span>
							<div className="grid gap-1 md:grid-cols-2">
								<input
									type="text"
									value={day.dateLabel.en}
									onChange={(e) => onUpdateDay(di, { ...day, dateLabel: { ...day.dateLabel, en: e.target.value } })}
									placeholder="Date label EN"
									className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs outline-none focus:border-[var(--color-teal)]"
								/>
								<input
									type="text"
									value={day.dateLabel.ar}
									onChange={(e) => onUpdateDay(di, { ...day, dateLabel: { ...day.dateLabel, ar: e.target.value } })}
									placeholder="Date label AR"
									dir="rtl"
									className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs outline-none focus:border-[var(--color-teal)]"
								/>
							</div>
						</div>
						<button onClick={() => onRemoveDay(di)} className="text-red-400 hover:text-red-600 transition">
							<Trash2 className="h-4 w-4" />
						</button>
					</div>

					<div className="space-y-2">
						{day.items.map((item, ii) => (
							<ItemCard
								key={ii}
								item={item}
								ii={ii}
								di={di}
								onUpdate={onUpdateItem}
								onRemove={onRemoveItem}
								onAddSpeaker={onAddSpeaker}
								onUpdateSpeaker={onUpdateSpeaker}
								onRemoveSpeaker={onRemoveSpeaker}
							/>
						))}
					</div>

					<button
						onClick={() => onAddItem(di)}
						className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-500 hover:border-gray-400 hover:text-gray-600 transition"
					>
						<Plus className="h-3.5 w-3.5" /> Add Session
					</button>
				</div>
			))}
			<button
				onClick={onAddDay}
				className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-navy)] px-3 py-2 text-xs font-semibold text-white hover:bg-[var(--color-navy-dark)] transition"
			>
				<Plus className="h-3.5 w-3.5" /> Add Day
			</button>
		</div>
	);
}
