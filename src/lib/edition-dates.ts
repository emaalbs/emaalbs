import type { Localized } from "@/data/ibs/types";

// Both D1 columns remain readable labels (including when copied into a receipt).
// Only canonical, paired suffixes are editable as added days; legacy free text
// and ranges are kept verbatim as the primary label.
const separator = " · ";
const months = "January February March April May June July August September October November December".split(" ");
export function isoDay(value: string) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return "";
	const d = new Date(value + "T12:00:00Z");
	return Number.isFinite(+d) && d.toISOString().slice(0, 10) === value ? value : "";
}
export function dateLabel(day: string): Localized {
	if (!isoDay(day)) throw new Error("Invalid calendar day");
	const d = new Date(day + "T12:00:00Z");
	return {
		en: `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${day.slice(0, 4)}`,
		ar: d.toLocaleDateString("ar-IQ", { day: "numeric", month: "long", year: "numeric", calendar: "gregory", timeZone: "UTC" }),
	};
}
export function labelDay(text: string) {
	if (isoDay(text)) return text;
	const m = /^(\w+) (\d{1,2}), (\d{4})$/.exec(text);
	if (!m) return "";
	const month = months.indexOf(m[1]) + 1;
	return isoDay(`${m[3]}-${String(month).padStart(2, "0")}-${m[2].padStart(2, "0")}`);
}
export function readEditionDates(dates: Localized) {
	const en = dates.en.split(separator), ar = dates.ar.split(separator);
	const extra: string[] = [];
	while (en.length > 1 && ar.length > 1) {
		const day = labelDay(en[en.length - 1]);
		if (!day || !ar[ar.length - 1].trim()) break;
		extra.unshift(day); en.pop(); ar.pop();
	}
	return { primary: { en: en.join(separator), ar: ar.join(separator) }, extra };
}
export function writeEditionDates(primary: Localized, extra: string[]): Localized {
	const parts = [primary, ...extra.map(dateLabel)];
	return { en: parts.map(p => p.en).join(separator), ar: parts.map(p => p.ar).join(separator) };
}
