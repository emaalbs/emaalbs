export type Magazine = {
	id: number;
	slug: string;
	title: { en: string; ar: string };
	description: { en: string; ar: string };
	cover_image: string;
	pdf_url: string;
	date: string;
};
