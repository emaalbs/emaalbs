"use client";

import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";

export function AboutInternational() {
	const { locale, t } = useI18n();
	const isAr = locale === "ar";

	return (
		<section className="relative overflow-hidden bg-[var(--color-navy)] py-20 lg:py-28">
			<div className="absolute inset-0 opacity-40">
				<div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[var(--color-gold)]/10 blur-[120px]" />
			</div>

			<Container>
				<div className="mx-auto max-w-4xl text-center">
					<div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
						{t.aboutp.internationalLabel}
					</div>
					<h2
						className={`mt-5 font-display text-4xl font-bold text-white ${
							isAr ? "leading-[1.4]" : "leading-tight"
						}`}
					>
						{t.aboutp.internationalTitle1}
						<br />
						{t.aboutp.internationalTitle2}
					</h2>
					<p className="mt-6 text-[15px] leading-[1.9] text-[var(--color-silver)]">
						{t.aboutp.internationalText}
					</p>
				</div>
			</Container>
		</section>
	);
}
