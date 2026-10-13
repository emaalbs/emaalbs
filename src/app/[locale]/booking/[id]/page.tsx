import { BookingStatus } from "@/components/ibs/BookingStatus";
export const metadata = { title: "IBS | Booking", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default async function Page({ params }: { params: Promise<{ locale: string; id: string }> }) {
	const { locale, id } = await params;
	return <BookingStatus id={id} locale={locale === "ar" ? "ar" : "en"} />;
}
