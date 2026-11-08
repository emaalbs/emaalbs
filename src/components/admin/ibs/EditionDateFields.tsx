"use client";

import { useState } from "react";
import type { Localized } from "@/data/ibs/types";
import { dateLabel, isoDay, labelDay, readEditionDates, writeEditionDates } from "@/lib/edition-dates";

const field = "mt-1 block min-h-11 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-900 focus:border-[var(--color-teal)]";
export function EditionDateFields({ dates, error, onChange }: { dates: Localized; error?: string; onChange: (v: Localized) => void }) {
	const { primary, extra } = readEditionDates(dates);
	const [message, setMessage] = useState("");
	const [adding, setAdding] = useState(false);
	const [pending, setPending] = useState("");
	const first = labelDay(primary.en) || isoDay(primary.ar);
	function update(p: Localized, days: string[]) {
		setMessage("");
		onChange(writeEditionDates(p, days));
	}
	function pick(day: string, index: number) {
		if (!isoDay(day)) return;
		if ((index !== -1 && first === day) || extra.some((v, i) => v === day && i !== index)) {
			setMessage("This date is already listed. هذا التاريخ مضاف مسبقاً."); return;
		}
		if (index === -1) update(dateLabel(day), extra);
		else if (index === extra.length) { update(primary, [...extra, day]); setAdding(false); setPending(""); }
		else update(primary, extra.map((v,i) => i === index ? day : v));
	}
	return <fieldset className="space-y-3 rounded-lg border border-gray-200 p-4">
		<legend className="px-2 text-sm font-semibold">Edition dates / تواريخ القمة</legend>
		<label className="block text-sm font-medium">Start Date
			<input className={field} type="date" value={first} onChange={e => pick(e.target.value, -1)} />
		</label>
		<div className="grid gap-3 md:grid-cols-2">
			{(["en", "ar"] as const).map(lang => <label key={lang} className="block text-sm font-medium">
				Display Date ({lang.toUpperCase()})
				<input className={field} dir={lang === "ar" ? "rtl" : "ltr"} lang={lang} value={primary[lang]}
					onChange={e => update({ ...primary, [lang]: e.target.value }, extra)} />
			</label>)}
		</div>
		{extra.map((day, i) => <div key={i} className="flex flex-wrap items-end gap-2">
			<label className="min-w-0 flex-1 text-sm">Additional date {i + 1}
				<input className={field} type="date" value={day} onChange={e => pick(e.target.value, i)} />
			</label>
			<button type="button" className="min-h-11 rounded-lg px-3 text-sm text-red-700 hover:bg-red-50" aria-label={`Remove date ${day}`}
				onClick={() => update(primary, extra.filter((_, n) => n !== i))}>Remove</button>
		</div>)}
		{adding ? <div className="flex flex-wrap items-end gap-2">
			<label className="min-w-0 flex-1 text-sm">Choose another date / اختر تاريخاً آخر
				<input autoFocus className={field} type="date" value={pending} onChange={e => { setPending(e.target.value); setMessage(""); }} />
			</label>
			<button type="button" className="min-h-11 rounded-lg border px-3 text-sm font-semibold disabled:opacity-50" disabled={!isoDay(pending)}
				onClick={() => pick(pending, extra.length)}>Add / إضافة</button>
			<button type="button" className="min-h-11 px-3 text-sm" onClick={() => { setAdding(false); setPending(""); setMessage(""); }}>Cancel</button>
		</div> : <button type="button" className="min-h-11 rounded-lg border border-gray-200 px-3 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
			disabled={!primary.en.trim() || !primary.ar.trim()} onClick={() => setAdding(true)}>+ Add date / إضافة تاريخ</button>}
		{(message || error) && <p role="alert" className="text-sm text-red-700">{message || error}</p>}
		{extra.length > 0 && <div className="space-y-1 text-sm text-gray-600" aria-label="Website preview">
			<p lang="en" dir="ltr">{dates.en}</p><p lang="ar" dir="rtl">{dates.ar}</p>
		</div>}
	</fieldset>;
}
