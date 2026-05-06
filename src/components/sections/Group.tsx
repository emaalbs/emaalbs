"use client";

import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Overline";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "@/components/ui/icons";
import { useI18n } from "@/i18n/provider";

export function Group() {
	const { t, dir } = useI18n();
	const isRtl = dir === "rtl";
	const brands = t.group.brands;
	return (
		<section id="group" className="relative bg-white py-20 lg:py-28">
			{/* Top divider */}
			<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-teal)] to-[var(--color-gold)] via-60%" />

			<Container>
				<div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
					<SectionHeading
						overline={t.group.overline}
						title={
							<>
								{t.group.title[0]}
								<br />
								{t.group.title[1]} <span className="text-[var(--color-gold-deep)]">{t.group.title[2]}</span>{t.group.title[3]}
							</>
						}
						subtitle={t.group.subtitle}
					/>
					<Button href="#" variant="outline-navy" withArrow>
						{t.group.cta}
					</Button>
				</div>

				<div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
					{brands.map((b) => (
						<a
							key={b.name}
							href="#"
							className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-teal)] hover:shadow-[0_20px_50px_rgba(0,102,102,0.15)]"
						>
							<div className="relative aspect-[4/5] overflow-hidden">
								<Image
									src={b.img}
									alt={b.name}
									fill
									sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
									className="object-cover transition-transform duration-700 group-hover:scale-105"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-[rgba(1,30,47,0.85)] via-[rgba(1,30,47,0.2)] to-transparent" />
								<div className="absolute left-5 top-5">
									<span className="inline-flex items-center rounded-full bg-[var(--color-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-overline text-[var(--color-navy)]">
										{b.tag}
									</span>
								</div>
								<div className="absolute inset-x-0 bottom-0 p-6">
									<h3 className="font-display text-xl font-bold text-white leading-tight">
										{b.name}
									</h3>
								</div>
							</div>
							<div className="flex flex-1 flex-col justify-between p-6">
								<p className="text-[14px] leading-[1.6] text-[var(--color-slate)]">{b.desc}</p>
								<div className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--color-teal)] transition-all group-hover:gap-3 group-hover:text-[var(--color-navy)]">
									{t.group.visit} <ArrowRightIcon className={`h-4 w-4 ${isRtl ? "rotate-180" : ""}`} />
								</div>
							</div>
						</a>
					))}
				</div>
			</Container>
		</section>
	);
}
