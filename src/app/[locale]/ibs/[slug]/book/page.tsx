import { notFound } from "next/navigation";
import { Logo } from "@/components/site/Logo";
import { Container } from "@/components/ui/Container";
import { EditionBooking } from "@/components/ibs/EditionBooking";
import { getEditionBySlug } from "@/data/ibs";
import { getBookingConfig } from "@/lib/bookings";
import { bookingTiers } from "@/lib/booking-config";
import { paymentCheckoutsDisabled, localBookingSimulationEnabled } from "@/lib/payments/availability";

export const dynamic = "force-dynamic";
export const metadata = { title: "IBS | Book your seat", robots: { index: false, follow: false } };

export default async function EditionCheckoutPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
 const { locale, slug } = await params;
 const edition = await getEditionBySlug(slug);
 if (!edition) notFound();
 const ar = locale === "ar";
 const booking = await getBookingConfig(slug);
 const simulation = await localBookingSimulationEnabled();
 if (await paymentCheckoutsDisabled() && !simulation) booking.enabled = false;
 const available = booking.enabled && bookingTiers(booking).some(tier => tier.enabled);
 const details = `/${locale}/ibs/${slug}`;
 return <main dir={ar ? "rtl" : "ltr"} className="min-h-screen bg-[var(--color-warm)]" data-booking-page>
  <Container>
   <header className="flex flex-wrap items-center justify-between gap-4 py-6">
    <a href={`/${locale}?enterSite=1`} aria-label={ar ? "موقع أعمال" : "EMAAL website"} className="rounded focus-visible:outline-2 focus-visible:outline-[var(--color-teal)]"><Logo height={32}/></a>
    <nav className="flex items-center gap-5 text-sm font-semibold text-[var(--color-teal)]" aria-label={ar ? "روابط الحجز" : "Booking links"}>
     <a href={details} className="py-3 underline-offset-4 hover:underline">{ar ? "تفاصيل القمة" : "Summit details"}</a>
     <a href={`/${ar ? "en" : "ar"}/ibs/${slug}/book`} lang={ar ? "en" : "ar"} className="py-3 underline-offset-4 hover:underline">{ar ? "English" : "العربية"}</a>
    </nav>
   </header>
   <h1 className="sr-only">{ar ? "حجز مقعد" : "Book your seat"} — {edition.title[ar ? "ar" : "en"]}</h1>
  </Container>
  {available ? <EditionBooking slug={slug} config={booking} date={edition.dates} location={edition.location} simulation={simulation} standalone/> :
   <Container><section className="rounded-3xl bg-white p-8 text-[var(--color-navy)]"><h2 className="text-2xl font-bold">{ar ? "الحجز غير متاح حاليًا" : "Booking is currently unavailable"}</h2><a href={details} className="mt-6 inline-block py-3 font-semibold text-[var(--color-teal)] underline">{ar ? "العودة إلى تفاصيل القمة" : "Return to summit details"}</a></section></Container>}
 </main>;
}
