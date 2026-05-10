"use client";

import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";

export function HomeWhyEmaal() {
	const { t } = useI18n();
	const pillars = t.whyEmaal.pillars;
	return (
		<section id="why" className="relative bg-warm py-20 lg:py-28">
			<Container>
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-14">
					{/* Left: title block — vertically centered against the pillars */}
					<div className="lg:col-span-5">
						<div className="flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold-deep)]">
							<span className="inline-block h-px w-8 bg-[var(--color-gold-deep)]" />
							{t.whyEmaal.overline}
						</div>
						<h2 className="mt-4 font-display font-bold tracking-display text-[var(--color-navy)] text-[clamp(1.65rem,2.8vw,2.5rem)] leading-[1.15]">
							{t.whyEmaal.title[0]}
							<br />
							{t.whyEmaal.title[1]} <span className="text-[var(--color-gold-deep)]">{t.whyEmaal.title[2]}</span>
							<br />
							{t.whyEmaal.title[3]}
						</h2>
						<p className="mt-5 max-w-md text-[15px] leading-[1.65] text-[var(--color-slate)]">
							{t.whyEmaal.description}
						</p>
					</div>

					{/* Right: 3 numbered pillars */}
					<ol className="lg:col-span-7 space-y-px overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-line)]">
						{pillars.map((p, i) => (
							<li
								key={p.k}
								className="group relative bg-white p-7 transition-colors hover:bg-[var(--color-teal-tint)]/40"
							>
								{/* Hover gold left strip */}
								<div className="absolute left-0 top-0 h-full w-[3px] bg-[var(--color-teal)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

								<div className="flex items-start gap-5">
									<div className="font-numeric text-5xl font-bold leading-none text-[var(--color-line)] transition-colors group-hover:text-[var(--color-teal)]">
										0{i + 1}
									</div>
									<div className="min-w-0 flex-1">
										<div className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-teal)]">
											{p.k}
										</div>
										<h3 className="mt-1.5 font-display text-xl font-semibold leading-tight text-[var(--color-navy)]">
											{p.t}
										</h3>
										<p className="mt-2 max-w-lg text-[14px] leading-[1.6] text-[var(--color-slate)]">
											{p.d}
										</p>
									</div>
								</div>
							</li>
						))}
					</ol>
				</div>
			</Container>
		</section>
	);
}
