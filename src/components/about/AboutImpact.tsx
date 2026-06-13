"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";

export function AboutImpact() {
	const { locale, t } = useI18n();
	const isAr = locale === "ar";

	return (
		<section className="bg-white py-20 lg:py-24">
			<Container>
				<div className="rounded-3xl bg-[var(--color-navy-dark)] px-8 py-16 text-center lg:px-16">
					<div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
						{t.aboutp.impactLabel}
					</div>
					<h2
						className={`mt-5 font-display text-4xl font-bold text-white ${
							isAr ? "leading-[1.4]" : ""
						}`}
					>
						{t.aboutp.impactTitle1}
						<span className="text-[var(--color-gold)]">
							{" "}
							{t.aboutp.impactTitle2}
						</span>
					</h2>
					<p className="mx-auto mt-6 max-w-3xl text-[15px] leading-[1.9] text-[var(--color-silver)]">
						{t.aboutp.impactText}
					</p>
					<div className="mt-10">
						<Button href={`/${locale}/contact`} variant="gold" withArrow>
							{t.aboutp.impactButton}
						</Button>
					</div>
				</div>
			</Container>
		</section>
	);
}
