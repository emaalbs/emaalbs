"use client";

import { Briefcase, TrendingUp, Users, Handshake } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";

export function AboutApproach() {
	const { t, locale } = useI18n();
	const isAr = locale === "ar";

	const cards = [
		{ title: t.aboutp.approachCards[0], icon: <Briefcase size={28} /> },
		{ title: t.aboutp.approachCards[1], icon: <TrendingUp size={28} /> },
		{ title: t.aboutp.approachCards[2], icon: <Users size={28} /> },
		{ title: t.aboutp.approachCards[3], icon: <Handshake size={28} /> },
	];

	return (
		<section className="relative overflow-hidden bg-[var(--color-navy-dark)] py-20 lg:py-24">
			<div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-[var(--color-teal)]/10 blur-[120px]" />

			<Container>
				<div className="text-center">
					<div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
						{t.aboutp.approachLabel}
					</div>
					<h2 className={`mt-5 font-display text-4xl font-bold text-white ${isAr ? "leading-[1.4]" : "leading-tight"}`}>
						{t.aboutp.approachTitle1}
						<span className="text-[var(--color-gold)]">
							{" "}
							{t.aboutp.approachTitle2}
						</span>
					</h2>
				</div>

				<div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
					{cards.map((item) => (
						<div
							key={item.title}
							className="group rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-[var(--color-gold)]/30 hover:bg-white/[0.05]"
						>
							<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-gold)]/10 text-[var(--color-gold)] transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--color-gold)]/20">
								{item.icon}
							</div>
							<h3 className="mt-6 text-lg font-semibold leading-[1.5] text-white">
								{item.title}
							</h3>
						</div>
					))}
				</div>

				{t.aboutp.approachText && (
					<div className="mx-auto mt-16 max-w-3xl text-center">
						<div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
						<div className="mt-10 space-y-4">
							{t.aboutp.approachText.split("\n\n").map((paragraph, idx) => (
								<p
									key={idx}
									className={`text-[15px] leading-[1.85] text-[var(--color-silver)] ${
										idx === 0 ? "font-display text-xl font-bold text-white" : ""
									}`}
								>
									{paragraph}
								</p>
							))}
						</div>
					</div>
				)}
			</Container>
		</section>
	);
}
