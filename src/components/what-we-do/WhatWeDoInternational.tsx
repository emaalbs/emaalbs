"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/provider";
import { fadeUp } from "./motion";

export function WhatWeDoInternational() {
	const { t, locale } = useI18n();
	const isAr = locale === "ar";

	return (
		<motion.section
			{...fadeUp}
			className="relative overflow-hidden bg-[#07131F] py-28 text-white"
		>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(20,184,166,0.12),transparent_45%)]" />

			<div className="relative z-10 mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2 lg:px-8">
				<div>
					<Image
						src="/images/about-secondary.webp"
						alt=""
						width={700}
						height={700}
						className="rounded-[40px] object-cover"
					/>
				</div>

				<div className="rounded-[40px] border border-white/10 bg-white/[0.04] p-12 backdrop-blur-xl">
					<h2 className={`text-4xl font-bold md:text-5xl ${isAr ? "leading-[1.35]" : "leading-tight"}`}>
						{t.whatWeDo.international.title}
					</h2>
					<div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#C8A45D] to-teal-400" />
					<p className="mt-8 text-lg leading-9 text-white/70">
						{t.whatWeDo.international.description}
					</p>
				</div>
			</div>
		</motion.section>
	);
}
