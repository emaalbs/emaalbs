"use client";

import { Container } from "@/components/ui/Container";
import { ArrowRightIcon } from "@/components/ui/icons";
import { useI18n } from "@/i18n/provider";

export function CtaBand() {
	const { t, locale } = useI18n();
	const isAr = locale === "ar";
	return (
		<section className="relative bg-warm py-20 lg:py-28">
			<Container>
				<div className="relative overflow-hidden rounded-3xl border border-[var(--color-line)] bg-white px-8 py-14 sm:px-12 lg:px-16 lg:py-20">
					{/* Subtle decorative ornament */}
					<div
						className="pointer-events-none absolute inset-0 opacity-[0.5]"
						style={{
							backgroundImage:
								"radial-gradient(circle at 100% 0%, rgba(193,154,74,0.08), transparent 45%), radial-gradient(circle at 0% 100%, rgba(1,30,47,0.04), transparent 40%)",
						}}
					/>

					<div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
						{/* Copy */}
						<div className="lg:col-span-7">
							<div className="inline-flex items-center gap-3 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold-deep)]">
								<span className="inline-block h-px w-8 bg-[var(--color-gold-deep)]" />
								{t.ctaBand.overline}
							</div>
							<h2 className="mt-5 font-display font-bold tracking-display text-[var(--color-navy)] text-[clamp(1.85rem,4vw,3rem)] leading-[1.1]">
								{t.ctaBand.title[0]}{" "}
								<span className="italic font-medium text-[var(--color-gold-deep)]">
									{t.ctaBand.title[1]}
								</span>{t.ctaBand.title[2]}
							</h2>
							<p className="mt-5 max-w-xl text-[15.5px] leading-[1.65] text-[var(--color-slate)]">
								{t.ctaBand.description}
							</p>
						</div>

						{/* Action panel */}
						<div className="lg:col-span-5">
							<div className="flex flex-col gap-3">
								{/* Primary — navy filled */}
								<a
									href="#contact"
									className="group flex items-center justify-between gap-4 rounded-xl bg-[var(--color-navy)] p-5 transition-colors hover:bg-[var(--color-navy-dark)]"
								>
									<div>
										<div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
											{t.ctaBand.primaryLabel}
										</div>
										<div className="mt-1 font-display text-[17px] font-semibold text-white">
											{t.ctaBand.primaryTitle}
										</div>
									</div>
									<span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--color-gold)] text-[var(--color-navy)] transition-transform duration-300 ${isAr ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
										<ArrowRightIcon className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} />
									</span>
								</a>

								{/* Secondary — outline */}
								<a
									href="#contact"
									className="group flex items-center justify-between gap-4 rounded-xl border border-[var(--color-line)] bg-white p-5 transition-colors hover:border-[var(--color-teal)] hover:bg-[var(--color-teal-tint)]"
								>
									<div>
										<div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-slate)]/70">
											{t.ctaBand.secondaryLabel}
										</div>
										<div className="mt-1 font-display text-[17px] font-semibold text-[var(--color-navy)]">
											{t.ctaBand.secondaryTitle}
										</div>
									</div>
									<span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[var(--color-line)] text-[var(--color-teal)] transition-all duration-300 group-hover:border-[var(--color-teal)] group-hover:bg-[var(--color-teal)] group-hover:text-white ${isAr ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}>
										<ArrowRightIcon className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} />
									</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</Container>
		</section>
	);
}
