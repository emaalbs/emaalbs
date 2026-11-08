import type { Localized } from "@/data/ibs/types";
import { dateLabel, labelDay, readEditionDates } from "@/lib/edition-dates";

export function EditionDateList({ dates, locale }: { dates: Localized; locale: keyof Localized }) {
	const { primary, extra } = readEditionDates(dates);
	const first = labelDay(primary.en);
	return <span className="min-w-0">
		{first ? <time dateTime={first}><bdi>{primary[locale]}</bdi></time> : <bdi>{primary[locale]}</bdi>}
		{extra.map((day, i) => <span key={i}> · <time className="inline-block" dateTime={day}><bdi>{dateLabel(day)[locale]}</bdi></time></span>)}
	</span>;
}
