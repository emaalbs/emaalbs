"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Overline";
import { useI18n } from "@/i18n/provider";

const ventures = [
	{ image: "/images/group-ibs.jpg", dataKey: 0, tag: "01" },
	{ image: "/images/group-iraq24.jpg", dataKey: 1, tag: "02" },
	{ image: "/images/group-tech.jpg", dataKey: 2, tag: "03" },
	{ image: "/images/group-gaming.jpg", dataKey: 3, tag: "04" },
];

export function AboutVentures() {
	const { locale, t } = useI18n();
	const isAr = locale === "ar";
	const align = isAr ? "text-right" : "text-left";

	const featured = ventures[0];
	const featuredData = t.aboutp.ventureCards[featured.dataKey];
	const rest = ventures.slice(1);

	return (
		<section
			id="ventures"
			className="relative overflow-hidden bg-gradient-to-b from-white via-[var(--color-warm)] to-white py-24 lg:py-32"
		>
			<div className="pointer-events-none absolute -right-32 top-40 h-[420px] w-[420px] rounded-full bg-[var(--color-teal)]/8 blur-[140px]" />

			<Container>
				<SectionHeading
					align="center"
					overline={t.aboutp.venturesLabel}
					title={
						<>
							{t.aboutp.venturesTitle1}
							<br />
							<span className="text-[var(--color-gold-deep)]">
								{t.aboutp.venturesTitle2}
							</span>
						</>
					}
					subtitle={t.aboutp.venturesText}
				/>

				<div className="mt-16 grid gap-6 lg:grid-cols-5">
					{/* Featured venture */}
					<a
						href="#"
						className="group relative col-span-1 overflow-hidden rounded-[28px] border border-[var(--color-line)] bg-[var(--color-navy-dark)] lg:col-span-3"
					>
						<div className="relative h-[300px] lg:h-full lg:min-h-[520px]">
							<Image
								src={featured.image}
								alt={featuredData.title}
								fill
								sizes="(min-width: 1024px) 60vw, 100vw"
								className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-dark)] via-[var(--color-navy-dark)]/60 to-transparent" />

							<div className="absolute left-6 top-6 flex items-center gap-3">
								<span className="rounded-full border border-[var(--color-gold)]/40 bg-[var(--color-gold)]/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)] backdrop-blur">
									{t.aboutp.venturesLabel} · {featured.tag}
								</span>
							</div>

							<div className={`absolute inset-x-0 bottom-0 p-8 lg:p-10 ${align}`}>
								<h3 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-tight text-white">
									{featuredData.title}
								</h3>
								<p className="mt-4 max-w-xl text-[15px] leading-[1.8] text-[var(--color-silver)]">
									{featuredData.description}
								</p>
								<div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition group-hover:border-[var(--color-gold)]/60 group-hover:bg-[var(--color-gold)]/15">
									{featuredData.button}
									<ArrowUpRight
										size={16}
										className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
									/>
								</div>
							</div>
						</div>
					</a>

					{/* Secondary ventures */}
					<div className="col-span-1 grid gap-6 lg:col-span-2">
						{rest.map((item) => {
							const data = t.aboutp.ventureCards[item.dataKey];
							return (
								<a
									key={data.title}
									href="#"
									className="group relative flex overflow-hidden rounded-[24px] border border-[var(--color-line)] bg-white transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-teal)]/60 hover:shadow-[0_24px_50px_-20px_rgba(0,0,0,0.2)]"
								>
									<div className="relative h-auto w-2/5 shrink-0 overflow-hidden">
										<Image
											src={item.image}
											alt={data.title}
											fill
											sizes="(min-width: 1024px) 20vw, 40vw"
											className="object-cover transition-transform duration-700 group-hover:scale-110"
										/>
										<div className="absolute left-3 top-3 rounded-md bg-black/40 px-2 py-0.5 text-[10px] font-bold tracking-widest text-white backdrop-blur">
											{item.tag}
										</div>
									</div>

									<div className={`flex flex-1 flex-col justify-center p-5 ${align}`}>
										<h3 className="text-lg font-bold text-[var(--color-navy)] leading-tight">
											{data.title}
										</h3>
										<p className="mt-2 line-clamp-3 text-[13px] leading-[1.6] text-[var(--color-slate)]">
											{data.description}
										</p>
										<div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-teal)]">
											{data.button}
											<ArrowUpRight
												size={14}
												className="transition group-hover:translate-x-0.5"
											/>
										</div>
									</div>
								</a>
							);
						})}
					</div>
				</div>
			</Container>
		</section>
	);
}
