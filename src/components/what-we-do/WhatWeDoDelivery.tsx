"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Building2, Megaphone, Cpu } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { fadeUp } from "./motion";

const platforms = [
	{
		image: "/images/ibs.png",
		index: 0,
		Icon: Building2,
		accent: "var(--color-gold)",
		tag: "PLATFORM",
	},
	{
		image: "/images/ibs-feature.jpg",
		index: 1,
		Icon: Megaphone,
		accent: "var(--color-teal)",
		tag: "MEDIA",
	},
	{
		image: "/images/group-tech.jpg",
		index: 2,
		Icon: Cpu,
		accent: "var(--color-navy)",
		tag: "TECH",
	},
];

export function WhatWeDoDelivery() {
	const { t, locale } = useI18n();
	const isAr = locale === "ar";

	return (
		<motion.section
			{...fadeUp}
			className="relative overflow-hidden bg-[var(--color-warm)] py-28 text-[var(--color-ink)]"
		>
			<div className="pointer-events-none absolute -left-32 top-1/3 h-[400px] w-[400px] rounded-full bg-[var(--color-gold)]/10 blur-[140px]" />
			<div className="pointer-events-none absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[var(--color-teal)]/10 blur-[140px]" />

			<div className="relative mx-auto max-w-6xl px-6 lg:px-8">
				<div className="mx-auto max-w-3xl text-center">
					<span className="inline-flex items-center gap-3 rounded-full border border-[var(--color-line)] bg-white px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--color-gold-deep)]">
						<span className="inline-block h-px w-6 bg-[var(--color-gold)]" />
						{t.whatWeDo.badge}
					</span>
					<h2 className={`mt-5 font-display text-4xl font-bold text-[var(--color-navy)] md:text-5xl ${isAr ? "leading-[1.35]" : "leading-tight"}`}>
						{t.whatWeDo.delivery.title}
					</h2>
					<div className="mx-auto mt-5 h-1 w-24 rounded-full bg-[var(--color-gold)]" />
					<p className="mt-6 text-lg leading-8 text-[var(--color-slate)]">
						{t.whatWeDo.delivery.description}
					</p>
				</div>

				<div className="mt-20 space-y-8">
					{platforms.map((platform, index) => {
						const data = t.whatWeDo.delivery.platforms[platform.index];
						const reverse = index % 2 === 1;
						const { Icon, accent } = platform;
						return (
							<motion.article
								key={index}
								initial={{ opacity: 0, y: 40 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.7, delay: index * 0.1 }}
								viewport={{ once: true, amount: 0.25 }}
								className={`group relative grid overflow-hidden rounded-[32px] border border-[var(--color-line)] bg-white shadow-[0_4px_24px_-12px_rgba(1,30,47,0.15)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(1,30,47,0.35)] md:grid-cols-2 ${
									reverse ? "md:[&>*:first-child]:order-2" : ""
								}`}
							>
								{/* Accent bar */}
								<div
									className="absolute inset-x-0 top-0 z-10 h-1"
									style={{ backgroundColor: accent }}
								/>

								{/* Image side */}
								<div className="relative h-[280px] overflow-hidden md:h-auto md:min-h-[360px]">
									<Image
										src={platform.image}
										alt={data.title}
										fill
										sizes="(min-width: 768px) 50vw, 100vw"
										className="object-cover transition-transform duration-700 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-[var(--color-navy-dark)]/30 transition-opacity duration-500 group-hover:bg-[var(--color-navy-dark)]/10" />

									<div className="absolute left-5 top-5">
										<span
											className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-[var(--color-navy-dark)]/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur"
										>
											<span
												className="inline-block h-1.5 w-1.5 rounded-full"
												style={{ backgroundColor: accent }}
											/>
											{platform.tag}
										</span>
									</div>
									<div className="absolute bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-lg">
										<Icon size={26} style={{ color: accent }} />
									</div>
								</div>

								{/* Content side */}
								<div className="relative flex flex-col justify-center p-8 md:p-12">
									<div className="flex items-center gap-4">
										<span
											className="font-display text-5xl font-black leading-none"
											style={{ color: accent }}
										>
											0{index + 1}
										</span>
										<div
											className="h-px flex-1"
											style={{ backgroundColor: "var(--color-line)" }}
										/>
									</div>

									<h3 className={`mt-6 font-display text-3xl font-bold text-[var(--color-navy)] md:text-4xl ${isAr ? "leading-[1.35]" : "leading-tight"}`}>
										{data.title}
									</h3>
									<p className="mt-5 text-base leading-8 text-[var(--color-slate)]">
										{data.description}
									</p>

									<div className="mt-7 inline-flex w-fit items-center gap-3 transition group-hover:gap-4">
										<span
											className="h-px w-10 transition-all duration-500 group-hover:w-16"
											style={{ backgroundColor: accent }}
										/>
										<span
											className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-transform duration-500 group-hover:rotate-45"
											style={{ backgroundColor: accent }}
										>
											<ArrowUpRight size={16} />
										</span>
									</div>
								</div>
							</motion.article>
						);
					})}
				</div>
			</div>
		</motion.section>
	);
}
