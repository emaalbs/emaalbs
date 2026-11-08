import assert from "node:assert/strict";
import { dateLabel, isoDay, readEditionDates, writeEditionDates } from "../src/lib/edition-dates.ts";

for (const primary of [
	{ en: "2026-12-06", ar: "2026-12-06" },
	{ en: "June 3–4, 2026", ar: "٣ و٤ حزيران" },
	{ en: "Date · TBA", ar: "يُعلن لاحقاً" },
	dateLabel("2028-02-29"),
]) {
	for (const extra of [[], ["2026-06-12"], ["2026-06-12", "2026-06-21"]]) {
		const stored = writeEditionDates(primary, extra);
		assert.deepEqual(readEditionDates(JSON.parse(JSON.stringify(stored))), { primary, extra });
		if (extra.length === 2) {
			assert.match(stored.en, /June 12, 2026 · June 21, 2026$/);
			assert.ok(stored.ar.endsWith(dateLabel(extra[1]).ar));
			assert.notEqual(dateLabel(extra[1]).ar, dateLabel(extra[1]).en);
		}
	}
}
assert.equal(isoDay("2026-02-29"), "");
console.log("Bilingual edition date round trips and legacy labels passed.");
