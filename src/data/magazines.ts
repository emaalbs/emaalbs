export type Magazine = {
	id: number;
	slug: string;
	title: { en: string; ar: string };
	description: { en: string; ar: string };
	cover_image: string;
	pdf_url: string;
	pdf_url_en: string;
	pdf_url_ar: string;
	date: string;
};

/** Prefer the requested language, then the other version, then an unclassified legacy file. */
export function magazinePdfUrl(magazine: Pick<Magazine, "pdf_url"> & Partial<Pick<Magazine, "pdf_url_en" | "pdf_url_ar">>, locale: "en" | "ar"): string {
	return (locale === "ar" ? magazine.pdf_url_ar || magazine.pdf_url_en : magazine.pdf_url_en || magazine.pdf_url_ar) || magazine.pdf_url || "";
}
