"use client";

import { motion } from "framer-motion";
import { Network, Building2, Megaphone, Cpu } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { fadeUp } from "./motion";

const focusIcons = [Network, Building2, Megaphone, Cpu];

export function WhatWeDoFocus() {
	const { t } = useI18n();

	return (
		<motion.section
			{...fadeUp}
			className="relative overflow-hidden bg-[#07131F] py-28 text-white"
		>
			{/* ambient */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,164,93,0.08),transparent_60%)]" />
			<div className="absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-teal-500/10 blur-[140px]" />
			<div className="absolute -right-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[#C8A45D]/10 blur-[140px]" />

			{/* faint grid */}
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.06]"
				style={{
					backgroundImage:
						"linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
					backgroundSize: "60px 60px",
				}}
			/>

			<div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-8">
				<div className="text-center">
					<span className="inline-flex rounded-full border border-[#C8A45D]/30 bg-[#C8A45D]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-[#E5C98B]">
						{t.whatWeDo.badge}
					</span>
					<h2 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
						<span className="bg-gradient-to-r from-white via-white to-[#C8A45D] bg-clip-text text-transparent">
							{t.whatWeDo.focus.title}
						</span>
					</h2>
					<div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-[#C8A45D] to-teal-400" />
				</div>

				{/* Zigzag timeline */}
				<div className="relative mt-20">
					{/* central spine */}
					<div className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent lg:block" />

					<div className="space-y-14 lg:space-y-24">
						{t.whatWeDo.focus.items.map((item, index) => {
							const Icon = focusIcons[index % focusIcons.length];
							const reverse = index % 2 === 1;
							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 50 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.7, delay: index * 0.1 }}
									viewport={{ once: true, amount: 0.3 }}
									className={`relative grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
										reverse ? "lg:[&>*:first-child]:order-2" : ""
									}`}
								>
									{/* Big numeral side */}
									<div
										className={`relative flex ${
											reverse ? "lg:justify-start" : "lg:justify-end"
										}`}
									>
										<div className="relative">
											<span className="block font-display text-[clamp(6rem,12vw,11rem)] font-black leading-none tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgba(200,164,93,0.45)]">
												0{index + 1}
											</span>
											<div
												className={`absolute -bottom-2 ${
													reverse ? "left-2" : "right-2"
												} flex h-16 w-16 items-center justify-center rounded-2xl border border-[#C8A45D]/40 bg-[#0D1B2A] text-[#C8A45D] shadow-[0_0_50px_-10px_rgba(200,164,93,0.6)]`}
											>
												<Icon size={28} />
											</div>
										</div>
									</div>

									{/* Content side */}
									<div className="group relative rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-[#C8A45D]/40 lg:p-10">
										<div className="pointer-events-none absolute inset-0 rounded-[28px] bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.18),transparent_55%)] opacity-0 transition duration-500 group-hover:opacity-100" />
										<div className="relative">
											<div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A45D]">
												— 0{index + 1} —
											</div>
											<h3 className="mt-3 text-2xl font-semibold leading-tight md:text-3xl">
												{item.title}
											</h3>
											<div className="mt-4 h-px w-12 bg-gradient-to-r from-[#C8A45D] to-transparent" />
											<p className="mt-5 leading-8 text-white/70">
												{item.description}
											</p>
										</div>
									</div>

									{/* center dot */}
									<div className="pointer-events-none absolute left-1/2 top-1/2 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#C8A45D] bg-[#07131F] shadow-[0_0_20px_rgba(200,164,93,0.7)] lg:block" />
								</motion.div>
							);
						})}
					</div>
				</div>
			</div>
		</motion.section>
	);
}
