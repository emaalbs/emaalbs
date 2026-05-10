"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/provider";
import { fadeUp } from "./motion";

export function WhatWeDoCta() {
	const { t } = useI18n();

	return (
		<motion.section {...fadeUp} className="bg-white pb-28 pt-14">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-[40px] border border-[#C8A45D]/20 bg-gradient-to-br from-[#0D1B2A] to-[#102638] px-8 py-24 text-center text-white">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,164,93,0.15),transparent_45%)]" />

					<div className="relative z-10 mx-auto max-w-3xl">
						<h2 className="text-5xl font-bold">{t.whatWeDo.cta.title}</h2>
						<p className="mt-6 text-lg leading-8 text-white/70">
							{t.whatWeDo.cta.description}
						</p>

						<div className="mt-10">
							<Link href="/contact">
								<button className="group inline-flex items-center gap-3 rounded-full bg-[var(--color-gold)] px-8 py-4 text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--color-navy-dark)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#9F7A33] hover:text-white hover:shadow-[0_10px_30px_rgba(201,169,110,0.28)]">
									{t.whatWeDo.cta.button}
									<span className="transition-transform duration-300 group-hover:translate-x-1">
										↗
									</span>
								</button>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</motion.section>
	);
}
